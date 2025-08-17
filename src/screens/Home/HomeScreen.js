import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { logoutUser } from '../../api/auth';



const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await logoutUser(); // Optional: check response
    navigation.replace('Login'); // Replaces stack so user can't go back
  };

  const handleAltaMascota = () => {
    // You can navigate later or trigger modal, etc.
    console.log('Alta mascota pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      
      <View style={styles.buttonWrapper}>
        <Button title="Alta mascota" onPress={handleAltaMascota} color="#00d4ff" />
      </View>

      <View style={styles.buttonWrapper}>
        <Button title="Cerrar sesión" onPress={handleLogout} color="#ff4f4f" />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    color: '#fff',
  },
  buttonWrapper: {
    width: '80%',
    marginBottom: 20,
  },
});
