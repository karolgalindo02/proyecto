
# Proyecto API Rest NODEJS


## Instalación 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._
* Clonar el repositorio
```
gh repo clone karolgalindo02/proyecto
```
* Mira **Librerías** para conocer las dependencias.

_Activar bases de datos._

![imagen](https://github.com/karolgalindo02/coches-flask/assets/122057880/9609bac2-a0f8-4bc7-bc31-f12c8c2bae8a)


### Estructuración 🔧

_Para ofrecer una mayor sostenibilidad del aplicativo se realizó la siguiente estructura de carpetas_

```
proyecto/
├── backend/
│   ├── config/
│   │   ├── config.js
│   │   ├── keys.js
│   │   └── passport.js
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── user.js
│   ├── routes/
│   │   └── userRoutes.js
│   └── server.js
└── database/
    └── db_node.sql

```

## Creditos proyecto 📦

* ![Tutorial 01_api_nodejs Profe Albeiro]([https://github.com/ProfeAlbeiro/04_software_backend/blob/main/js/01_api_nodejs.txt])

## Construido con 🛠️

_Herramientas y librerias que usamos dentro del proyecto_

* JavaScript – Lenguaje base de programación del backend
* Node.js – Entorno de ejecución para JavaScript en el servidor
* Express – Framework para crear el servidor y las rutas de la API
* HTTP – Módulo para crear el servidor HTTP
* CORS – Librería para habilitar el intercambio de recursos entre dominios
* Morgan – Middleware para el registro de peticiones HTTP
* MySQL – Librería para la conexión y gestión de la base de datos MySQL
* bcryptjs – Librería para el hash seguro de contraseñas
* Passport – Middleware para autenticación de usuarios
* Passport-JWT – Estrategia de Passport para autenticación con JWT
* jsonwebtoken – Librería para la generación y verificación de tokens JWT


## Pruebas con Postman APIREST 👾

* _API Tareas_

![imagen](https://github.com/karolgalindo02/proyecto/blob/dev/pruebas/GET%20Task.png)

![imagen](https://github.com/karolgalindo02/proyecto/blob/dev/pruebas/POST%20taskCreate.png)

![imagen](https://github.com/karolgalindo02/proyecto/blob/dev/pruebas/PUT%20taskUpdate.png)

![imagen](https://github.com/karolgalindo02/proyecto/blob/dev/pruebas/DEL%20taskDelete.png)


* _API Proyectos_

![imagen](https://github.com/karolgalindo02/proyecto/blob/dev/pruebas/GET%20project.png)

![imagen](https://github.com/karolgalindo02/proyecto/blob/dev/pruebas/POST%20projectCreate.png)

![imagen](https://github.com/karolgalindo02/proyecto/blob/dev/pruebas/PUT%20projectUpdate.png)

![imagen](https://github.com/karolgalindo02/proyecto/blob/dev/pruebas/DEL%20projectDelete.png)


## FRONTEND MOCKUP 📝

_En proceso de integración._
https://github.com/karolgalindo02/front-apptakio

