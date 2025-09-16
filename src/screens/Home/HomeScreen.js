import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { logoutUser } from '../../api/auth';
import Footer from '../../components/Footer';

const HomeScreen = ({ navigation }) => {
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFF8F4" barStyle="dark-content" />

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.contentWrapper}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Mis mascotas</Text>
              <Text style={styles.subtitle}>
                Selecciona una mascota para ver los detalles:
              </Text>
            </View>

            {/* Empty State */}
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyImagePlaceholder}>
                {/* Aquí puedes agregar una imagen de placeholder */}
                <Image
                  source={require('../../../assets/images/firulais1.png')}
                  style={styles.emptyImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.emptyTextContainer}>
                <Text style={styles.emptyTitle}>Tu lista está vacía</Text>
                <Text style={styles.emptyDescription}>
                  Registra tu mascota y guarda todos sus datos médicos.
                </Text>
              </View>
            </View>
          </View>

          {/* New Pet Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.newPetButton}
              onPress={handleNewPet}
            >
              <View style={styles.addIcon}>
                <Text style={styles.addIconText}>+</Text>
              </View>
              <Text style={styles.newPetButtonText}>Nueva mascota</Text>
            </TouchableOpacity>
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
  statusBar: {
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    color: '#170E2B',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.01,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  contentWrapper: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  headerSection: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 40,
  },
  headerTextContainer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 18,
  },
  title: {
    alignSelf: 'stretch',
    color: '#FA8081',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 28.8,
  },
  subtitle: {
    alignSelf: 'stretch',
    color: '#121212',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 25.6,
  },
  emptyStateContainer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 40,
  },
  emptyImagePlaceholder: {
    width: 200,
    height: 176,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: '100%',
    height: '100%',
  },
  emptyTextContainer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    alignSelf: 'stretch',
    textAlign: 'center',
    color: '#FA8081',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
  },
  emptyDescription: {
    alignSelf: 'stretch',
    textAlign: 'center',
    color: '#494949',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  buttonContainer: {
    alignSelf: 'stretch',
    height: 72,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 40,
  },
  newPetButton: {
    alignSelf: 'stretch',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FA8081',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  addIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIconText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  newPetButtonText: {
    textAlign: 'center',
    color: '#FFF8F4',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 25.6,
  },
  bottomNavigation: {
    width: '100%',
    paddingTop: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItem: {
    width: 118.67,
    height: 67,
    paddingVertical: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  navItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#FA8081',
  },
  navIconActive: {
    width: 21,
    height: 28,
    backgroundColor: '#FA8081',
  },
  navIcon: {
    width: 28,
    height: 28,
    backgroundColor: '#494949',
  },
  navIconProfile: {
    width: 28,
    height: 28,
    backgroundColor: '#484C52',
    borderRadius: 14,
  },
  navTextActive: {
    color: '#FA8081',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
  navText: {
    color: '#494949',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  systemNavigation: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 67,
  },
  systemNavButton: {
    width: 14,
    height: 14,
    backgroundColor: '#797979',
    borderRadius: 2,
  },
});
