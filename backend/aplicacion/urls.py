from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, RegisterView, validar_token
from rest_framework_simplejwt.views import (
    TokenObtainPairView,   # Vista para obtener el token JWT (login)
    TokenRefreshView,      # Vista para refrescar el token JWT (usando refresh token)
)

# enrutador para las vistas basadas en ViewSets (REST)
router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categorias')  
# Esto crea rutas como /categorias/ y /categorias/<id>/ automáticamente

urlpatterns = [
    path('', include(router.urls)),  # Incluye todas las rutas registradas en el router

    # Ruta para registrar nuevos usuarios
    path('register/', RegisterView.as_view(), name='register'),  

    # Ruta para iniciar sesión y obtener el par de tokens JWT (access + refresh)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Ruta para refrescar el token de acceso usando el token de refresh
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Ruta personalizada que sirve para validar si un token es válido
    # (requiere que el token se pase en el header Authorization)
    path('validar-token/', validar_token),  
]
