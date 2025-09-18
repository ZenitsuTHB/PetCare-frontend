import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Button from '../../components/Button/Button';
import { usePets } from '../../contexts/PetContext';

const PetSystemDemo = ({ navigation }) => {
  const { pets, addPet } = usePets();

  const addDemoPet = async () => {
    const demoPet = {
      name: 'Firulais Demo',
      species: 'Perro',
      breed: 'Labrador',
      birthdate: '15/03/2020',
      chip: '900123456789012',
      notes: 'Esta es una mascota de demostración',
      photoUri: '', // Sin foto por ahora
    };

    await addPet(demoPet);
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFF8F4" barStyle="dark-content" />
      
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Demo del Sistema de Mascotas</Text>
        
        <Text style={styles.description}>
          Este demo muestra cómo funciona el sistema completo:
        </Text>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>1.</Text>
          <Text style={styles.stepText}>
            <Text style={styles.bold}>Agregar Mascota:</Text> Usa el botón "Nueva mascota" 
            para ir al formulario de registro.
          </Text>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>2.</Text>
          <Text style={styles.stepText}>
            <Text style={styles.bold}>Llenar Formulario:</Text> Completa todos los campos 
            obligatorios (nombre, especie, raza, fecha de nacimiento, chip).
          </Text>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>3.</Text>
          <Text style={styles.stepText}>
            <Text style={styles.bold}>Guardar:</Text> Al hacer clic en "Crear mascota", 
            la app te llevará de vuelta al Home con la nueva mascota visible.
          </Text>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>4.</Text>
          <Text style={styles.stepText}>
            <Text style={styles.bold}>Gestionar:</Text> Usa el menú de tres puntos en cada 
            tarjeta para editar o eliminar mascotas.
          </Text>
        </View>

        <Text style={styles.info}>
          Mascotas actuales: {pets.length}
        </Text>

        <Button
          title="Agregar mascota de demo"
          variant="secondary"
          onPress={addDemoPet}
          style={styles.demoButton}
        />

        <Button
          title="Ir al formulario"
          variant="primary"
          onPress={() => navigation.navigate('NewPetForm')}
          style={styles.formButton}
        />

        <Button
          title="Ver mis mascotas"
          variant="outline"
          onPress={() => navigation.navigate('Home')}
          style={styles.homeButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PetSystemDemo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F4',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#594133',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#2C2C2C',
    marginBottom: 20,
    lineHeight: 24,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FA8081',
    marginRight: 12,
    marginTop: 2,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#2C2C2C',
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
    color: '#594133',
  },
  info: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FA8081',
    textAlign: 'center',
    marginVertical: 20,
    padding: 12,
    backgroundColor: '#FFBA92',
    borderRadius: 8,
  },
  demoButton: {
    marginBottom: 12,
  },
  formButton: {
    marginBottom: 12,
  },
  homeButton: {
    marginBottom: 20,
  },
});