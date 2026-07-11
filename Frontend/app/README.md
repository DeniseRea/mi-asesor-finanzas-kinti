# Mi Asesor Finanzas Kinti (Frontend)

Este proyecto es la interfaz de usuario para **Mi Asesor Finanzas Kinti**, desarrollado utilizando **Next.js** y estructurado con una arquitectura modular basada en **Feature-Sliced Design (FSD)** adaptada para Next.js App Router con soporte multi-idioma (i18n) nativo.

---

## 🚀 Comandos de Inicialización y Configuración

Los siguientes comandos se ejecutaron para inicializar y configurar el entorno de trabajo:

### 1. Inicialización de Next.js (con TypeScript y ESLint)
```bash
npx -y create-next-app@latest app --typescript --eslint --app --src-dir --no-tailwind --import-alias "@/*" --no-turbopack
```

### 2. Instalación de dependencias de arquitectura
```bash
npm install clsx
npm install -D @feature-sliced/eslint-config
```

### 3. Instalación de Tailwind CSS v4 y compiladores PostCSS
```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

---

## 🗺️ Estructura del Proyecto (Feature-Sliced Design)

El código fuente principal está en la carpeta `src/` y está organizado en 6 capas descendentes:

```text
src/
├── app/                              ① ENRUTADOR (Next.js)
│   └── [locale]/                     Prefijo dinámico: /es o /en
│       ├── layout.tsx                Estructura base (HTML/Body) + Sidebar FSD
│       ├── globals.css               Inicializador global de Tailwind CSS v4
│       ├── page.tsx                  Página de Inicio (Bridge a <Home />)
│       └── dashboard/
│           └── page.tsx              Página del Dashboard (Bridge a <Dashboard />)
│
├── pageviews/                        ② PANTALLAS (Views/Pageviews)
│   ├── home/
│   │   ├── Home.tsx                  Componente principal de Home (recibe i18n dict)
│   │   └── components/               Sub-componentes específicos (Hero.tsx, etc.)
│   └── dashboard/
│       ├── Dashboard.tsx             Componente principal de Dashboard
│       └── components/               Sub-componentes específicos (StatsCard, RevenueChart)
│
├── widgets/                          ③ BLOQUES GRANDES
│   └── Sidebar/
│       └── components/
│           └── Sidebar.tsx           Sidebar del sistema (Avatar + selector de idioma)
│
├── features/                         ④ ACCIONES DEL USUARIO (Features)
│   └── auth/
│       ├── components/
│       │   └── LoginForm.tsx         Formulario interactivo de login
│       └── api/
│           └── login.ts              Lógica de autenticación / petición HTTP
│
├── entities/                         ⑤ ENTIDADES DE NEGOCIO
│   └── user/
│       ├── components/
│       │   └── UserAvatar.tsx        Visualización y estado del usuario
│       └── model/
│           └── types.ts              Interfaces de TypeScript para el usuario
│
└── shared/                           ⑥ CAJA DE HERRAMIENTAS
    ├── components/
    │   └── Button.tsx                Botón común y reutilizable
    ├── api/
    │   └── apiClient.ts              Configuración de fetch para consumir endpoints
    ├── assets/
    │   └── icons/
    │       └── logo.svg              Recurso estático del logotipo de la app
    └── i18n/                         Configuración de internacionalización manual
        ├── dictionaries/
        │   ├── es.json               Diccionario en Español
        │   └── en.json               Diccionario en Inglés
        ├── getDictionary.ts          Función para importar diccionarios asíncronos
        └── config.ts                 Definición de locales soportados ('es', 'en')
```

---

## 🛠️ Desarrollo Local

Para arrancar el servidor en modo desarrollo, ejecuta los siguientes comandos desde la carpeta `Frontend/app`:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación. El middleware redireccionará automáticamente la raíz `/` a `/es` basándose en la configuración i18n por defecto.

### 📦 Compilación para Producción

Para validar tipos y compilar el proyecto optimizado de producción:
```bash
npm run build
```
