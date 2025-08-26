import React, { useState, useEffect } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import Header from '../../components/Header';
import ProvincePicker from '../../components/ProvincePicker';

const RegisterScreen2 = ({ navigation, route }) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [province, setProvince] = useState('Barcelona');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Datos del formulario anterior
  const userBasicData = route?.params?.userBasicData || {};

  // Validar formulario
  useEffect(() => {
    const isValid = address.trim() !== '' && 
                   city.trim() !== '' && 
                   postalCode.trim() !== '' && 
                   province !== '' && 
                   termsAccepted;
    setIsFormValid(isValid);
  }, [address, city, postalCode, province, termsAccepted]);

  const handleRegistration = async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Por favor completa todos los campos y acepta los términos y condiciones');
      return;
    }

    setLoading(true);

    try {
      const completeUserData = {
        ...userBasicData,
        address,
        city,
        postalCode,
        province,
        termsAccepted
      };

      // Aquí llamarías a tu API de registro
      // const response = await registerUser(completeUserData);

      // Simulación de registro exitoso
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          '¡Registro exitoso!', 
          'Tu cuenta ha sido creada correctamente',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Login');
              }
            }
          ]
        );
      }, 2000);

    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Ocurrió un problema inesperado');
      console.error('Registration error:', error);
    }
  };

  const toggleTermsAccepted = () => {
    setTermsAccepted(!termsAccepted);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FB999A" barStyle="dark-content" />
      
      {/* Header Section */}
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
      />

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
            {/* Address Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Domicilio</Text>
              <TextInput
                style={styles.input}
                placeholder="Dirección completa"
                placeholderTextColor="#62748E"
                value={address}
                onChangeText={setAddress}
                autoCapitalize="words"
              />
            </View>

            {/* City and Postal Code Row */}
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
              </View>
            </View>
            
            {/* Province Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Provincia</Text>
              <ProvincePicker
                selectedProvince={province}
                onChange={(value) => setProvince(value)}
              />
            </View>
            
            {/* Terms and Conditions Checkbox */}
            <TouchableOpacity style={styles.checkboxContainer} onPress={toggleTermsAccepted}>
              <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>
                Acepto los <Text style={styles.checkboxTextBold}>términos y las condiciones</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Register Button */}
          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#FA8081" />
            ) : (
              <TouchableOpacity 
                style={[styles.registerButton, !isFormValid && styles.registerButtonDisabled]} 
                onPress={handleRegistration}
                disabled={!isFormValid}
              >
                <Text style={[styles.registerButtonText, !isFormValid && styles.registerButtonTextDisabled]}>
                  Registrarse
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FB999A',
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
  },
  registerButtonDisabled: {
    backgroundColor: '#FA8081',
    opacity: 0.5,
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
});