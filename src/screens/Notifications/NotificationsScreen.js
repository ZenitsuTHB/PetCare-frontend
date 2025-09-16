import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Footer from '../../components/Footer';

const NotificationsScreen = ({ navigation }) => {
  const handlePets = () => {
    navigation.navigate('Home');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFF8F4" barStyle="dark-content" />

      <View style={styles.mainContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Notificaciones</Text>
          <Text style={styles.subtitle}>
            Aquí aparecerán tus notificaciones
          </Text>
        </View>

        <Footer
          activeTab="notifications"
          onPetsPress={handlePets}
          onNotificationsPress={() => console.log('Already on notifications')}
          onProfilePress={handleProfile}
        />
      </View>
    </View>
  );
};

export default NotificationsScreen;

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
