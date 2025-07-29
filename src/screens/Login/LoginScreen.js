// import React, { useState, useContext } from "react";
// import { View, TextInput, Button, Text } from "react-native";
// import { AuthContext } from "../contexts/AuthContext";

// export default function LoginScreen() {
//   const { loginUser } = useContext(AuthContext);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     const res = await loginUser(email, password);
//     if (!res.success) alert("Error: " + res.message);
//   };

//   return (
//     <View>
//       <Text>Email</Text>
//       <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" />
//       <Text>Password</Text>
//       <TextInput value={password} onChangeText={setPassword} secureTextEntry />
//       <Button title="Login" onPress={handleLogin} />
//     </View>
//   );
// }

// src/screens/LoginScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { loginUser } from '../api/auth'; // Asegúrate de que la ruta sea correcta

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(email, password);

      if (response.success) {
        Alert.alert('¡Login exitoso!', `Bienvenido ${response.user.name}`);
        // Aquí podrías guardar el token o navegar
        navigation.navigate('Home'); // Asegúrate de tener un screen "Home"
      } else {
        Alert.alert('Error de autenticación', response.message);
      }

    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema inesperado');
      console.error('Login error:', error);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#00d4ff" />
      ) : (
        <Button title="Ingresar" onPress={handleLogin} />
      )}

      <Text
        style={styles.link}
        onPress={() => navigation.navigate('Register')}
      >
        ¿No tienes cuenta? Regístrate
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    color: '#fff',
    borderRadius: 5,
  },
  link: {
    color: '#00d4ff',
    marginTop: 20,
    textAlign: 'center',
  },
});
