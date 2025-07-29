This is the structure exemple we are using in the app


my-app/
├── android/               # Native Android code
├── ios/                   # Native iOS code
├── assets/                # Images, fonts, icons, audio, etc.
│   ├── images/
│   ├── fonts/
│   └── icons/
├── src/                   # All JavaScript/TypeScript source files
│   ├── api/               # API calls and services (Axios, Fetch)
│   ├── components/        # Shared/reusable UI components
│   │   ├── Button/
│   │   │   ├── Button.js
│   │   │   └── styles.js
│   │   └── ...
│   ├── constants/         # App-wide constants (colors, routes, configs)
│   ├── context/           # React Contexts for global state
│   ├── hooks/             # Custom React hooks
│   ├── navigation/        # React Navigation configurations
│   ├── screens/           # Screen components (views/pages)
│   │   ├── Home/
│   │   │   ├── HomeScreen.js
│   │   │   └── styles.js
│   │   └── ...
│   ├── store/             # Redux or Zustand or any global state (optional)
│   ├── utils/             # Utility functions/helpers
│   ├── types/             # Global TypeScript type declarations
│   └── App.js            # Entry point (if not using the root App.js)
├── .env                   # Environment variables
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
├── babel.config.js        # Babel configuration
├── package.json
└── tsconfig.json          # TypeScript config (if using TS)

