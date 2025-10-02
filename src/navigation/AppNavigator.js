import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewPetFormScreen from '../components/Forms/NewPetForm';
import LandingScreen from '../screens/Landing/LandingScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import RegisterScreen2 from '../screens/Register/RegisterScreen2';
import HomeScreen from '../screens/Home/HomeScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import HistorialScreen from '../screens/Historial/HistorialScreen';
import PetDetailsScreen from '../screens/Details/PetDetailsScreen';
import ArchivosScreen from '../screens/Archivos/ArchivosScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Register2" component={RegisterScreen2} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Historial" component={HistorialScreen} />
        <Stack.Screen name="Archivos" component={ArchivosScreen} />
        <Stack.Screen
          name="NewPetForm"
          component={NewPetFormScreen}
          options={{ title: 'Nueva Mascota' }}
        />
        <Stack.Screen name="PetDetails" component={PetDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
