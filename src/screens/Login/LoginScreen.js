import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { loginUser } from '../../api/auth';

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
        navigation.navigate('Home');
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

      <Text style={styles.title}>Bienvenido</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#00d4ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.googleButton} onPress={() => Alert.alert('Google login no implementado aún')}>
        <Text style={styles.googleButtonText}>Ingresar con Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    color: '#fff',
  },
  button: {
    backgroundColor: '#00d4ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#ffffff10',
    borderColor: '#00d4ff',
    borderWidth: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  googleButtonText: {
    color: '#00d4ff',
    fontSize: 16,
  },
  registerLink: {
    color: '#00d4ff',
    textAlign: 'center',
    marginTop: 25,
  },
});
