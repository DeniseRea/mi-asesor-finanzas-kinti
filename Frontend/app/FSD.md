mi-proyecto/
│
├── public/
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   │
│   ├── app/                              ①  ENRUTADOR (Next.js)
│   │   └── [locale]/                         Carpeta dinámica: "es" o "en"
│   │       ├── layout.jsx                    Estructura base + Providers
│   │       ├── globals.css                   Único CSS: @tailwind base...
│   │       ├── page.jsx                      "/es" o "/en" → importa <Home />
│   │       └── dashboard/
│   │           └── page.jsx                  "/es/dashboard" → importa <Dashboard />
│   │
│   ├── pageviews/                        ②  PANTALLAS
│   │   ├── home/
│   │   │   ├── Home.jsx                      Archivo padre, recibe { dict }
│   │   │   └── components/
│   │   │       └── Hero.jsx
│   │   │
│   │   └── dashboard/
│   │       ├── Dashboard.jsx                 Archivo padre, recibe { dict }
│   │       └── components/
│   │           ├── StatsCard.jsx
│   │           └── RevenueChart.jsx
│   │
│   ├── widgets/                          ③  BLOQUES GRANDES
│   │   └── Sidebar/
│   │       └── components/
│   │           └── Sidebar.jsx               Menú + info del usuario
│   │
│   ├── features/                         ④  ACCIONES DEL USUARIO
│   │   └── auth/
│   │       ├── components/
│   │       │   └── LoginForm.jsx             Formulario visual
│   │       └── api/
│   │           └── login.js                  POST al servidor
│   │
│   ├── entities/                         ⑤  ENTIDADES DE NEGOCIO
│   │   └── user/
│   │       ├── components/
│   │       │   └── UserAvatar.jsx
│   │       └── model/
│   │           └── types.ts                  Forma de un Usuario
│   │
│   └── shared/                           ⑥  CAJA DE HERRAMIENTAS
│       ├── components/
│       │   └── Button.jsx                    Botón base reusable
│       ├── api/
│       │   └── apiClient.js                  Config de Axios/Fetch
│       ├── assets/
│       │   └── icons/
│       │       └── logo.svg
│       └── i18n/                             Diccionarios ES / EN
│           ├── dictionaries/
│           │   ├── es.json
│           │   └── en.json
│           ├── getDictionary.js              Carga el JSON según el locale
│           └── config.js                     locales soportados + default
│
├── .gitignore
├── package.json
└── tailwind.config.js                        Escanea todo src/