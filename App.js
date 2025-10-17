import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { PetProvider } from './src/contexts/PetContext';
import { FilesProvider } from './src/contexts/FilesContext';

export default function App() {
  return (
    <PaperProvider>
      <PetProvider>
        <FilesProvider>
          <AppNavigator />
        </FilesProvider>
      </PetProvider>
    </PaperProvider>
  );
}
