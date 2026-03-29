
# <img width="300" height="90" alt="takio-logo-dark(1)" src="https://github.com/user-attachments/assets/aea0faac-d508-4ed2-b133-d625dedf2f10" /> 
<p align="center">
  <img src="https://img.shields.io/badge/Status-En%20Desarrollo-green" alt="Status">
  <img src="https://img.shields.io/badge/Backend-Node.js-339933" alt="Node">
  <img src="https://img.shields.io/badge/Frontend-React%20Native%20%2B%20Expo-0081CB" alt="React Native">
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1" alt="MySQL">
</p>

</p>
Es una aplicación móvil diseñada para mejorar la productividad mediante la gestión de proyectos, tareas e integración de Chatbot IA.

> **Enfoque:** Estudiantes, trabajadores y pequeños equipos que buscan mejorar su organización y priorización de actividades sin la complejidad de herramientas corporativas pesadas.

---

## 🎯 Objetivos

### Objetivo General
Desarrollar una aplicación mobile colaborativa que permita a los usuarios gestionar tareas de forma eficiente mediante funcionalidades de creación, edición, eliminación y asignación.

### Objetivos Específicos
- 🔐 **Autenticación:** Registro e inicio de sesión seguro para múltiples usuarios.
- 🛠️ **Gestión (CRUD):** Control total sobre tareas y proyectos.
- 👥 **Colaboración:** Establecer relaciones usuario-tarea para asignaciones.
- 📊 **Visualización:** Interfaz intuitiva con filtros por estado y prioridad.
- 🤖 **IA (Próximamente):** Chatbot para creación inteligente de tareas.

---

## 🚀 Metodología: SCRUM
Implementamos **SCRUM** para garantizar iteraciones constantes y mejora continua durante el ciclo de vida del proyecto.

### Artefactos Utilizados
| Artefacto | Descripción |
| :--- | :--- |
| **Product Backlog** | Lista priorizada de todas las funcionalidades. |
| **Sprint Backlog** | Tareas específicas del ciclo de desarrollo actual. |
| **User Stories** | Definición de valor: *"Como [usuario], quiero [acción] para [beneficio]"*. |

---
## 🔍 Alcance del Sistema
- [x] Gestión de usuarios con autenticación (JWT).
- [x] Creación y visualización de proyectos.
- [x] CRUD de tareas (Crear, Editar, Eliminar, Marcar completada).
- [ ] Asignación de tareas a miembros específicos.
- [x] Implementación de filtros por estado.
- [x] Arquitectura basada en el patrón **MVC**.
- [ ] **Próximamente:** Chatbot con IA para creación automática de tareas.

## 📋 Levantamiento de Requisitos

### Requisitos Funcionales (RF)
| ID | Requisito | Descripción |
| :--- | :--- | :--- |
| **RF01** | **Gestión de Cuentas** | El sistema debe permitir registro y login de usuarios. |
| **RF02** | **Control de Proyectos** | Los usuarios pueden crear espacios de trabajo compartidos. |
| **RF03** | **Operaciones de Tareas** | Crear, editar y eliminar tareas dentro de un proyecto. |
| **RF04** | **Asignación** | Posibilidad de asignar una tarea a un responsable. |
| **RF05** | **Filtros** | Clasificar tareas por estado (Pendiente / Completada). |
| **RF06** | **IA Assistant** | Generación de tareas mediante lenguaje natural (Chatbot). |

### Requisitos No Funcionales (RNF)
| ID | Atributo | Descripción |
| :--- | :--- | :--- |
| **RNF01** | **Fiabilidad** | Persistencia de datos y manejo de errores con mensajes claros. |
| **RNF02** | **Usabilidad** | Interfaz optimizada para dispositivos móviles (Android). |
| **RNF03** | **Seguridad** | Cifrado de contraseñas (Hash) y validación de dominios. |
| **RNF04** | **Rendimiento** | Respuesta rápida de la API ante peticiones concurrentes. |

---

## 🏗️ Arquitectura del Sistema (MVC)
El proyecto sigue el patrón **Modelo-Vista-Controlador** para separar la lógica de negocio de la interfaz:

- **Modelo:** Gestión de entidades (Usuario, Proyecto, Tarea) y base de datos.
- **Vista:** Interfaz desarrollada en **React Native + Expo** (Android).
- **Controlador:** Endpoints **REST API** en Node.js que conectan la lógica con la UI.

---
## 📅 Cronograma de Actividades (Gantt)
| Fase | Semanas | Actividad |
| :--- | :--- | :--- |
| **Fase 1** | 1 - 2 | Documentación, Requerimientos y Metodología Scrum. |
| **Fase 2** | 3 - 4 | Diseño UI/UX integral en **Figma** y ajuste de DB. |
| **Fase 3** | 5 - 6 | Desarrollo Backend (Bugs) e Implementación de **Chatbot IA**. |
| **Fase 4** | 7 - 8 | Integración Final, Pruebas en Expo Go e Informe Técnico. |
<img width="1319" height="704" alt="imagen" src="https://github.com/user-attachments/assets/6cade8e9-df0a-422a-ba20-edee07c4baaf" />


## 🧪 Plan de Pruebas
| Caso de Prueba | Validación | Herramienta |
| :--- | :--- | :--- |
| **Prueba Unitaria** | Lógica de creación de tareas y validación de campos. | Jest |
| **Prueba de API** | Verificación de Endpoints y respuestas JSON. | Postman / Swagger |
| **Prueba de UI** | Navegación entre pantallas y carga de componentes. | React Testing Library |
| **Prueba de Usuario** | Flujo completo desde Login hasta cierre de tarea. | Expo Go (Android) |

## 🚀 Instalación 
 _Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._

### Requisitos previos
* Node.js instalado.
* Expo Go en tu dispositivo móvil o un emulador Android.

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
* ![Proj_Example Profe Albeiro]([[https://github.com/ProfeAlbeiro/prj_example/tree/main]](https://github.com/ProfeAlbeiro/06_software_mobil/blob/main/02_hibrido/react_native/react_native.txt))

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


## Casos de Uso Gestión de Tareas 📝
 <img width="591" height="321" alt="imagen" src="https://github.com/user-attachments/assets/77ee0a0e-92a8-4845-8777-0e8fcb39b2d3" />

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

## Vista App v1.0 📌
<img width="797" height="595" alt="imagen" src="https://github.com/user-attachments/assets/3f1e9ce3-6d36-4f66-8f28-007bb4c0ca03" />

