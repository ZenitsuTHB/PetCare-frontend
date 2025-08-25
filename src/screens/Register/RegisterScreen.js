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
  ScrollView,
} from 'react-native';
import { registerUser } from '../../api/auth';
import { RegisterScreen2 } from '../Register/RegisterScreen2';

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegistration = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      const formData = {
        firstName,
        lastName,
        email,
        password,
      };

      const response = await registerUser(formData);

      if (response.success) {
        Alert.alert(
          '¡Registro exitoso!', 
          `Bienvenido ${response.user.name}`,
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Home');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error de registro', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema inesperado');
      console.error('Registration error:', error);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FB999A" barStyle="dark-content" />
      
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.statusBar}>
          <Text style={styles.timeText}>12:30</Text>
        </View>
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Inicio</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>Registro</Text>
          <Text style={styles.subtitle}>
            Crea tu cuenta y empieza a organizar la información médica de tu mascota de forma{' '}
            <Text style={styles.subtitleBold}>sencilla y segura</Text>.
          </Text>
        </View>
      </View>

      {/* Form Section */}
      <KeyboardAvoidingView
        style={styles.formSection}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputsContainer}>
            {/* Name Row */}
            <View style={styles.nameRow}>
              <View style={styles.nameInputGroup}>
                <Text style={styles.inputLabel}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre"
                  placeholderTextColor="#62748E"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>
              
              <View style={styles.nameInputGroup}>
                <Text style={styles.inputLabel}>Apellidos</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Apellidos"
                  placeholderTextColor="#62748E"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Correo</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu correo electrónico"
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
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor="#62748E"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirmación de contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Que coincida con las contraseñas"
                placeholderTextColor="#62748E"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Register Button */}
          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#FA8081" />
            ) : (
              <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register2')}>
                <Text style={styles.registerButtonText}>Siguiente</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FB999A',
  },
  statusBar: {
    height: 24,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  timeText: {
    color: '#170E2B',
    fontSize: 14,
    fontWeight: '500',
  },
  headerSection: {
    backgroundColor: '#FB999A',
    paddingTop: 12,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
  },
  backButton: {
    padding: 12,
    marginLeft: 4,
    borderRadius: 18,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerContent: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  title: {
    color: '#FFF2F2',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0.72,
    textShadowColor: '#FA8081',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0,
    marginBottom: 18,
  },
  subtitle: {
    color: '#FFF8F4',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 25.6,
  },
  subtitleBold: {
    fontWeight: '600',
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFF8F4',
    borderTopRightRadius: 40,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingVertical: 40,
    gap: 24,
    minHeight: '100%',
    justifyContent: 'space-between',
  },
  inputsContainer: {
    gap: 18,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameInputGroup: {
    flex: 1,
    gap: 4,
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
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 24,
  },
  registerButton: {
    backgroundColor: '#FA8081',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFF8F4',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 25.6,
  },
});