# **LOGIN ADMIN**

pxlxciosjulixn@gmail.com

Pass-2023

xas

# Paso a Paso activación de plantilla al descargar de GITHUB

Backend:

1. Crear archivo .env, donde estarán las variables como BD de datos y demas.

   C:\Users\Julian Herreño\OneDrive - Colombian Trade Company SAS\Escritorio\colegio\backend\.env
2. Crear entorno env
   Instalar el virtual env: pip -m install virtualenv
   Crear entorno env: python -m virtualenv env
   Activar entorno env: .\env\Scripts\Activate
3. Instalar dependencias de requirements.txt
4. Selecionar el interprete que esta dentro de env en scripts
   C:\Users\Julian Herreño\OneDrive - Colombian Trade Company SAS\Escritorio\0xnx\backend\env\Scripts
5. Modifcar la base de datos y crear una nueva en ENV
6. Instalar psycopg2
7. Realizar el makemigrations y crear un superuser
8. 
9. 
10. Frontend
11. Instalar las dependencias: npm install
12. Crear los dos archivos de env

    C:\Users\Julian Herreño\OneDrive - Colombian Trade Company SAS\Escritorio\colegio\frontend\.env:
    VITE_API_BASE_URL=http://127.0.0.1:8000/api/
    VITE_STRIPE_PUBLIC_KEY=pk_test_51Ro9LtDFNKDjvoNlX3uGnwvGvBX8Tusev7DkR1aRkJBX2uSmrMOnPVSxIJngtMgk13MJs9Wa1mSqvxQkqWyFa11Q00MTpIVJUe

    C:\Users\Julian Herreño\OneDrive - Colombian Trade Company SAS\Escritorio\colegio\frontend\.env.production

    VITE_API_BASE_URL=https://dataflow-backend-jp7b.onrender.com/api/
    VITE_STRIPE_PUBLIC_KEY=pk_test_51Ro9LtDFNKDjvoNlX3uGnwvGvBX8Tusev7DkR1aRkJBX2uSmrMOnPVSxIJngtMgk13MJs9Wa1mSqvxQkqWyFa11Q00MTpIVJUe
