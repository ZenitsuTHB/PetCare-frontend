my-app/
├── android/                 # Native Android code (auto-generated)
├── ios/                     # Native iOS code (auto-generated)
├── assets/                  # Images, fonts, icons, etc.
│   ├── images/
│   ├── fonts/
│   └── icons/
├── src/                     # Your app source code
│   ├── api/                 # API calls using fetch or Axios
│   ├── components/          # Reusable UI components
│   │   ├── Button/
│   │   │   ├── Button.js
│   │   │   └── styles.js
│   │   └── ...
│   ├── constants/           # Colors, spacing, app config, etc.
│   ├── context/             # Global state using React Context
│   ├── hooks/               # Custom reusable hooks
│   ├── navigation/          # React Navigation setup
│   │   ├── AppNavigator.js
│   │   └── NavigationContainer.js
│   ├── screens/             # App screens
│   │   ├── Home/
│   │   │   ├── HomeScreen.js
│   │   │   └── styles.js
│   │   └── ...
│   ├── store/               # Global state (Redux, Context, etc.)
│   ├── utils/               # Utility functions
│   └── App.js               # Root component
├── .env                     # Environment variables
├── .eslintrc.js             # ESLint configuration
├── .prettierrc              # Prettier configuration
├── babel.config.js
├── package.json
└── README.md