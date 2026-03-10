
# FK al usuario autenticado (usa su PK id).

    usuario=models.ForeignKey(

    settings.AUTH_USER_MODEL,

    on_delete=models.CASCADE,

    db_column='id_usuario',

    related_name='categorias_usuarios',

    )
