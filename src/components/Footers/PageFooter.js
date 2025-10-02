import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Easing } from 'react-native';

const TabItem = ({ tabName, label, icon, isActive, onPress, isQRTab = false }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const underlineAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    if (isActive && !isQRTab) {
      // Animación de "pop" en el icono al activarse (excepto para QR)
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
      easing: Easing.in(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isActive, isQRTab]);

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View style={{ transform: [{ scale: isQRTab ? 1 : scaleAnim }] }}>
        {icon && (
          <MaterialIcons
            name={icon}
            size={28}
            color={isActive ? '#FA8081' : '#494949'}
          />
        )}
      </Animated.View>
      <Text
        style={[
          styles.tabText,
          isActive && styles.activeTabText,
        ]}
      >
        {label}
      </Text>
      
      {/* Subrayado animado */}
      <Animated.View
        style={[
          styles.underline,
          { 
            opacity: underlineAnim, 
            transform: [{ scaleX: underlineAnim }],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const PageFooter = ({
  activeTab = 'historial', // 'archivos', 'qr', 'historial' - por defecto 'historial'
  onArchivosPress,
  onQRPress,
  onHistorialPress,
  showProfileIcon = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.footerContent}>
        {/* Profile Icon (Centro elevado) - siempre rosa */}
        {showProfileIcon && (
          <View style={styles.profileIconContainer}>
            <TouchableOpacity 
              style={styles.profileIcon}
              onPress={onQRPress}
              activeOpacity={0.9}
            >
              <MaterialIcons name="qr-code" size={28} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Archivos Tab */}
        <TabItem
          tabName="archivos"
          label="Archivos"
          icon="folder-open"
          isActive={activeTab === 'archivos'}
          onPress={onArchivosPress}
        />

        {/* Generar QR Tab (centro) */}
        <TabItem
          tabName="qr"
          label="Generar QR"
          isActive={activeTab === 'qr'}
          onPress={onQRPress}
          isQRTab={true}
        />

        {/* Historial Tab */}
        <TabItem
          tabName="historial"
          label="Historial"
          icon="history"
          isActive={activeTab === 'historial'}
          onPress={onHistorialPress}
        />
      </View>
    </View>
  );
};

export default PageFooter;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingTop: 30,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 8,
  },
  footerContent: {
    alignSelf: 'stretch',
    paddingTop: 8,
    paddingLeft: 12,
    paddingRight: 12,
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileIconContainer: {
    position: 'absolute',
    top: -30,
    left: '50%',
    marginLeft: -40,
    zIndex: 10,
  },
  profileIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#FA8081', // Siempre rosa
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  tab: {
    flex: 1,
    height: 67,
    paddingVertical: 6,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    color: '#494949',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 21,
    marginTop: 2,
  },
  activeTabText: {
    color: '#FA8081',
    fontWeight: '600',
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
