# PetCare Frontend - React Native Application

PetCare es una aplicación móvil desarrollada en React Native con Expo que permite a los usuarios gestionar la información médica de sus mascotas de forma sencilla y segura.

## 🚀 Características Principales

### 🔐 Sistema de Autenticación

- **Registro de usuarios** en dos pasos con validación completa
- **Login seguro** con validación de credenciales
- **Validación centralizada** para todos los formularios
- **Gestión de estados touched** para mejorar UX en validaciones

### 🐾 Gestión de Mascotas

- **Formulario completo** para crear/editar mascotas
- **Validación en tiempo real** de campos obligatorios
- **Selector de especies** con modal personalizado
- **Carga de fotos** desde cámara o galería
- **Campos especializados**: chip, fecha de nacimiento, raza, observaciones

### 🎨 Interfaz de Usuario

- **Diseño moderno** con gradientes y esquemas de color consistentes
- **Navegación fluida** con React Navigation
- **Footer animado** con iconos de MaterialIcons e Ionicons
- **Botones inteligentes** con estados de loading y deshabilitado
- **Dropdown components** reutilizables con múltiples modos de posicionamiento

### 📱 Componentes Reutilizables

- **Sistema de validación centralizado** en `utils/validation.js`
- **Constantes de tema** unificadas en `formConstants.js`
- **Headers personalizados** con gradientes y navegación
- **Dropdowns configurables** (center, absolute, inline)
- **Footer con animaciones** y navegación entre pestañas

### 🔧 Arquitectura Técnica

- **Contexto global** para gestión de mascotas con AsyncStorage
- **Validación DRY** con funciones reutilizables
- **Navegación con stack reset** para mejor UX
- **Componentes modulares** siguiendo principios de escalabilidad
- **Gestión de estados** con hooks personalizados

## 📋 Funcionalidades Implementadas

### Pantallas Principales

- **Landing Screen**: Página de bienvenida
- **Login/Register**: Sistema completo de autenticación
- **Home Screen**: Dashboard principal con lista de mascotas
- **NewPetForm**: Formulario completo para mascotas
- **Profile/Notifications**: Pantallas de navegación

### Características Avanzadas

- **Validación en tiempo real** sin errores prematuros
- **Loading states** en botones para mejor feedback
- **Navegación inteligente** con reset de stack
- **Persistencia de datos** con AsyncStorage
- **Iconografía consistente** con vector icons

### Mejoras de UX/UI

- **Estados touched** para validaciones progresivas
- **Botones deshabilitados** con feedback visual
- **Dropdowns inline** que se adaptan al contenedor
- **Gradientes unificados** en toda la aplicación
- **Animaciones suaves** en navegación y feedback

## 🛠 Tecnologías Utilizadas

### Core Framework

- **React Native** con Expo SDK 54
- **React Navigation** para navegación
- **AsyncStorage** para persistencia local
- **Expo Vector Icons** para iconografía

### Gestión de Estado

- **React Context** para estado global
- **Custom Hooks** para lógica reutilizable
- **Local State** con hooks de React

### Validación y Formularios

- **Sistema centralizado** de validación
- **Validadores específicos** por tipo de campo
- **Feedback visual** para estados de error

### UI/UX Components

- **Linear Gradients** para diseño moderno
- **Modal components** para selecciones
- **Activity Indicators** para estados de carga
- **Image Picker** para carga de fotos

## 📁 Estructura del Proyecto Actualizada

```
PetCare-frontend/
├── assets/                  # Recursos estáticos
│   ├── images/             # Logotipos y fotos
│   └── icons/              # Iconos personalizados
├── src/                    # Código fuente principal
│   ├── api/                # Llamadas a API
│   │   └── auth.js         # Autenticación
│   ├── components/         # Componentes reutilizables
│   │   ├── Forms/          # Formularios especializados
│   │   │   ├── NewPetForm.js
│   │   │   └── RegistrationForm.js
│   │   ├── Headers/        # Headers personalizados
│   │   ├── Utils/          # Componentes utilitarios
│   │   │   ├── Footer.js   # Navegación inferior
│   │   │   ├── Dropdown.js # Dropdown reutilizable
│   │   │   └── LinearGradient.js
│   │   └── ProvincePicker.js
│   ├── constants/          # Constantes globales
│   │   ├── formConstants.js # Temas, colores, opciones
│   │   └── provinces.js    # Datos de provincias
│   ├── contexts/           # Context API
│   │   ├── AuthContext.js  # Estado de autenticación
│   │   └── PetContext.js   # Estado de mascotas
│   ├── navigation/         # Configuración de navegación
│   │   └── AppNavigator.js # Stack principal
│   ├── screens/            # Pantallas principales
│   │   ├── Home/           # Dashboard principal
│   │   ├── Landing/        # Pantalla de bienvenida
│   │   ├── Login/          # Autenticación
│   │   ├── Register/       # Registro (2 pasos)
│   │   ├── Profile/        # Perfil de usuario
│   │   └── Notifications/  # Notificaciones
│   └── utils/              # Utilidades
│       └── validation.js   # Sistema de validación centralizado
├── App.js                  # Componente raíz
├── package.json           # Dependencias del proyecto
└── README.md              # Documentación
```

## 🔄 Flujo de Usuario Implementado

### 1. Onboarding y Autenticación

- Usuario llega a **Landing Screen**
- Puede **registrarse** en 2 pasos o **hacer login**
- Validación completa con feedback visual
- Navegación automática después del registro

### 2. Gestión de Mascotas

- Dashboard en **Home Screen** con lista de mascotas
- Botón para **crear nueva mascota**
- Formulario completo con validación en tiempo real
- Carga de fotos y datos completos
- Navegación automática de regreso al dashboard

### 3. Navegación y UX

- **Footer animado** con 3 secciones principales
- Navegación fluida entre pantallas
- Estados de loading en todas las acciones
- Feedback visual consistente

## 🎯 Logros Técnicos Destacados

### ✅ Sistema de Validación Escalable

- **Funciones centralizadas** para todos los formularios
- **Validadores específicos** (email, password, fechas, códigos postales)
- **Estados touched** para mejor experiencia de usuario
- **Feedback visual** con bordes rojos y mensajes de error

### ✅ Componentes Reutilizables

- **Dropdown component** con múltiples modos (center, absolute, inline)
- **Header component** personalizable con gradientes
- **Footer component** con animaciones y navegación
- **Form fields** estandarizados con validación

### ✅ Arquitectura Escalable

- **Constantes centralizadas** para temas y configuraciones
- **Context API** para estado global
- **Navegación estructurada** con React Navigation
- **Persistencia local** con AsyncStorage

### ✅ UX/UI Moderno

- **Gradientes consistentes** en toda la aplicación
- **Iconografía unificada** con vector icons
- **Estados de loading** en todos los botones
- **Animaciones suaves** para transiciones

## 🔧 Configuración de Desarrollo

### Dependencias Principales

```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install @expo/vector-icons react-native-vector-icons
npm install expo-image-picker @react-native-async-storage/async-storage
```

### Scripts Disponibles

```bash
# Comandos básicos
npm start          # Inicia el servidor de desarrollo
npm run android    # Ejecuta en Android
npm run ios        # Ejecuta en iOS
npm run web        # Ejecuta en navegador web

# Comandos de desarrollo y debugging
npx expo start --clear    # Inicia con cache limpio (recomendado para problemas)
npx expo start --tunnel   # Usa túnel para dispositivos en redes diferentes
npx expo start --localhost # Solo conexiones locales
npx expo start --lan     # Conexión por red local (por defecto)

# Hot Reload y Cache Management
npx expo r               # Reload manual de la aplicación
npx expo start --no-dev  # Modo producción (sin hot reload)
npx expo start --max-workers 1  # Limitar workers para dispositivos lentos

# Debugging y limpieza
npm run format           # Formatear código con Prettier
npx expo install --fix   # Reparar dependencias incompatibles
rm -rf node_modules && npm install  # Reinstalar dependencias completas
```

### 🔧 Solución de Problemas Comunes

#### Hot Reload no funciona

```bash
# Paso 1: Limpiar cache y reiniciar
npx expo start --clear

# Paso 2: Si persiste, actualizar dependencias
npx expo install --fix

# Paso 3: Reinstalación completa
rm -rf node_modules
npm install
npx expo start --clear
```

#### Configuración Metro para Hot Reload Óptimo

El proyecto ya incluye configuración optimizada en `metro.config.js`:
- `watchFolders` configurado para monitorear cambios
- `resetCache` habilitado para mejor detección
- Source maps mejorados para debugging

## 🚀 Próximos Pasos Sugeridos

### Funcionalidades Pendientes

- **Integración con backend** real
- **Sistema de notificaciones** push
- **Calendario de citas** veterinarias
- **Historial médico** detallado
- **Compartir información** entre usuarios

### Mejoras Técnicas

- **Testing unitario** con Jest
- **Integración con API** real
- **Optimización de rendimiento**
- **Implementación offline-first**
- **Analytics y tracking**

---

### Para hacer 22/09/2025

- _Persistent verification check for the date when register a pet_
  - base on the life expectancy of each animals
  - the date is always taking the current date
  - merge it with the sergi part

_Desarrollado con ❤️ usando React Native y Expo_
