## React Native Project Structure
This document outlines the recommended structure for a React Native project, which helps in maintaining a clean and organized codebase. The structure is designed to facilitate scalability, reusability, and ease of navigation within the project.

### Project Structure Overview
The following is a high-level overview of the recommended project structure for a React Native application:
```
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
```

### Google sign-in integration
To integrate Google sign-in in your React Native project, follow these steps:
1. **Install Dependencies**: Use the following command to install the necessary packages:
   ```bash
   npm install @react-native-google-signin/google-signin
   ```
2. **Configure Google Cloud Console**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.
   - Navigate to "Credentials" and create OAuth 2.0 credentials.
   - Add the package name and SHA-1 certificate fingerprint for Android, and the bundle identifier for iOS.
3. **Android Configuration**:
   - Open `android/app/build.gradle` and add the following to the `dependencies` section:
     ```groovy
     implementation 'com.google.android.gms:play-services-auth:19.2.0'
     ```
   - In `android/app/src/main/AndroidManifest.xml`, add the following permissions and metadata:
     ```xml
     <uses-permission android:name="android.permission.INTERNET" />
     <application>
         ...
         <meta-data
             android:name="com.google.android.gms.auth.api.signin.API_KEY"
