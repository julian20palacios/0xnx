from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import (
    Categoria,
    CategoriaProducto,
    Compra,
    CompraItem,
    Evento,
    Horario,
    ImagenGaleria,
    InformacionEmpresa,
    MensajeContacto,
    Notificacion,
    Pago,
    PasswordResetCode,
    Plan,
    Post,
    Producto,
    Promocion,
    RegistroInventario,
    Suscripcion,
    Testimonio,
    Usuario,
)


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('id_categoria', 'descripcion_categoria')
    search_fields = ('descripcion_categoria',)


@admin.register(Usuario)
class UsuarioAdmin(BaseUserAdmin):
    model = Usuario

    list_display = (
        'id', 'email', 'username', 'nombre', 'apellido', 'edad',
        'is_active', 'is_staff', 'is_superuser',
    )
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'groups')
    search_fields = ('email', 'username', 'nombre', 'apellido')
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informaci�n personal', {
            'fields': (
                'username', 'nombre', 'apellido', 'edad',
                'telefono', 'direccion',
                'contacto_emergencia_nombre',
                'contacto_emergencia_parentesco',
                'contacto_emergencia_telefono',
                'contacto_emergencia_email',
            ),
        }),
        ('Permisos', {
            'fields': (
                'is_active', 'is_staff', 'is_superuser',
                'groups', 'user_permissions',
            )
        }),
        ('Fechas importantes', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'username', 'nombre', 'apellido', 'edad',
                'telefono', 'direccion',
                'contacto_emergencia_nombre',
                'contacto_emergencia_parentesco',
                'contacto_emergencia_telefono',
                'contacto_emergencia_email',
                'password1', 'password2',
                'is_active', 'is_staff', 'is_superuser'
            ),
        }),
    )


@admin.register(PasswordResetCode)
class PasswordResetCodeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'code', 'created_at', 'expires_at', 'used')
    list_filter = ('used', 'expires_at')
    search_fields = ('user__email', 'user__username', 'code')
    ordering = ('-created_at',)


@admin.register(InformacionEmpresa)
class InformacionEmpresaAdmin(admin.ModelAdmin):
    list_display = ('id_empresa', 'nombre_empresa', 'email', 'telefono', 'updated_at')
    search_fields = ('nombre_empresa', 'email', 'telefono')


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('id_plan', 'nombre_plan', 'precio', 'duracion_dias', 'activo', 'destacado')
    list_filter = ('activo', 'destacado')
    search_fields = ('nombre_plan',)


@admin.register(Suscripcion)
class SuscripcionAdmin(admin.ModelAdmin):
    list_display = ('id_suscripcion', 'usuario', 'plan', 'estado', 'fecha_inicio', 'fecha_fin')
    list_filter = ('estado', 'renovacion_automatica')
    search_fields = ('usuario__email', 'usuario__username', 'plan__nombre_plan')


@admin.register(CategoriaProducto)
class CategoriaProductoAdmin(admin.ModelAdmin):
    list_display = ('id_categoria', 'nombre', 'slug', 'created_at')
    search_fields = ('nombre', 'slug')


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('id_producto', 'nombre', 'precio', 'stock', 'stock_reservado', 'activo')
    list_filter = ('activo', 'categoria')
    search_fields = ('nombre', 'sku')


@admin.register(RegistroInventario)
class RegistroInventarioAdmin(admin.ModelAdmin):
    list_display = ('id_registro', 'producto', 'cantidad', 'stock_resultante', 'created_at')
    list_filter = ('producto',)
    search_fields = ('producto__nombre', 'motivo')


@admin.register(Compra)
class CompraAdmin(admin.ModelAdmin):
    list_display = ('id_compra', 'usuario', 'total', 'estado', 'fecha_compra')
    list_filter = ('estado',)
    search_fields = ('usuario__email', 'usuario__username')


@admin.register(CompraItem)
class CompraItemAdmin(admin.ModelAdmin):
    list_display = ('id_item', 'compra', 'producto', 'cantidad', 'precio_unitario')
    search_fields = ('producto__nombre',)


@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ('id_pago', 'usuario', 'monto', 'metodo', 'estado', 'fecha_pago', 'tipo')
    list_filter = ('estado', 'metodo')
    search_fields = ('usuario__email', 'usuario__username', 'referencia_transaccion')


@admin.register(Horario)
class HorarioAdmin(admin.ModelAdmin):
    list_display = ('id_horario', 'dia', 'hora_apertura', 'hora_cierre', 'activo')
    list_filter = ('dia', 'activo')


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id_post', 'titulo', 'autor', 'fecha_publicacion', 'publicado')
    list_filter = ('publicado', 'categoria')
    search_fields = ('titulo', 'autor__email', 'autor__username')


@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ('id_evento', 'nombre', 'fecha', 'activo')
    list_filter = ('activo',)
    search_fields = ('nombre',)


@admin.register(Promocion)
class PromocionAdmin(admin.ModelAdmin):
    list_display = ('id_promocion', 'titulo', 'codigo', 'aplica_a', 'activo', 'usos_actuales', 'usos_maximos')
    list_filter = ('activo', 'aplica_a')
    search_fields = ('titulo', 'codigo')


@admin.register(MensajeContacto)
class MensajeContactoAdmin(admin.ModelAdmin):
    list_display = ('id_contacto', 'nombre', 'email', 'telefono', 'fecha', 'leido')
    list_filter = ('leido',)
    search_fields = ('nombre', 'email', 'telefono')


@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ('id_notificacion', 'usuario', 'titulo', 'fecha', 'leido')
    list_filter = ('leido',)
    search_fields = ('usuario__email', 'usuario__username', 'titulo')


@admin.register(Testimonio)
class TestimonioAdmin(admin.ModelAdmin):
    list_display = ('id_testimonio', 'usuario', 'calificacion', 'fecha', 'aprobado')
    list_filter = ('aprobado',)
    search_fields = ('usuario__email', 'usuario__username')


@admin.register(ImagenGaleria)
class ImagenGaleriaAdmin(admin.ModelAdmin):
    list_display = ('id_imagen', 'titulo', 'evento', 'fecha_publicacion', 'activo')
    list_filter = ('activo',)
    search_fields = ('titulo',)
