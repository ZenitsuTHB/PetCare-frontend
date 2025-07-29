import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { validateRegistrationForm } from '../../utils/validation';
import { FORM_FIELDS, FORM_LABELS } from '../../constants/formConstants';

const RegistrationForm = ({ onSubmit }) => {
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

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSubmit = () => {
    const validation = validateRegistrationForm(formData);
    
    if (validation.isValid) {
      onSubmit(formData);
      setErrors({});
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
    <View style={styles.container}>
      <Text style={styles.title}>Register Pet Owner</Text>

      {renderInput(FORM_FIELDS.NOMBRE)}
      {renderInput(FORM_FIELDS.APELLIDOS)}
      {renderInput(FORM_FIELDS.CORREO, { keyboardType: 'email-address' })}
      {renderInput(FORM_FIELDS.CONTRASEÑA, { secureTextEntry: true })}
      {renderInput(FORM_FIELDS.DOMICILIO)}
      {renderInput(FORM_FIELDS.CIUDAD)}
      {renderInput(FORM_FIELDS.PROVINCIA)}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
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
});

export default RegistrationForm;
