import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from './../styles/AddPetScreen.styles'; // Adjust the path as necessary

export default function AddPetScreen() {
  const [petData, setPetData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    descripcion: '',
    fecha_nacimiento: '',
    sexo: '',
    numero_chip: '',
    foto_url: '',
  });

  const handleChange = (key, value) => {
    setPetData({ ...petData, [key]: value });
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Se requiere permiso para acceder a la galería');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });

    if (!pickerResult.cancelled) {
      setPetData({ ...petData, foto_url: pickerResult.uri });
    }
  };

  const handleSubmit = () => {
    console.log('Pet data:', petData);
    alert('Mascota añadida (en consola por ahora)');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Añadir Mascota</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={petData.nombre}
          onChangeText={(text) => handleChange('nombre', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Especie"
          value={petData.especie}
          onChangeText={(text) => handleChange('especie', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Raza"
          value={petData.raza}
          onChangeText={(text) => handleChange('raza', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={petData.descripcion}
          onChangeText={(text) => handleChange('descripcion', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Fecha de nacimiento (YYYY-MM-DD)"
          value={petData.fecha_nacimiento}
          onChangeText={(text) => handleChange('fecha_nacimiento', text)}
        />

        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              petData.sexo === 'Macho' && styles.genderButtonSelected,
            ]}
            onPress={() => handleChange('sexo', 'Macho')}
          >
            <Text>Macho</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderButton,
              petData.sexo === 'Hembra' && styles.genderButtonSelected,
            ]}
            onPress={() => handleChange('sexo', 'Hembra')}
          >
            <Text>Hembra</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Número de chip"
          value={petData.numero_chip}
          onChangeText={(text) => handleChange('numero_chip', text)}
          keyboardType="numeric"
        />

        <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
          <Image
            source={
              petData.foto_url
                ? { uri: petData.foto_url }
                : require('../../assets/default-pet.png')
            }
            style={styles.imagePreview}
          />
          <Text style={{ textAlign: 'center' }}>
            {petData.foto_url ? 'Cambiar foto' : 'Seleccionar foto'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Guardar Mascota</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
