from rest_framework import serializers
from .models import Categoria, Entrenamiento, ComentarioTutorial

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'
        extra_kwargs = {
            'id_categoria': {'required': False},  
        }

class EntrenamientoSerializer(serializers.ModelSerializer):
    calificacion_promedio = serializers.FloatField(read_only=True)
    calificaciones_total = serializers.IntegerField(read_only=True)

    class Meta:
        model = Entrenamiento
        fields = (
            'id_jugada',
            'nombre_jugada',
            'nivel_dificultad',
            'youtube_url',
            'url_jugada',
            'descripcion',
            'consejos',
            'numero_orden',
            'categoria',
            'requisitos_posteriores',
            'realizado',
            'calificacion_promedio',
            'calificaciones_total',
        )
        extra_kwargs = {
            'id_jugada': {'required': False},
        }


class ComentarioTutorialSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.SerializerMethodField()
    usuario_email = serializers.EmailField(source='usuario.email', read_only=True)
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = ComentarioTutorial
        fields = (
            'id_comentario',
            'jugada',
            'comentario',
            'calificacion',
            'created_at',
            'usuario',
            'usuario_nombre',
            'usuario_email',
            'usuario_username',
        )
        extra_kwargs = {
            'usuario': {'read_only': True},
        }

    def get_usuario_nombre(self, obj):
        return obj.usuario.username or obj.usuario.email

#Serializer para el usuario personalizado de inicio de sesión
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework.authtoken.models import Token

User = get_user_model()  # Será tu modelo Usuario

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'nombre', 'apellido', 'edad', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
            'nombre': {'required': True},
            'apellido': {'required': False},
            'edad': {'required': False},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.is_staff = False  
        user.save()
        return user


class RegisterFormSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'nombre', 'apellido', 'edad', 'password', 'password2')
        extra_kwargs = {
            'password': {'write_only': True},
            'nombre': {'required': True},
            'apellido': {'required': False},
            'edad': {'required': False},
        }

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password2'):
            raise serializers.ValidationError({"password2": "Las contrasenas no coinciden."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('password2', None)
        user = User(**validated_data)
        user.set_password(password)
        user.is_staff = False
        user.save()
        return user
