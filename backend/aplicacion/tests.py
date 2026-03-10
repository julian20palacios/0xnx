from django.test import TestCase
from .models import Categoria

class CategoriaModelTest(TestCase):
    def test_crear_categoria(self):
        categoria = Categoria.objects.create(descripcion_categoria='Tecnología')
        self.assertEqual(categoria.descripcion_categoria, 'Tecnología')
