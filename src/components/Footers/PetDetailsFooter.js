import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Easing } from 'react-native';

const COLORS = { card: '#FFF', text: '#121212', primary: '#FA8081' };

const TabItem = ({ icon, label, isActive, onPress, isQRTab = false }) => {
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
      style={styles.item}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Animated.View style={{ transform: [{ scale: isQRTab ? 1 : scaleAnim }] }}>
        {icon && (
          <Ionicons
            name={icon}
            size={22}
            color={isActive ? COLORS.primary : COLORS.text}
          />
        )}
      </Animated.View>
      <Text style={[styles.label, isActive && styles.labelActive]}>
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

const PetDetailsFooter = ({
  activeTab = 'historial', // 'archivos' | 'qr' | 'historial' - por defecto 'historial'
  onArchivosPress,
  onQRPress,
  onHistorialPress,
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Archivos */}
      <TabItem
        icon="folder-open-outline"
        label="Archivos"
        isActive={activeTab === 'archivos'}
        onPress={onArchivosPress}
      />

      {/* Etiqueta centrada (Generar QR) */}
      <TabItem
        label="Generar QR"
        isActive={activeTab === 'qr'}
        onPress={onQRPress}
        isQRTab={true}
      />

      {/* Historial */}
      <TabItem
        icon="time-outline"
        label="Historial"
        isActive={activeTab === 'historial'}
        onPress={onHistorialPress}
      />

      {/* FAB centrado */}
      <TouchableOpacity
        style={styles.fab}
        onPress={onQRPress}
        activeOpacity={0.9}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="qr-code-outline" size={26} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

export default PetDetailsFooter;

const styles = StyleSheet.create({
  // barra blanca - mismo estilo que Footer
  wrapper: {
    width: '100%',
    paddingTop: 8, // Mismo que Footer
    paddingHorizontal: 12, // Mismo que Footer
    backgroundColor: COLORS.card,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-around', // Mismo que Footer
    alignItems: 'center', // Mismo que Footer
    // sombra - igual que Footer
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative', // Para el FAB absoluto
  },

  item: {
    flex: 1, // Mismo que Footer navItem
    height: 67, // Mismo que Footer navItem
    paddingVertical: 6, // Mismo que Footer navItem
    flexDirection: 'column', // Mismo que Footer navItem
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Para el subrayado animado
  },
  label: { fontSize: 12, color: COLORS.text, marginTop: 2 }, // Mismo marginTop que Footer
  labelActive: { color: COLORS.primary, fontWeight: '600' },

  // Subrayado animado
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '60%',
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    alignSelf: 'center',
  },

  // botón flotante
  fab: {
    position: 'absolute',
    top: -30, // Ajustado para nueva estructura
    left: '50%',
    transform: [{ translateX: -32 }], // -(ancho/2)
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
});
