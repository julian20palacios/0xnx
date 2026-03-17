from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoriaViewSet,
    EntrenamientoViewSet,
    RegisterView,
    RegisterFormView,
    GoogleLoginView,
    validar_token,
    permisos_categoria,
    permisos_usuario,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    PasswordResetVerifyView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,   # Vista para obtener el token JWT (login)
    TokenRefreshView,      # Vista para refrescar el token JWT (usando refresh token)
)

# enrutador para las vistas basadas en ViewSets (REST)
router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categorias')
router.register(r'entrenamientos', EntrenamientoViewSet, basename='entrenamientos')
# Esto crea rutas como /categorias/ y /categorias/<id>/ automÃƒÂ¡ticamente

urlpatterns = [
    path('', include(router.urls)),  # Incluye todas las rutas registradas en el router

    # Ruta para registrar nuevos usuarios
    path('register/', RegisterView.as_view(), name='register'),  
    path('register-form/', RegisterFormView.as_view(), name='register_form'),

    # Ruta para iniciar sesiÃƒÂ³n y obtener el par de tokens JWT (access + refresh)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login-google/', GoogleLoginView.as_view(), name='google_login'),

    # Ruta para refrescar el token de acceso usando el token de refresh
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Ruta personalizada que sirve para validar si un token es vÃƒÂ¡lido
    # (requiere que el token se pase en el header Authorization)
    path('validar-token/', validar_token),
    path('permisos/categorias/', permisos_categoria),
    path('permisos/usuario/', permisos_usuario),
    # Recuperar contrasena
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/verify/', PasswordResetVerifyView.as_view(), name='password_reset_verify'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
