from django.db import models
from django.conf import settings
from django.utils import timezone

class Categoria(models.Model):
    id_categoria = models.AutoField(primary_key=True, db_column='id_categoria')
    descripcion_categoria = models.CharField(max_length=150, db_column='descripcion_categoria')

    class Meta:
        db_table = 'categoria'
        verbose_name_plural = 'Categorias'

    def __str__(self):
        return self.descripcion_categoria


from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('El usuario debe tener un correo electrónico')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(email, username, password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user

class Usuario(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    nombre = models.CharField(max_length=150)
    apellido = models.CharField(max_length=150, null=True, blank=True)
    edad = models.PositiveIntegerField(null=True, blank=True)
    telefono = models.CharField(max_length=30, null=True, blank=True)
    direccion = models.CharField(max_length=250, null=True, blank=True)

    contacto_emergencia_nombre = models.CharField(max_length=150, null=True, blank=True)
    contacto_emergencia_parentesco = models.CharField(max_length=100, null=True, blank=True)
    contacto_emergencia_telefono = models.CharField(max_length=30, null=True, blank=True)
    contacto_emergencia_email = models.EmailField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        full_name = f"{self.nombre} {self.apellido}".strip()
        return full_name or self.email


class PasswordResetCode(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="password_reset_codes")
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=["user", "code"]),
            models.Index(fields=["expires_at"]),
        ]

    def is_expired(self):
        return timezone.now() >= self.expires_at


# models.py
from decimal import Decimal, ROUND_HALF_UP
from datetime import timedelta

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.db.models import F
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

# =========================================================
# INFORMACIÓN DE LA EMPRESA
# =========================================================
class InformacionEmpresa(models.Model):
    id_empresa = models.AutoField(primary_key=True)
    nombre_empresa = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    direccion = models.CharField(max_length=250, blank=True)

    telefono = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    whatsapp = models.CharField(max_length=30, blank=True)

    instagram = models.CharField(max_length=200, blank=True)
    facebook = models.CharField(max_length=200, blank=True)
    tiktok = models.CharField(max_length=200, blank=True)

    logo = models.ImageField(upload_to="empresa/logo/", null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'informacion_empresa'

    def __str__(self):
        return self.nombre_empresa


# =========================================================
# PLANES / MEMBRESÍAS
# =========================================================
class Plan(models.Model):
    id_plan = models.AutoField(primary_key=True)
    nombre_plan = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    duracion_dias = models.PositiveIntegerField(help_text="Duración en días", default=30)
    beneficios = models.TextField(blank=True)
    destacado = models.BooleanField(default=False)
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'plan'

    def __str__(self):
        return f"{self.nombre_plan} - {self.precio}"


# =========================================================
# SUSCRIPCIONES (relación usuario <-> plan)
# =========================================================
class Suscripcion(models.Model):
    id_suscripcion = models.AutoField(primary_key=True)

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="suscripciones"
    )

    plan = models.ForeignKey(
        Plan,
        on_delete=models.SET_NULL,
        null=True,
        related_name="suscripciones"
    )

    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField(null=True, blank=True)

    estado = models.CharField(
        max_length=20,
        choices=[
            ("activa", "Activa"),
            ("vencida", "Vencida"),
            ("cancelada", "Cancelada"),
            ("pendiente", "Pendiente"),
        ],
        default="pendiente"
    )

    renovacion_automatica = models.BooleanField(default=False)

    promocion_usada = models.ForeignKey(
        'Promocion',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="suscripciones_usadas"
    )
    promocion_contabilizada = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'suscripcion'
        ordering = ['-fecha_inicio']

    def __str__(self):
        return f"{self.usuario} - {self.plan} ({self.estado})"

    @classmethod
    def create_for_user(cls, usuario, plan_id, promocion_codigo=None):
        """
        Crea una Suscripcion en transacción segura y calcula el monto si hay promoción.
        NOTA: no crea el Pago aquí — la creación del Pago típicamente la hace la capa de servicio/checkout.
        """
        from django.db.models import Q  # import local para evitar ciclos
        from decimal import Decimal

        with transaction.atomic():
            # Solo una suscripcion activa por usuario
            if cls.objects.filter(usuario=usuario, estado='activa').exists():
                raise ValidationError("El usuario ya tiene una suscripcion activa")
            plan = Plan.objects.select_for_update().get(pk=plan_id)
            sus = cls.objects.create(usuario=usuario, plan=plan, estado='pendiente')

            # aplicar promocion si existe
            if promocion_codigo:
                promo = Promocion.objects.select_for_update().filter(codigo=promocion_codigo).first()
                if not promo or not promo.is_valid():
                    raise ValidationError("Promoción inválida o expirada")
                if not promo.can_apply_to_plan(plan):
                    raise ValidationError("Promoción no aplica a este plan")
                if promo.unica_por_usuario:
                    ya_uso = (
                        cls.objects.filter(usuario=usuario, promocion_usada=promo).exists()
                        or Compra.objects.filter(usuario=usuario, promocion=promo).exists()
                    )
                    if ya_uso:
                        raise ValidationError("La promoción ya fue usada por este usuario")
                sus.promocion_usada = promo
                # no modificamos fechas aquí — se activan al pagar
                # el conteo de uso se hace cuando el pago queda completado

            sus.save()
            return sus


# =========================================================
# CATEGORÍA DE PRODUCTOS
# =========================================================
class CategoriaProducto(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=120)
    descripcion = models.TextField(blank=True)
    slug = models.SlugField(max_length=140, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categoria_producto'

    def __str__(self):
        return self.nombre


# =========================================================
# PRODUCTOS
# =========================================================
class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    sku = models.CharField(max_length=100, blank=True, null=True)
    categoria = models.ForeignKey(
        CategoriaProducto,
        on_delete=models.SET_NULL,
        null=True,
        related_name="productos"
    )
    stock = models.IntegerField(default=0)
    stock_reservado = models.IntegerField(default=0)
    stock_minimo = models.IntegerField(default=0)
    imagen = models.ImageField(upload_to="productos/", null=True, blank=True)
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'producto'

    def __str__(self):
        return self.nombre


# =========================================================
# REGISTRO DE INVENTARIO (histórico)
# =========================================================
class RegistroInventario(models.Model):
    id_registro = models.AutoField(primary_key=True)
    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name="inventario_registros"
    )
    cantidad = models.IntegerField()  # positivo = suma, negativo = resta
    stock_resultante = models.IntegerField()
    motivo = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="inventario_movimientos"
    )

    class Meta:
        db_table = 'registro_inventario'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.producto.nombre} => {self.cantidad} ({self.stock_resultante})"


# =========================================================
# COMPRAS (ordenes de productos) - ahora con promocion, total_original, descuento_aplicado
# =========================================================
class Compra(models.Model):
    id_compra = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="compras"
    )

    # total real a pagar (después de descuento)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    # campos nuevos para auditoría
    total_original = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    descuento_aplicado = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))

    promocion = models.ForeignKey(
        'Promocion',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="compras_usadas"
    )
    promocion_contabilizada = models.BooleanField(default=False)

    estado = models.CharField(max_length=50, default='completado')  # completado, pendiente, cancelado
    fecha_compra = models.DateTimeField(default=timezone.now)
    direccion_envio = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'compra'
        ordering = ['-fecha_compra']

    def __str__(self):
        return f"Compra #{self.id_compra} - {self.usuario} - {self.total}"

    @classmethod
    def create_from_items(cls, usuario, items_payload, promocion_codigo=None, direccion_envio='', metodo_pago='card'):
        """
        Crea Compra + CompraItem + Pago en una transacción segura:
        - usa select_for_update() en productos para bloquear stock
        - aplica promocion (si existe) de forma segura con select_for_update() en la promocion
        Retorna (compra, pago)
        items_payload = [{"producto_id": 1, "cantidad": 2}, ...]
        """
        from . import Pago as PagoModel  # import local para evitar ciclos

        with transaction.atomic():
            # calcular subtotal y crear compra pendiente
            subtotal = Decimal('0.00')
            compra = cls.objects.create(usuario=usuario, total=Decimal('0.00'), direccion_envio=direccion_envio, estado='pendiente')

            # bloquear los productos y validar stock
            producto_ids = [it["producto_id"] for it in items_payload]
            productos_qs = Producto.objects.select_for_update().filter(id_producto__in=producto_ids)
            productos_map = {p.id_producto: p for p in productos_qs}

            for it in items_payload:
                producto = productos_map.get(it["producto_id"])
                if not producto:
                    raise ValidationError(f"Producto {it['producto_id']} no existe")
                cantidad = int(it["cantidad"])
                disponible = producto.stock - producto.stock_reservado
                if disponible < cantidad:
                    raise ValidationError(f"Stock insuficiente para {producto.nombre}")
                precio_unit = producto.precio
                subtotal += (precio_unit * cantidad)
                CompraItem.objects.create(compra=compra, producto=producto, cantidad=cantidad, precio_unitario=precio_unit)
                producto.stock_reservado = producto.stock_reservado + cantidad
                producto.save(update_fields=['stock_reservado'])

            compra.total_original = subtotal

            # aplicar promocion si aplica
            if promocion_codigo:
                promo = Promocion.objects.select_for_update().filter(codigo=promocion_codigo).first()
                if not promo or not promo.is_valid():
                    raise ValidationError("Promoción inválida o expirada")
                if not promo.can_apply_to_products(producto_ids):
                    raise ValidationError("Promoción no aplica a estos productos")
                if promo.unica_por_usuario:
                    ya_uso = (
                        cls.objects.filter(usuario=usuario, promocion=promo).exists()
                        or Suscripcion.objects.filter(usuario=usuario, promocion_usada=promo).exists()
                    )
                    if ya_uso:
                        raise ValidationError("La promoción ya fue usada por este usuario")
                # calcular descuento
                descuento, total_final = promo.apply(subtotal)
                compra.promocion = promo
                compra.descuento_aplicado = descuento
                compra.total = total_final
            else:
                compra.total = subtotal

            compra.save()

            # crear Pago pendiente
            pago = PagoModel.objects.create(
                usuario=usuario,
                monto=compra.total,
                metodo=metodo_pago,
                estado='pendiente',
                compra=compra
            )

            return compra, pago


class CompraItem(models.Model):
    id_item = models.AutoField(primary_key=True)
    compra = models.ForeignKey(
        Compra,
        on_delete=models.CASCADE,
        related_name="items"
    )
    producto = models.ForeignKey(
        Producto,
        on_delete=models.SET_NULL,
        null=True,
        related_name="compra_items"
    )
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'compra_item'

    def __str__(self):
        return f"{self.producto} x {self.cantidad}"


# =========================================================
# PAGOS
# - Validación: exactamente UNA de (suscripcion, compra) debe estar poblada.
# - Propiedad `tipo` devuelve 'suscripcion' o 'compra'.
# =========================================================
class Pago(models.Model):
    id_pago = models.AutoField(primary_key=True)

    METODOS = [
        ('card', 'Tarjeta'),
        ('nequi', 'Nequi'),
        ('daviplata', 'Daviplata'),
        ('transfer', 'Transferencia'),
        ('cash', 'Efectivo'),
    ]

    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('completado', 'Completado'),
        ('fallido', 'Fallido'),
        ('reembolsado', 'Reembolsado'),
    ]

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="pagos"
    )

    monto = models.DecimalField(max_digits=10, decimal_places=2)
    metodo = models.CharField(max_length=30, choices=METODOS)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    referencia_transaccion = models.CharField(max_length=200, blank=True, null=True)
    fecha_pago = models.DateTimeField(default=timezone.now)

    # UNA de estas DOS debe existir (validación en clean())
    suscripcion = models.ForeignKey(
        Suscripcion,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="pagos"
    )
    compra = models.ForeignKey(
        Compra,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="pagos"
    )

    # metadata del gateway / respuesta del proveedor de pago
    metadata = models.JSONField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pago'
        ordering = ['-fecha_pago']

    def __str__(self):
        return f"{self.usuario} - {self.monto} ({self.estado})"

    def clean(self):
        """
        Validación: exactamente uno de los campos (suscripcion, compra) debe estar poblado.
        """
        super().clean()
        tiene_sus = bool(self.suscripcion_id)
        tiene_compra = bool(self.compra_id)
        if tiene_sus == tiene_compra:  # ambos True o ambos False
            raise ValidationError("Debe especificar exactamente una: 'suscripcion' o 'compra' (no ambas ni ninguna).")

    def save(self, *args, **kwargs):
        # validaciones antes de guardar
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def tipo(self):
        if self.suscripcion_id:
            return "suscripcion"
        if self.compra_id:
            return "compra"
        return None


# =========================================================
# HORARIOS
# =========================================================
class Horario(models.Model):
    id_horario = models.AutoField(primary_key=True)
    DIA_CHOICES = [
        ('monday','Lunes'),
        ('tuesday','Martes'),
        ('wednesday','Miércoles'),
        ('thursday','Jueves'),
        ('friday','Viernes'),
        ('saturday','Sábado'),
        ('sunday','Domingo'),
    ]
    dia = models.CharField(max_length=20, choices=DIA_CHOICES)
    hora_apertura = models.TimeField()
    hora_cierre = models.TimeField()
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'horario'
        unique_together = ('dia', 'hora_apertura', 'hora_cierre')

    def __str__(self):
        return f"{self.get_dia_display()}: {self.hora_apertura} - {self.hora_cierre}"


# =========================================================
# POSTS / NOTICIAS
# =========================================================
class Post(models.Model):
    id_post = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=250)
    contenido = models.TextField()
    imagen = models.ImageField(upload_to="blog/", null=True, blank=True)
    fecha_publicacion = models.DateTimeField(default=timezone.now)
    autor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="posts"
    )
    publicado = models.BooleanField(default=True)
    categoria = models.CharField(max_length=100, blank=True)

    class Meta:
        db_table = 'post'
        ordering = ['-fecha_publicacion']

    def __str__(self):
        return self.titulo


# =========================================================
# EVENTOS
# =========================================================
class Evento(models.Model):
    id_evento = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    fecha = models.DateField()
    hora = models.TimeField(null=True, blank=True)
    imagen = models.ImageField(upload_to="events/", null=True, blank=True)
    capacidad = models.PositiveIntegerField(null=True, blank=True)
    ubicacion = models.CharField(max_length=250, blank=True)
    organizador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="eventos_organizados"
    )
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'evento'
        ordering = ['-fecha']

    def __str__(self):
        return f"{self.nombre} - {self.fecha}"


# =========================================================
# PROMOCIONES (mejoras: helpers)
# =========================================================
class Promocion(models.Model):
    id_promocion = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    descuento_porcentaje = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    descuento_valor = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    codigo = models.CharField(max_length=80, blank=True, null=True, unique=True)
    fecha_inicio = models.DateTimeField(null=True, blank=True)
    fecha_fin = models.DateTimeField(null=True, blank=True)
    activo = models.BooleanField(default=True)
    usos_maximos = models.PositiveIntegerField(null=True, blank=True)
    usos_actuales = models.PositiveIntegerField(default=0)
    aplica_a = models.CharField(
        max_length=20,
        choices=[
            ('todo', 'Todo'),
            ('planes', 'Planes'),
            ('productos', 'Productos'),
        ],
        default='todo'
    )
    planes = models.ManyToManyField(Plan, blank=True, related_name="promociones")
    productos = models.ManyToManyField(Producto, blank=True, related_name="promociones")
    unica_por_usuario = models.BooleanField(default=False)

    class Meta:
        db_table = 'promocion'

    def __str__(self):
        return self.titulo

    def is_valid(self):
        """
        Valida que la promoción esté activa, dentro de fechas (si aplican) y que no haya superado usos.
        """
        now = timezone.now()
        if not self.activo:
            return False
        if self.fecha_inicio and now < self.fecha_inicio:
            return False
        if self.fecha_fin and now > self.fecha_fin:
            return False
        if self.usos_maximos is not None and self.usos_actuales >= self.usos_maximos:
            return False
        return True

    def apply(self, amount: Decimal):
        """
        Calcula (descuento, total_final) aplicando la promoción al monto dado.
        Devuelve tuplas Decimal con 2 decimales.
        """
        amount = Decimal(amount)
        discount = Decimal('0.00')

        if self.descuento_valor:
            discount = min(Decimal(self.descuento_valor), amount)
        elif self.descuento_porcentaje:
            discount = (amount * (Decimal(self.descuento_porcentaje) / Decimal('100')))

        # redondear a 2 decimales
        discount = discount.quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
        final = (amount - discount).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
        if final < Decimal('0.00'):
            final = Decimal('0.00')
        return discount, final

    def increment_usage(self):
        """
        Incrementa usos_actuales de forma segura usando F() para evitar race conditions.
        """
        self.usos_actuales = F('usos_actuales') + 1
        self.save(update_fields=['usos_actuales'])
        # refrescar para que el objeto actual tenga el valor entero real
        self.refresh_from_db(fields=['usos_actuales'])

    def can_apply_to_plan(self, plan):
        if self.aplica_a == 'productos':
            return False
        if self.planes.exists() and (not plan or not self.planes.filter(pk=plan.pk).exists()):
            return False
        return True

    def can_apply_to_products(self, producto_ids):
        if self.aplica_a == 'planes':
            return False
        if self.productos.exists():
            permitidos = set(self.productos.values_list('id_producto', flat=True))
            if not set(producto_ids).issubset(permitidos):
                return False
        return True


# =========================================================
# MENSAJES DE CONTACTO
# =========================================================
class MensajeContacto(models.Model):
    id_contacto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=150)
    email = models.EmailField()
    telefono = models.CharField(max_length=30, blank=True)
    mensaje = models.TextField()
    fecha = models.DateTimeField(default=timezone.now)
    leido = models.BooleanField(default=False)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="contact_messages"
    )

    class Meta:
        db_table = 'contacto_mensaje'
        ordering = ['-fecha']

    def __str__(self):
        return f"{self.nombre} - {self.email}"


# =========================================================
# NOTIFICACIONES
# =========================================================
class Notificacion(models.Model):
    id_notificacion = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notificaciones"
    )
    titulo = models.CharField(max_length=200)
    mensaje = models.TextField()
    fecha = models.DateTimeField(default=timezone.now)
    leido = models.BooleanField(default=False)

    class Meta:
        db_table = 'notificacion'
        ordering = ['-fecha']

    def __str__(self):
        return f"{self.titulo} - {self.usuario}"


# =========================================================
# TESTIMONIOS
# =========================================================
class Testimonio(models.Model):
    id_testimonio = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="testimonios"
    )
    comentario = models.TextField()
    calificacion = models.PositiveSmallIntegerField(null=True, blank=True)  # 1-5
    fecha = models.DateTimeField(default=timezone.now)
    aprobado = models.BooleanField(default=False)

    class Meta:
        db_table = 'testimonio'
        ordering = ['-fecha']

    def __str__(self):
        return f"{self.usuario} - {self.calificacion}"


# =========================================================
# GALERÍA DE IMÁGENES
# =========================================================
class ImagenGaleria(models.Model):
    id_imagen = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=200, blank=True)
    imagen = models.ImageField(upload_to="galeria/")
    youtube_url = models.URLField(blank=True)
    descripcion = models.TextField(blank=True)
    fecha_publicacion = models.DateTimeField(default=timezone.now)
    evento = models.ForeignKey(
        Evento,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="imagenes"
    )
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'galeria_imagen'
        ordering = ['-fecha_publicacion']

    def __str__(self):
        return self.titulo or f"Imagen {self.id_imagen}"


# =========================================================
# SIGNAL: acciones post-pago (idempotente)
# - Si el pago queda en 'completado' y está asociado a una suscripción,
#   activa la suscripción y calcula fechas si faltan.
# - Si es una compra, reduce el stock de los productos en la orden y registra movimiento.
# - Evita aplicar efectos si ya se aplicaron (idempotencia) consultando registros existentes.
# =========================================================
@receiver(post_save, sender=Pago)
def pago_post_save(sender, instance: Pago, created, **kwargs):
    # Manejo de estados relevantes: completado / fallido / reembolsado
    if instance.estado not in ['completado', 'fallido', 'reembolsado']:
        return

    # --- IDÉNTICO: si ya procesamos esta compra/suscripción, salimos ---
    # Para compra: buscamos un registro de inventario con motivo que incluya la compra
    if instance.compra and instance.estado == 'completado':
        compra = instance.compra
        already = RegistroInventario.objects.filter(motivo=f"Venta (compra #{compra.id_compra})").exists()
        if already:
            # Ya procesado anteriormente — idempotencia
            return

    # Para suscripción: si ya está activa, no hacemos nada
    if instance.suscripcion and instance.estado == 'completado':
        sus = instance.suscripcion
        if sus.estado == 'activa':
            return

    # Si es pago por suscripcion -> activar y fijar fechas si hace falta
    if instance.suscripcion and instance.estado == 'completado':
        sus = instance.suscripcion
        changed = False
        # garantizar una sola suscripcion activa por usuario
        otras_activas = Suscripcion.objects.filter(usuario=sus.usuario, estado='activa').exclude(pk=sus.pk)
        if otras_activas.exists():
            otras_activas.update(estado='vencida', fecha_fin=timezone.now().date())
        if sus.estado != 'activa':
            sus.estado = 'activa'
            changed = True
        if not sus.fecha_inicio:
            sus.fecha_inicio = timezone.now().date()
            changed = True
        if not sus.fecha_fin and sus.plan:
            sus.fecha_fin = sus.fecha_inicio + timedelta(days=sus.plan.duracion_dias)
            changed = True
        if sus.promocion_usada and not sus.promocion_contabilizada:
            sus.promocion_usada.increment_usage()
            sus.promocion_contabilizada = True
            changed = True
        if changed:
            sus.save()

    # Si es pago por compra -> ajustar stock y crear registros de inventario
    if instance.compra and instance.estado == 'completado':
        compra = instance.compra
        for item in compra.items.select_related('producto').all():
            producto = item.producto
            if producto:
                # Liberar reserva y reducir stock (asegurar no negativo)
                producto.stock_reservado = max(0, producto.stock_reservado - item.cantidad)
                nueva_cantidad = max(0, producto.stock - item.cantidad)
                RegistroInventario.objects.create(
                    producto=producto,
                    cantidad=-item.cantidad,
                    stock_resultante=nueva_cantidad,
                    motivo=f"Venta (compra #{compra.id_compra})",
                    usuario=instance.usuario
                )
                producto.stock = nueva_cantidad
                producto.save(update_fields=['stock', 'stock_reservado'])
        if compra.promocion and not compra.promocion_contabilizada:
            compra.promocion.increment_usage()
            compra.promocion_contabilizada = True
            compra.save(update_fields=['promocion_contabilizada'])

    # Si el pago falla: liberar reservas y cancelar compra
    if instance.compra and instance.estado == 'fallido':
        compra = instance.compra
        for item in compra.items.select_related('producto').all():
            producto = item.producto
            if producto:
                producto.stock_reservado = max(0, producto.stock_reservado - item.cantidad)
                producto.save(update_fields=['stock_reservado'])
        compra.estado = 'cancelado'
        compra.save(update_fields=['estado'])

    # Si el pago se reembolsa: revertir inventario y cancelar
    if instance.compra and instance.estado == 'reembolsado':
        compra = instance.compra
        motivo_reverso = f"Reverso (compra #{compra.id_compra})"
        venta_aplicada = RegistroInventario.objects.filter(
            motivo=f"Venta (compra #{compra.id_compra})"
        ).exists()
        already_rev = RegistroInventario.objects.filter(motivo=motivo_reverso).exists()
        if venta_aplicada and not already_rev:
            for item in compra.items.select_related('producto').all():
                producto = item.producto
                if producto:
                    nueva_cantidad = producto.stock + item.cantidad
                    RegistroInventario.objects.create(
                        producto=producto,
                        cantidad=item.cantidad,
                        stock_resultante=nueva_cantidad,
                        motivo=motivo_reverso,
                        usuario=instance.usuario
                    )
                    producto.stock = nueva_cantidad
                    producto.save(update_fields=['stock'])
        elif not venta_aplicada:
            # si no se aplicó la venta, solo liberar reservas
            for item in compra.items.select_related('producto').all():
                producto = item.producto
                if producto:
                    producto.stock_reservado = max(0, producto.stock_reservado - item.cantidad)
                    producto.save(update_fields=['stock_reservado'])
        compra.estado = 'cancelado'
        compra.save(update_fields=['estado'])

    # Si el pago de suscripcion se reembolsa: desactivar/cancelar
    if instance.suscripcion and instance.estado == 'reembolsado':
        sus = instance.suscripcion
        if sus.estado != 'cancelada':
            sus.estado = 'cancelada'
            sus.fecha_fin = timezone.now().date()
            sus.save(update_fields=['estado', 'fecha_fin'])
