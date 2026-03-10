from django.contrib import admin
from .models import Categoria



@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('id_categoria', 'descripcion_categoria')
    search_fields = ('descripcion_categoria',)


# Admin para el usuario personalizado de inicio de sesión
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(BaseUserAdmin):
    model = Usuario

    # Campos visibles en la lista de usuarios
    list_display = (
        'id', 'email', 'username', 'nombre', 'apellido', 'edad',
        'is_active', 'is_staff', 'is_superuser',
    )
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'groups')
    search_fields = ('email', 'username', 'nombre', 'apellido')
    ordering = ('email',)

    # Campos al ver/editar un usuario en el admin
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información personal', {
            'fields': ('username', 'nombre', 'apellido', 'edad'),
        }),
        ('Permisos', {
            'fields': (
                'is_active', 'is_staff', 'is_superuser',
                'groups', 'user_permissions',
            )
        }),
        ('Fechas importantes', {'fields': ('last_login',)}),
    )

    # Campos al crear un nuevo usuario desde el admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'username', 'nombre', 'apellido', 'edad',
                'password1', 'password2',
                'is_active', 'is_staff', 'is_superuser'
            ),
        }),
    )
