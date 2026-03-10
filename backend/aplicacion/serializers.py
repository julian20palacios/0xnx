from rest_framework import serializers
from .models import Categoria

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'
        extra_kwargs = {
            'id_categoria': {'required': False},  
        }





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

