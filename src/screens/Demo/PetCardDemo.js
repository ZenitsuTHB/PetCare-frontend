import React from 'react';
import { View, StyleSheet, ScrollView, Alert, StatusBar } from 'react-native';
import PetCard from '../../components/Cards/PetCard';

const PetCardDemo = () => {
  const pets = [
    {
      id: 1,
      name: 'Aperitivo :)',
      type: 'Hamster',
      breed: 'Ruso',
      weight: '1 kg',
      chipId: '981100002343567',
      date: '15/09/2024',
      birthdate: '10/01/2024',
    },
    {
      id: 2,
      name: 'Max',
      type: 'Perro',
      breed: 'Golden Retriever',
      weight: '25 kg',
      chipId: '981100002343568',
      date: '10/08/2024',
      birthdate: '15/03/2022',
    },
    {
      id: 3,
      name: 'Luna',
      type: 'Gato',
      breed: 'Siamés',
      weight: '4 kg',
      chipId: '981100002343569',
      date: '22/07/2024',
      birthdate: '20/05/2021',
    },
  ];

  const handleEditPet = (petName) => {
    Alert.alert('Editar', `Editando: ${petName}`);
  };

  const handleDeletePet = (petName) => {
    Alert.alert('Eliminado', `${petName} ha sido eliminado correctamente`);
  };

  const handleShowHistory = (petName) => {
    Alert.alert('Historial', `Historial de: ${petName}`);
  };

  const handleShowQR = (petName) => {
    Alert.alert('QR', `QR de: ${petName}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFF8F4" barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {pets.map((pet) => (
          <PetCard
            key={pet.id}
            petName={pet.name}
            petType={pet.type}
            breed={pet.breed}
            weight={pet.weight}
            chipId={pet.chipId}
            birthdate={pet.birthdate || pet.date}
            onEditPet={() => handleEditPet(pet.name)}
            onDeletePet={() => handleDeletePet(pet.name)}
            onShowHistory={() => handleShowHistory(pet.name)}
            onShowQR={() => handleShowQR(pet.name)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default PetCardDemo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F4',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
});
