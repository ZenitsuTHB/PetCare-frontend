import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

export default function App() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    contraseña: '',
    domicilio: '',
    ciudad: '',
    provincia: '',
  });

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    // You can handle the submission, e.g., send data to an API or show it
    console.log('Form Submitted:', formData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register Pet Owner</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={formData.nombre}
        onChangeText={(value) => handleChange('nombre', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellidos"
        value={formData.apellidos}
        onChangeText={(value) => handleChange('apellidos', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        keyboardType="email-address"
        value={formData.correo}
        onChangeText={(value) => handleChange('correo', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={formData.contraseña}
        onChangeText={(value) => handleChange('contraseña', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Domicilio"
        value={formData.domicilio}
        onChangeText={(value) => handleChange('domicilio', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Ciudad"
        value={formData.ciudad}
        onChangeText={(value) => handleChange('ciudad', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Provincia"
        value={formData.provincia}
        onChangeText={(value) => handleChange('provincia', value)}
      />

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
});
