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
  SafeAreaView,
} from 'react-native';
import { registerUser } from '../../api/auth';
import Header from '../../components/Headers/Header';
import  LinearGradient  from '../../components/LinearGradient';

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
    <LinearGradient>
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#FB999A" barStyle="dark-content" />

      {/* Header Component */}
      <Header
        title="Registro"
        subtitle={
          <>
            Crea tu cuenta y empieza a organizar la información médica de tu mascota de forma{' '}
            <Text style={styles.subtitleBold}>sencilla y segura</Text>.
          </>
        }
        showBackButton={true}
        backButtonText="← Inicio"
        onBackPress={() => navigation.goBack()}
        // backgroundColor="transparent"
      />
      <View style={styles.container}>
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
              {/* first name */}
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

              {/* Last Name */}
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
    </SafeAreaView>
    </LinearGradient>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopRightRadius: 40,
    marginTop: 0,
    overflow: 'hidden',
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