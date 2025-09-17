import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { loginUser } from '../../api/auth';
import Header from '../../components/Headers/Header';
import  LinearGradient  from '../../components/LinearGradient';
import { SafeAreaView } from 'react-native';

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
    <LinearGradient>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor="#FB999A" barStyle="dark-content" />

        {/* Header Component */}
        <Header
          title="Iniciar Sesión"
        subtitle="Inicia sesión y sigue cuidando a quienes más quieres."
        showBackButton={true}
        backButtonText="← Inicio"
        onBackPress={() => navigation.goBack()}
      />

      {/* Form Section */}
      <KeyboardAvoidingView
        style={styles.formSection}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.formContainer}>
          <View style={styles.inputsContainer}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Correo</Text>
              <TextInput
                style={styles.input}
                placeholder="Introduce tu correo"
                placeholderTextColor="#62748E"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Introduce tu contraseña"
                placeholderTextColor="#62748E"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#FA8081" />
            ) : (
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Register Link */}
          <TouchableOpacity
            style={styles.registerContainer}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>
              ¿Todavía no tienes cuenta?{' '}
              <Text style={styles.registerLink}>Regístrate ahora</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  formSection: {
    flex: 1,
    backgroundColor: '#FFF8F4',
    borderTopRightRadius: 40,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 40,
    gap: 24,
    minHeight: '100%',
  },
  inputsContainer: {
    gap: 18,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    color: '#020618',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#020618',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#FA8081',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  buttonContainer: {
    gap: 10,
  },
  loginButton: {
    backgroundColor: '#FA8081',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFF8F4',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 25.6,
  },
  registerContainer: {
    alignItems: 'center',
  },
  registerText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 25.6,
    textAlign: 'center',
  },
  registerLink: {
    color: '#FA8081',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
