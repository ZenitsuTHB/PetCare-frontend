import React from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Alert } from 'react-native';
import { logoutUser } from '../../api/auth';
import Footer from '../../components/Utils/Footer';
import ContentContainer from '../../components/ContentContainer/ContentContainer';
import Button from '../../components/Button/Button';
import PetCard from '../../components/Cards/PetCard';
import { usePets } from '../../contexts/PetContext';

const HomeScreen = ({ navigation }) => {
  const { pets, deletePet } = usePets();

  const handleLogout = async () => {
    await logoutUser();
    navigation.replace('Login');
  };

  const handleNewPet = () => {
    console.log('Nueva mascota pressed');
    navigation.navigate('NewPetForm');
  };

  const handleNotifications = () => {
    console.log('Notificaciones pressed');
    navigation.navigate('Notifications');
  };

  const handleProfile = () => {
    console.log('Perfil pressed');
    navigation.navigate('Profile');
  };

  const handleEditPet = (pet) => {
    navigation.navigate('NewPetForm', { pet });
  };

  const handleDeletePet = async (petId) => {
    try {
      await deletePet(petId);
      console.log('Pet deleted successfully');
    } catch (error) {
      console.error('Error deleting pet:', error);
      Alert.alert('Error', 'No se pudo eliminar la mascota. Inténtalo de nuevo.');
    }
  };

  const handleShowHistory = (pet) => {
    // TODO: Implementar navegación al historial médico
    Alert.alert('Historial', `Mostrando historial de ${pet.name}`);
  };

  const handleShowQR = (pet) => {
    // TODO: Implementar generación/muestra de QR
    Alert.alert('Código QR', `Generando QR para ${pet.name}`);
  };

  // Configuración del empty state
  const emptyStateProps = {
    image: require('../../assets/images/chulo.png'),
    title: 'Tu lista está vacía',
    description: 'Registra tu mascota y guarda todos sus datos médicos.',
  };

  const showEmptyState = pets.length === 0;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFF8F4" barStyle="dark-content" />

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.contentWrapper}>
          {/* Content Container with Header and Empty State or Pet List */}
          <ContentContainer
            title="Mis mascotas"
            subtitle="Aquí puedes ver y gestionar la información médica de tus mascotas."
            showEmptyState={showEmptyState}
            emptyStateProps={emptyStateProps}
          >
            {/* Lista de mascotas cuando no está vacía */}
            {!showEmptyState && (
              <ScrollView
                style={styles.petList}
                showsVerticalScrollIndicator={false}
              >
                {pets.map((pet) => (
                  <View key={pet.id} style={styles.petCardContainer}>
                    <PetCard
                      petName={pet.name}
                      petType={pet.species}
                      breed={pet.breed}
                      weight="No especificado" // Puedes agregar peso al formulario si lo necesitas
                      chipId={pet.chip}
                      registrationDate={pet.registrationDate}
                      imageSource={pet.photoUri ? { uri: pet.photoUri } : null}
                      onEditPet={() => handleEditPet(pet)}
                      onDeletePet={() => handleDeletePet(pet.id)}
                      onShowHistory={() => handleShowHistory(pet)}
                      onShowQR={() => handleShowQR(pet)}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
          </ContentContainer>

          {/* New Pet Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Nueva mascota"
              variant="primary"
              size="medium"
              iconName="add"
              iconPosition="left"
              onPress={handleNewPet}
              fullWidth
            />
          </View>
        </View>

        {/* Footer */}
        <Footer
          activeTab="pets"
          onPetsPress={() => console.log('Pets pressed')}
          onNotificationsPress={handleNotifications}
          onProfilePress={handleProfile}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F4',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    paddingVertical: 16,
  },
  petList: {
    flex: 1,
  },
  petCardContainer: {
    marginBottom: 16,
  },
});
