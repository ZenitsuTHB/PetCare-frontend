import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import RegistrationForm from '../../components/Forms/RegistrationForm';

const RegisterScreen = () => {
  const handleRegistration = (formData) => {
    // Handle the form submission - you can send to API, validate, etc.
    console.log('Registration data:', formData);
    
    // Here you would typically make an API call to register the user
    // For now, we'll just show a success message
    Alert.alert(
      'Success', 
      'Registration completed successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Home');
            console.log('Registration successful');
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <RegistrationForm onSubmit={handleRegistration} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});

export default RegisterScreen;
