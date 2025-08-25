import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';

const LandingScreen = ({ navigation }) => {
  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FB999A" barStyle="dark-content" />
      
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.timeText}>12:30</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Logo and Description Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              {/* Aquí puedes agregar tu logo */}
              <Image 
                source={require('../../../assets/images/Bonvet_logo.png')} // Ajusta la ruta según tu logo
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              Accede a tu espacio seguro y lleva el control de la salud de tu mascota en un solo lugar.
            </Text>
          </View>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsSection}>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>REGISTRO</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>INICIO SESIÓN</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation Indicator */}
      <View style={styles.bottomIndicator}>
      </View>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FB999A',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statusBar: {
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  timeText: {
    color: '#170E2B',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.01,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 72,
    paddingVertical: 20,
  },
  logoSection: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 24,
  },
  logoContainer: {
    padding: 10,
  },
  logoPlaceholder: {
    width: 160,
    height: 135,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  descriptionContainer: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionText: {
    textAlign: 'center',
    color: '#FFF8F4',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 25.6,
    paddingHorizontal: 10,
  },
  buttonsSection: {
    alignSelf: 'stretch',
    gap: 24,
  },
  registerButton: {
    alignSelf: 'stretch',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFF8F4',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FFF8F4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  registerButtonText: {
    textAlign: 'center',
    color: '#FB999A',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 25.6,
  },
  loginButton: {
    alignSelf: 'stretch',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FB999A',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFF8F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    textAlign: 'center',
    color: '#FFF8F4',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 25.6,
  },
  bottomIndicator: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 67,
  },
});