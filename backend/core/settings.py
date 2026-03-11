from pathlib import Path
from decouple import config, Csv

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Seguridad
SECRET_KEY = config("SECRET_KEY")
RENDER_EXTERNAL_HOSTNAME = config("RENDER_EXTERNAL_HOSTNAME", default="").strip()

def _parse_bool(value: str):
    value = (value or "").strip().lower()
    if value in ("1", "true", "yes", "on"):
        return True
    if value in ("0", "false", "no", "off"):
        return False
    return None

_debug_env = _parse_bool(config("DEBUG", default=""))
if _debug_env is None:
    env = config("ENVIRONMENT", default="").strip().lower()
    in_cloud = bool(RENDER_EXTERNAL_HOSTNAME) or env in ("production", "prod", "staging")
    DEBUG = not in_cloud
else:
    DEBUG = _debug_env

ALLOWED_HOSTS = config("ALLOWED_HOSTS", cast=Csv(), default="")
if RENDER_EXTERNAL_HOSTNAME and RENDER_EXTERNAL_HOSTNAME not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)


# Modelo de usuario personalizado
AUTH_USER_MODEL = 'aplicacion.Usuario'

# Aplicaciones instaladas
INSTALLED_APPS = [
    # Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Terceros
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt.token_blacklist',  

    # Tu app
    'aplicacion',
]


# Middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
]
if not DEBUG:
    MIDDLEWARE.append('whitenoise.middleware.WhiteNoiseMiddleware')
MIDDLEWARE += [
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Debe ir arriba de CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# URLs
ROOT_URLCONF = 'core.urls'

# Plantillas
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI
WSGI_APPLICATION = 'core.wsgi.application'

# Base de datos
# Base de datos: PostgreSQL vía variables de entorno
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='5432'),
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        # Opcional: tiempo de conexión persistente
        'CONN_MAX_AGE': int(config('DB_CONN_MAX_AGE', default=0)),
    }
}

# Validación de contraseñas
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internacionalización
LANGUAGE_CODE = 'es-co'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True

# Archivos estáticos
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
if DEBUG:
    STORAGES = {
        'default': {
            'BACKEND': 'django.core.files.storage.FileSystemStorage',
        },
        'staticfiles': {
            'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage',
        },
    }
else:
    STORAGES = {
        'default': {
            'BACKEND': 'django.core.files.storage.FileSystemStorage',
        },
        'staticfiles': {
            'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
        },
    }

# Archivos media (subidas por usuarios)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Tipo de campo por defecto
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'



# Configuración de Django REST Framework para incluir JWT e incluir permisos de autenticación
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# Configuración de CORS y CSRF dinámicamente
CORS_ALLOW_CREDENTIALS = True
FRONTEND_URL = config("FRONTEND_URL", default="").strip()

def _normalize_origin(url: str) -> str:
    # CORS espera un "origin" sin slash final.
    return url.rstrip("/")

_allowed_origins = []

if DEBUG:
    _allowed_origins.extend([
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ])

if FRONTEND_URL:
    _allowed_origins.append(_normalize_origin(FRONTEND_URL))

CORS_ALLOWED_ORIGINS = _allowed_origins
CSRF_TRUSTED_ORIGINS = _allowed_origins

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
USE_X_FORWARDED_HOST = True



from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),  # token de acceso dura 1 hora
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),     # token de refresco dura 1 día
    'ROTATE_REFRESH_TOKENS': False,                  
    'BLACKLIST_AFTER_ROTATION': True,             
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}
