import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Easing } from 'react-native';

const NavItem = ({ tabName, label, icon, isActive, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const underlineAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    if (isActive) {
      // Animación de "pop" en el icono al activarse
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Animación suave para el subrayado
    Animated.timing(underlineAnim, {
      toValue: isActive ? 1 : 0,
      duration: 250,
      Easing: Easing.in(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {icon === 'notifications-outline' || icon === 'person-outline' ? (
          <Ionicons
            name={icon}
            size={28}
            color={isActive ? '#FA8081' : '#494949'}
          />
        ) : (
          <MaterialIcons
            name={icon}
            size={28}
            color={isActive ? '#FA8081' : '#494949'}
          />
        )}
      </Animated.View>
      <Text style={isActive ? styles.navTextActive : styles.navText}>
        {label}
      </Text>

      {/* Subrayado animado */}
      <Animated.View
        style={[
          styles.underline,
          { opacity: underlineAnim, transform: [{ scaleX: underlineAnim }] },
        ]}
      />
    </TouchableOpacity>
  );
};

const Footer = ({
  activeTab = 'pets',
  onPetsPress,
  onNotificationsPress,
  onProfilePress,
}) => {
  return (
    <View style={styles.bottomNavigation}>
      <NavItem
        tabName="pets"
        label="Mascotas"
        icon="pets"
        isActive={activeTab === 'pets'}
        onPress={onPetsPress}
      />
      <NavItem
        tabName="notifications"
        label="Notificaciones"
        icon="notifications-outline"
        isActive={activeTab === 'notifications'}
        onPress={onNotificationsPress}
      />
      <NavItem
        tabName="profile"
        label="Perfil"
        icon="person-outline"
        isActive={activeTab === 'profile'}
        onPress={onProfilePress}
      />
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  bottomNavigation: {
    width: '100%',
    paddingTop: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 5,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  navItem: {
    flex: 1,
    height: 67,
    paddingVertical: 6,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  navTextActive: {
    color: '#FA8081',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  navText: {
    color: '#494949',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '60%',
    borderRadius: 2,
    backgroundColor: '#FA8081',
    alignSelf: 'center',
  },
});
