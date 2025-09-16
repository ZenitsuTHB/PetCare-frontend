import React from 'react';
import { View, StyleSheet, ScrollView, Alert, StatusBar } from 'react-native';
import PetCard from '../../components/Cards/PetCard';

const ModalDemo = () => {
  
  const pets = [
    {
      id: 1,
      name: "Aperitivo :)",
      type: "Hamster",
      breed: "Ruso",
      weight: "1 kg",
      chipId: "981100002343567",
      date: "15/09/2024"
    },
    {
      id: 2,
      name: "Max",
      type: "Perro", 
      breed: "Golden Retriever",
      weight: "25 kg",
      chipId: "981100002343568",
      date: "10/08/2024"
    }
  ];

  const handleEditPet = (petName) => {
    Alert.alert('Editar', `Editando: ${petName}`);
  };

  const handleDeletePet = (petName) => {
    // Aquí simularías la eliminación real
    Alert.alert(
      'Eliminado', 
      `${petName} ha sido eliminado correctamente`,
      [{ text: 'OK' }]
    );
  };

  const handleShowHistory = (petName) => {
    Alert.alert('Historial', `Historial médico de: ${petName}`);
  };

  const handleShowQR = (petName) => {
    Alert.alert('Código QR', `Mostrando QR de: ${petName}`);
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
            registrationDate={pet.date}
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

export default ModalDemo;

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