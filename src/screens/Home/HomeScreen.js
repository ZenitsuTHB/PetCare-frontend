import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Alert } from 'react-native';
import { logout as logoutService } from '../../api/services/auth';
import Footer from '../../components/Footers/Footer';
import ContentContainer from '../../components/ContentContainer/ContentContainer';
import Button from '../../components/Button/Button';
import PetCard from '../../components/Cards/PetCard';
import { QRModal } from '../../components';
import { usePets } from '../../contexts/PetContext';

const HomeScreen = ({ navigation }) => {
  const { pets, deletePet } = usePets();
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  const handleLogout = async () => {
    await logoutService();
    navigation.replace('Login');
  };

  const handleNewPet = () => {
    navigation.navigate('NewPetForm');
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleEditPet = (pet) => {
    navigation.navigate('NewPetForm', { pet });
  };

  const handleDeletePet = async (petId) => {
    try {
      await deletePet(petId);
    } catch (error) {
      console.error('Error deleting pet:', error);
      Alert.alert(
        'Error',
        'No se pudo eliminar la mascota. Inténtalo de nuevo.'
      );
    }
  };

  const handleShowHistory = (pet) => {
    navigation.navigate('Historial', { petName: pet.name, pet });
  };

  const handleShowQR = (pet) => {
    setSelectedPet(pet);
    setQrModalVisible(true);
  };

  // Configuración del empty state
  const emptyStateProps = {
    image: require('../../assets/images/chulo_right.png'),
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
                {pets.map((pet) => {
                  // 👇 Aquí creas el objeto con los datos que pasaremos a la pantalla de detalles
                  const petForDetails = {
                    name: pet.name,
                    species: pet.species,
                    breed: pet.breed,
                    birthdate: pet.birthdate,
                    chip: pet.chip,
                    notes: pet.notes,
                    gender: pet.gender || '—',
                    weight: pet.weight || 'No especificado',
                    avatar: pet.photoUri || '',
                  };

                  // 👇 Aquí retornas el JSX igual que antes, pero con el onPress que navega
                  return (
                    <View key={pet.id} style={styles.petCardContainer}>
                      <PetCard
                        petName={pet.name}
                        petType={pet.species}
                        breed={pet.breed}
                        weight={
                          pet.weight ? `${pet.weight} kg` : 'No especificado'
                        }
                        chipId={pet.chip}
                        registrationDate={pet.registrationDate}
                        imageSource={
                          pet.photoUri ? { uri: pet.photoUri } : null
                        }
                        onEditPet={() => handleEditPet(pet)}
                        onDeletePet={() => handleDeletePet(pet.id)}
                        onShowHistory={() => handleShowHistory(pet)}
                        onShowQR={() => handleShowQR(pet)}
                        onPress={() =>
                          navigation.navigate('PetDetails', {
                            pet: petForDetails,
                          })
                        }
                      />
                    </View>
                  );
                })}
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
          onPetsPress={() => navigation.navigate('Home')}
          onNotificationsPress={handleNotifications}
          onProfilePress={handleProfile}
        />
      </View>

      {/* QR Modal */}
      <QRModal
        visible={qrModalVisible}
        onClose={() => setQrModalVisible(false)}
        petName={selectedPet?.name}
      />
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
