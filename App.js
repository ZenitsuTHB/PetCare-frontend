import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { PetProvider } from './src/contexts/PetContext';

export default function App() {
  return (
    <PetProvider>
      <AppNavigator />
    </PetProvider>
  );
}
