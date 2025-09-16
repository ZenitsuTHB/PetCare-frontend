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
  ScrollView,
} from 'react-native';
import { validateRegistrationForm } from '../../utils/validation';
import { FORM_FIELDS, FORM_LABELS } from '../../constants/formConstants';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RegistrationForm = ({ onSubmit }) => {
  const navigation = useNavigation(); // Assuming you are using React Navigation
  const [formData, setFormData] = useState({
    [FORM_FIELDS.NOMBRE]: '',
    [FORM_FIELDS.APELLIDOS]: '',
    [FORM_FIELDS.CORREO]: '',
    [FORM_FIELDS.CONTRASEÑA]: '',
    [FORM_FIELDS.DOMICILIO]: '',
    [FORM_FIELDS.CIUDAD]: '',
    [FORM_FIELDS.PROVINCIA]: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSubmit = async () => {
    const sanitizedData = {
      ...formData,
      [FORM_FIELDS.NOMBRE]: formData[FORM_FIELDS.NOMBRE].trim(),
      [FORM_FIELDS.APELLIDOS]: formData[FORM_FIELDS.APELLIDOS].trim(),
      [FORM_FIELDS.CORREO]: formData[FORM_FIELDS.CORREO].trim().toLowerCase(),
      [FORM_FIELDS.DOMICILIO]: formData[FORM_FIELDS.DOMICILIO].trim(),
      [FORM_FIELDS.CIUDAD]: formData[FORM_FIELDS.CIUDAD].trim(),
      [FORM_FIELDS.PROVINCIA]: formData[FORM_FIELDS.PROVINCIA].trim(),
    };

    const validation = validateRegistrationForm(sanitizedData);

    if (validation.isValid) {
      setLoading(true);
      try {
        await onSubmit(sanitizedData);
        setErrors({});
      } catch (error) {
        Alert.alert('Error', 'Error al registrar usuario');
      }
      setLoading(false);
    } else {
      setErrors(validation.errors);
      Alert.alert('Error', 'Por favor, corrija los errores en el formulario');
    }
  };

  const renderInput = (fieldName, additionalProps = {}) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, errors[fieldName] && styles.inputError]}
        placeholder={FORM_LABELS[fieldName]}
        placeholderTextColor="#888"
        value={formData[fieldName]}
        onChangeText={(value) => handleChange(fieldName, value)}
        {...additionalProps}
      />
      {errors[fieldName] && (
        <Text style={styles.errorText}>{errors[fieldName]}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Ionicons name="arrow-back" size={24} color="#00d4ff" />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Registro de Usuario</Text>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderInput(FORM_FIELDS.NOMBRE)}
        {renderInput(FORM_FIELDS.APELLIDOS)}
        {renderInput(FORM_FIELDS.CORREO, {
          keyboardType: 'email-address',
          autoCapitalize: 'none',
        })}
        {renderInput(FORM_FIELDS.CONTRASEÑA, { secureTextEntry: true })}
        {renderInput(FORM_FIELDS.DOMICILIO)}
        {renderInput(FORM_FIELDS.CIUDAD)}
        {renderInput(FORM_FIELDS.PROVINCIA)}

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#00d4ff"
            style={styles.loader}
          />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 30,
    paddingTop: 50,
    justifyContent: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 10,
  },
  backText: {
    color: '#00d4ff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderColor: '#2a2a2a',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    color: '#fff',
  },
  inputError: {
    borderColor: '#ff0000',
    borderWidth: 2,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
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
});

export default RegistrationForm;
