import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Footer from '../../components/Footer';

const ProfileScreen = ({ navigation }) => {
  const handlePets = () => {
    navigation.navigate('Home');
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFF8F4" barStyle="dark-content" />

      <View style={styles.statusBar}>
        <Text style={styles.timeText}>12:30</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Perfil</Text>
          <Text style={styles.subtitle}>Información de tu perfil</Text>
        </View>

        <Footer
          activeTab="profile"
          onPetsPress={handlePets}
          onNotificationsPress={handleNotifications}
          onProfilePress={() => console.log('Already on profile')}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

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
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  title: {
    color: '#FA8081',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 28.8,
  },
  subtitle: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 25.6,
    textAlign: 'center',
  },
});
