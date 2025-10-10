import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Header from '../../../components/Headers/Header';
import LinearGradient from '../../../components/Utils/LinearGradient';
import { validateRegistrationBasicForm } from '../../../utils/validation';

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState({});

  const formData = { firstName, lastName, email, password, confirmPassword };
  const validationResult = useMemo(
    () => validateRegistrationBasicForm(formData),
    [formData]
  );
  const { errors, isValid } = validationResult;

  const allFieldsFilled =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    password.trim() &&
    confirmPassword.trim();
  const canProceed = allFieldsFilled && isValid;

  const onBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleNextStep = () => {
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!isValid) {
      const errorMessages = Object.values(errors).join('\n');
      Alert.alert('Error', errorMessages);
      return;
    }

    const sanitizedData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
      confirmPassword,
    };

    navigation.navigate('Register2', {
      userBasicData: sanitizedData,
    });
  };

  return (
    <LinearGradient>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor="#FB999A" barStyle="dark-content" />

        <Header
          title="Registro"
          subtitle={
            <>
              Crea tu cuenta y empieza a organizar la informacion medica de tu
              mascota de forma{' '}
              <Text style={styles.subtitleBold}>sencilla y segura</Text>.
            </>
          }
          showBackButton={true}
          backButtonText="? Inicio"
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <KeyboardAvoidingView
            style={styles.formSection}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.formContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.inputsContainer}>
                <View style={styles.nameInputGroup}>
                  <Text style={styles.inputLabel}>Nombre</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.firstName &&
                        errors.firstName &&
                        styles.inputError,
                    ]}
                    placeholder="Nombre"
                    placeholderTextColor="#62748E"
                    value={firstName}
                    onChangeText={setFirstName}
                    onBlur={onBlur('firstName')}
                    autoCapitalize="words"
                  />
                  {touched.firstName && errors.firstName && (
                    <Text style={styles.errorText}>{errors.firstName}</Text>
                  )}
                </View>

                <View style={styles.nameInputGroup}>
                  <Text style={styles.inputLabel}>Apellidos</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.lastName && errors.lastName && styles.inputError,
                    ]}
                    placeholder="Apellidos"
                    placeholderTextColor="#62748E"
                    value={lastName}
                    onChangeText={setLastName}
                    onBlur={onBlur('lastName')}
                    autoCapitalize="words"
                  />
                  {touched.lastName && errors.lastName && (
                    <Text style={styles.errorText}>{errors.lastName}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Correo</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.email && errors.email && styles.inputError,
                    ]}
                    placeholder="Tu correo electronico"
                    placeholderTextColor="#62748E"
                    value={email}
                    onChangeText={setEmail}
                    onBlur={onBlur('email')}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Contrasena</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.password && errors.password && styles.inputError,
                    ]}
                    placeholder="Minimo 8 caracteres"
                    placeholderTextColor="#62748E"
                    value={password}
                    onChangeText={setPassword}
                    onBlur={onBlur('password')}
                    secureTextEntry
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Confirmacion de contrasena
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.confirmPassword &&
                        errors.confirmPassword &&
                        styles.inputError,
                    ]}
                    placeholder="Debe coincidir con la contrasena"
                    placeholderTextColor="#62748E"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onBlur={onBlur('confirmPassword')}
                    secureTextEntry
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    !canProceed && styles.registerButtonDisabled,
                  ]}
                  onPress={handleNextStep}
                  disabled={!canProceed}
                >
                  <Text
                    style={[
                      styles.registerButtonText,
                      !canProceed && styles.registerButtonTextDisabled,
                    ]}
                  >
                    Siguiente
                  </Text>
                </TouchableOpacity>
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
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
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
  registerButtonDisabled: {
    backgroundColor: '#E2E8F0',
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#FFF8F4',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 25.6,
  },
  registerButtonTextDisabled: {
    color: '#94A3B8',
  },
});
