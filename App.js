import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AutContext';
import { PetProvider } from './src/contexts/PetContext';

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <PetProvider>
          <AppNavigator />
        </PetProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
