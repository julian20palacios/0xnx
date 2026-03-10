from django.db import models
from django.conf import settings

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

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        full_name = f"{self.nombre} {self.apellido}".strip()
        return full_name or self.email
