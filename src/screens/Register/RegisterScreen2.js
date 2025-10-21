import React, { useState, useMemo, useContext } from 'react';
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
import Header from '../../components/Headers/Header';
import ProvincePicker from '../../components/Utils/ProvincePicker';
import LinearGradient from '../../components/Utils/LinearGradient';
import { validateRegistrationCompleteForm } from '../../utils/validation';
import { AuthContext } from '../../contexts/AutContext';
import { register as registerService } from '../../api/services/auth';

const RegisterScreen2 = ({ navigation, route }) => {
  const authContext = useContext(AuthContext);
  const registerFn = authContext?.registerUser ?? registerService;
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [province, setProvince] = useState('Barcelona');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const userBasicData = route?.params?.userBasicData || {};

  const formData = { address, city, postalCode, province, termsAccepted };
  const validationResult = useMemo(
    () => validateRegistrationCompleteForm(formData),
    [formData]
  );
  const { errors, isValid } = validationResult;

  const handleRegistration = async () => {
    if (!isValid) {
      const errorMessages = Object.values(errors).join('\n');
      Alert.alert('Error', errorMessages);
      return;
    }

    setLoading(true);

    try {
      const completeUserData = {
        ...userBasicData,
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        province,
        termsAccepted,
      };

      const response = await registerFn(completeUserData);

      if (response.success) {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        return;
      } else {
        const errorsFromResponse =
          response?.errors &&
          Object.values(response.errors).flat().filter(Boolean);

        const fallbackMessage =
          response?.message ||
          (errorsFromResponse && errorsFromResponse.length
            ? errorsFromResponse.join('\n')
            : 'No se pudo completar el registro');

        Alert.alert('Error de registro', fallbackMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Ocurrió un problema inesperado');
    } finally {
      setLoading(false);
    }
  };

  const toggleTermsAccepted = () => {
    setTermsAccepted((prev) => !prev);
  };

  return (
    <LinearGradient>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor="#FB999A" barStyle="dark-content" />

        <Header
          title="Registro"
          subtitle={
            <>
              Crea tu cuenta y empieza a organizar la información médica de tu
              mascota de forma{' '}
              <Text style={styles.subtitleBold}>sencilla y segura</Text>.
            </>
          }
          showBackButton={true}
          backButtonText="← Inicio"
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
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Domicilio</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Dirección completa"
                    placeholderTextColor="#62748E"
                    value={address}
                    onChangeText={setAddress}
                  />
                  {errors.address && (
                    <Text style={styles.errorText}>{errors.address}</Text>
                  )}
                </View>

                <View style={styles.cityRow}>
                  <View style={styles.cityInputGroup}>
                    <Text style={styles.inputLabel}>Ciudad</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ciudad"
                      placeholderTextColor="#62748E"
                      value={city}
                      onChangeText={setCity}
                      autoCapitalize="words"
                    />
                    {errors.city && (
                      <Text style={styles.errorText}>{errors.city}</Text>
                    )}
                  </View>

                  <View style={styles.postalInputGroup}>
                    <Text style={styles.inputLabel}>C.P</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Código postal"
                      placeholderTextColor="#62748E"
                      value={postalCode}
                      onChangeText={setPostalCode}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                    {errors.postalCode && (
                      <Text style={styles.errorText}>{errors.postalCode}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Provincia</Text>
                  <ProvincePicker
                    selectedProvince={province}
                    onChange={(value) => setProvince(value)}
                  />
                  {errors.province && (
                    <Text style={styles.errorText}>{errors.province}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={toggleTermsAccepted}
                >
                  <View
                    style={[
                      styles.checkbox,
                      termsAccepted && styles.checkboxChecked,
                    ]}
                  >
                    {termsAccepted && <Text style={styles.checkmark}>X</Text>}
                  </View>
                  <Text style={styles.checkboxText}>
                    Acepto los{' '}
                    <Text style={styles.checkboxTextBold}>
                      términos y condiciones
                    </Text>
                  </Text>
                </TouchableOpacity>
                {errors.termsAccepted && (
                  <Text style={styles.errorText}>{errors.termsAccepted}</Text>
                )}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    (!isValid || loading) && styles.registerButtonDisabled,
                  ]}
                  onPress={handleRegistration}
                  disabled={!isValid || loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFF8F4" />
                  ) : (
                    <Text
                      style={[
                        styles.registerButtonText,
                        !isValid && styles.registerButtonTextDisabled,
                      ]}
                    >
                      Registrarse
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default RegisterScreen2;

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
  cityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cityInputGroup: {
    flex: 1,
    gap: 4,
  },
  postalInputGroup: {
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
  pickerContainer: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
  },
  picker: {
    height: 40,
    color: '#020618',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFBA92',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FFBA92',
    borderColor: '#FFBA92',
  },
  checkmark: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  checkboxText: {
    color: '#020618',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    flex: 1,
  },
  checkboxTextBold: {
    fontWeight: '600',
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
    minHeight: 48,
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
    color: '#FFF8F4',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
});
