
# Proyecto API Rest NODEJS || React Mobile Food-App


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
└── frontend/
    ├── src/
    │   ├── data/
    │   │   ├── repositories/
    │   │   │   ├── AuthRepository.tsx
    │   │   │   └── UserLocalRepository.tsx
    │   │   └── sources/
    │   │       ├── local/
    │   │       │   └── LocalStorage.tsx
    │   │       └── remote/
    │   │           ├── api/
    │   │           │   └── ApiDelivery.tsx
    │   │           └── models/
    │   │               └── ResponseApiDelivery.tsx
    │   ├── domain/
    │   │   ├── entities/
    │   │   │   └── User.tsx
    │   │   ├── repositories/
    │   │   │   ├── AuthRepository.tsx
    │   │   │   └── UserLocalRepository.tsx
    │   │   └── useCases/
    │   │       ├── auth/
    │   │       │   ├── LoginAuth.tsx
    │   │       │   └── RegisterAuth.tsx
    │   │       └── userLocal/
    │   │           ├── GetUserLocal.tsx
    │   │           ├── RemoveUserLocal.tsx
    │   │           └── SaveUserLocal.tsx
    │   └── presentation/
    │   |   ├── components/
    │   |   │   ├── CustomModal.tsx
    │   |   │   ├── CustomTextInput.tsx
    │   |   │   └── RoundedButton.tsx
    │   |   ├── hooks/
    │   |   │   └── useUserLocal.tsx
    │   |   ├── theme/
    │   |   │   └── AppTheme.tsx
    │   |   └── views/
    │   |       ├── home/
    │   |       │   ├── Home.tsx
    │   |       │   ├── Styles.tsx
    │   |       │   └── ViewModel.tsx
    │   |       ├── profile/
    │   |       │   └── info/
    │   |       │       ├── ProfileInfo.tsx
    │   |       │       └── ViewModel.tsx
    │   |       └── register/
    │   |           ├── Register.tsx
    │   |           ├── Styles.tsx
    │   |           └── ViewModel.tsx
    │   └── utils/
    │       └── Validators.tsx
    ├── App.tsx
    ├── app.json
    ├── package.json
    └── tsconfig.json

```

## Creditos proyecto 📦

* ![Tutorial 01_api_nodejs Profe Albeiro]([https://github.com/ProfeAlbeiro/04_software_backend/blob/main/js/01_api_nodejs.txt])
* ![Proj_Example Profe Albeiro]([https://github.com/ProfeAlbeiro/prj_example/tree/main])

## Construido con 🛠️

_Herramientas y librerias dentro del proyecto_

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

_FrontEnd_

* React Native – Framework para el desarrollo de aplicaciones móviles multiplataforma
* Expo – Plataforma que facilita el desarrollo y despliegue de apps con React Native
* TypeScript – Superset de JavaScript que añade tipado estático
* React Navigation – Librería para la gestión de navegación entre pantallas
* Axios – Cliente HTTP para la comunicación con la API
* React Native Screens – Optimizador del rendimiento en la navegación

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


## Pruebas de Caja Negra FRONTEND 🤖

a) Partición equivalente 📝

La partición en clases de equivalencia se realiza dividiendo los posibles valores de entrada y los posibles
valores de salida. El rango de valores definido se agrupa en clases de equivalencia.

* _Registro_

![imagen](https://github.com/karolgalindo02/proyecto/blob/frontend/pruebas/frontend/Datos%20Requeridos%20-%20FoodApp.png)

![imagen](https://github.com/karolgalindo02/proyecto/blob/frontend/pruebas/frontend/Datos%20Invalidos%20-%20FoodApp.png)

![imagen](https://github.com/karolgalindo02/proyecto/blob/frontend/pruebas/frontend/Datos%20V%C3%A1lidos%20-%20FoodApp.png)

![imagen](https://github.com/karolgalindo02/proyecto/blob/frontend/pruebas/frontend/Registro%20Exitoso%20-%20FoodApp.png)


* _Login_

![imagen](https://github.com/karolgalindo02/proyecto/blob/frontend/pruebas/frontend/Contrase%C3%B1a%20Invalida%20-%20FoodApp.png)

![imagen](https://github.com/karolgalindo02/proyecto/blob/frontend/pruebas/frontend/Login%20Exitoso%20-%20FoodApp.png)


* _Registro de datos en BDD_

![imagen](https://github.com/karolgalindo02/proyecto/blob/frontend/pruebas/frontend/Registro%20Conexi%C3%B3n.png)

![imagen](https://github.com/karolgalindo02/proyecto/blob/frontend/pruebas/frontend/Registro%20BDD.png)


