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






from rest_framework.permissions import IsAuthenticated
class CategoriaViewSet(ModelViewSet):
    queryset = Categoria.objects.all().order_by('id_categoria')
    serializer_class = CategoriaSerializer
    # Enforce Django model permissions: view/add/change/delete for Categoria.
    # This also requires authentication by default.
    permission_classes = [DjangoModelPermissions]


    
