from rest_framework.viewsets import ModelViewSet
from .models import Categoria
from .serializers import CategoriaSerializer



# Vista para validar el token de acceso
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def validar_token(request):
    return Response({'valid': True})



#Vista para el registro de usuarios de inicio de sesión
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta
import secrets
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .email_utils import send_password_reset_code
from .models import PasswordResetCode
User = get_user_model()

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
    # Enforce Django model permissions: view/add/change/delete for Categoria.
    # This also requires authentication by default.
    permission_classes = [DjangoModelPermissions]


    
