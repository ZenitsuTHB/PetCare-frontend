import React from 'react';
import { 
  View, 
  StyleSheet, 
  StatusBar,
} from 'react-native';
import { logoutUser } from '../../api/auth';
import Footer from '../../components/Footer';
import ContentContainer from '../../components/ContentContainer/ContentContainer';
import Button from '../../components/Button/Button';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await logoutUser();
    navigation.replace('Login');
  };

  const handleNewPet = () => {
    // Navegar a la pantalla de alta de mascota
    console.log('Nueva mascota pressed');
    //navigation.navigate('NewPet');
  };

  const handleNotifications = () => {
    console.log('Notificaciones pressed');
    navigation.navigate('Notifications');
  };

  const handleProfile = () => {
    console.log('Perfil pressed');
    navigation.navigate('Profile');
  };

  // Configuración del empty state
  const emptyStateProps = {
    image: require('../../assets/images/chulo.png'),
    title: "Tu lista está vacía",
    description: "Registra tu mascota y guarda todos sus datos médicos."
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFF8F4" barStyle="dark-content" />

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.contentWrapper}>
          {/* Content Container with Header and Empty State */}
          <ContentContainer
            title="Mis mascotas"
            subtitle="Aquí puedes ver y gestionar la información médica de tus mascotas."
            showEmptyState={true}
            emptyStateProps={emptyStateProps}
          />

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
});
