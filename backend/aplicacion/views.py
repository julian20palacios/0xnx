from rest_framework.viewsets import ModelViewSet
from .models import Categoria, Entrenamiento
from .serializers import CategoriaSerializer, EntrenamientoSerializer



# Vista para validar el token de acceso
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.response import Response
from .permissions import permissions_for_model, role_for_user

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def validar_token(request):
    return Response({'valid': True})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def permisos_categoria(request):
    return Response(permissions_for_model(request.user, Categoria))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def permisos_usuario(request):
    return Response(role_for_user(request.user))


#Vista para el registro de usuarios de inicio de sesión
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, RegisterFormSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta
import secrets
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .email_utils import send_password_reset_code
from decouple import config
from .models import PasswordResetCode
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
import re
User = get_user_model()


def _generate_unique_username(email):
    base = (email.split("@")[0] or "usuario").lower()
    base = re.sub(r"[^a-z0-9_]+", "", base) or "usuario"
    username = base
    counter = 1
    while User.objects.filter(username=username).exists():
        counter += 1
        username = f"{base}{counter}"
    return username

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("id_token") or request.data.get("credential")
        if not token:
            return Response({"detail": "Falta el id_token."}, status=status.HTTP_400_BAD_REQUEST)

        client_id = config("GOOGLE_CLIENT_ID", default=None)
        if not client_id:
            return Response({"detail": "GOOGLE_CLIENT_ID no configurado."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            idinfo = google_id_token.verify_oauth2_token(token, google_requests.Request(), client_id)
        except Exception:
            return Response({"detail": "Token de Google invalido."}, status=status.HTTP_400_BAD_REQUEST)

        email = idinfo.get("email")
        if not email:
            return Response({"detail": "No se pudo obtener el correo."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email__iexact=email).first()
        if not user:
            username = _generate_unique_username(email)
            nombre = idinfo.get("given_name") or username
            apellido = idinfo.get("family_name") or ""
            user = User(email=email, username=username, nombre=nombre, apellido=apellido)
            user.set_unusable_password()
            user.save()
            grupo_user, _ = Group.objects.get_or_create(name="User")
            user.groups.add(grupo_user)
        else:
            # Si el usuario no tiene grupos, asignarlo a User por defecto
            if not user.groups.exists():
                grupo_user, _ = Group.objects.get_or_create(name="User")
                user.groups.add(grupo_user)

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_200_OK,
        )

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip()
        if not email:
            return Response({"detail": "El correo es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email__iexact=email).first()
        if user:
            PasswordResetCode.objects.filter(user=user, used=False).update(used=True)
            code = f"{secrets.randbelow(1000000):06d}"
            expires_at = timezone.now() + timedelta(minutes=15)
            PasswordResetCode.objects.create(user=user, code=code, expires_at=expires_at)
            try:
                send_password_reset_code(user.email, code)
            except Exception:
                return Response(
                    {"detail": "No se pudo enviar el correo de recuperacion."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        return Response(
            {"detail": "Si el correo existe, te enviamos un codigo para restablecer."},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip()
        code = (request.data.get("code") or "").strip()
        new_password = request.data.get("new_password")

        if not email or not code or not new_password:
            return Response(
                {"detail": "Faltan datos para restablecer la contrasena."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(email__iexact=email).first()
        if not user:
            return Response({"detail": "Codigo invalido o expirado."}, status=status.HTTP_400_BAD_REQUEST)

        reset_code = (
            PasswordResetCode.objects.filter(
                user=user,
                code=code,
                used=False,
                expires_at__gt=timezone.now(),
            )
            .order_by("-created_at")
            .first()
        )
        if not reset_code:
            return Response({"detail": "Codigo invalido o expirado."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user=user)
        except ValidationError as exc:
            return Response({"detail": exc.messages}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        reset_code.used = True
        reset_code.save(update_fields=["used"])

        return Response({"detail": "Contrasena actualizada."}, status=status.HTTP_200_OK)


class PasswordResetVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip()
        code = (request.data.get("code") or "").strip()

        if not email or not code:
            return Response(
                {"detail": "Faltan datos para verificar el codigo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(email__iexact=email).first()
        if not user:
            return Response({"detail": "Codigo invalido o expirado."}, status=status.HTTP_400_BAD_REQUEST)

        reset_code = (
            PasswordResetCode.objects.filter(
                user=user,
                code=code,
                used=False,
                expires_at__gt=timezone.now(),
            )
            .order_by("-created_at")
            .first()
        )

        if not reset_code:
            return Response({"detail": "Codigo invalido o expirado."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Codigo valido."}, status=status.HTTP_200_OK)





class CategoriaViewSet(ModelViewSet):
    queryset = Categoria.objects.all().order_by('id_categoria')
    serializer_class = CategoriaSerializer
    permission_classes = [DjangoModelPermissions]


class EntrenamientoViewSet(ModelViewSet):
    queryset = Entrenamiento.objects.all().order_by('numero_orden')
    serializer_class = EntrenamientoSerializer
    permission_classes = [DjangoModelPermissions]


class RegisterFormView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterFormSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        grupo_user, _ = Group.objects.get_or_create(name="User")
        user.groups.add(grupo_user)

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED,
        )
