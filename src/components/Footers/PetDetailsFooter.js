import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = { card: '#FFF', text: '#121212', primary: '#FA8081' };

const PetDetailsFooter = ({
  activeTab = 'archivos', // 'archivos' | 'qr' | 'historial'
  onArchivosPress,
  onQRPress,
  onHistorialPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(10, insets.bottom - 6) },
      ]}
    >
      {/* Archivos */}
      {/* Archivos */}
      <TouchableOpacity
        style={styles.item}
        onPress={onArchivosPress}
        activeOpacity={0.85}
      >
        <Ionicons name="folder-open-outline" size={22} color={COLORS.text} />
        <Text style={[styles.label]}>Archivos</Text>
      </TouchableOpacity>

      {/* Etiqueta centrada */}
      <View style={styles.centerItem} pointerEvents="none">
        <Text style={[styles.label, activeTab === 'qr' && styles.labelActive]}>
          Generar QR
        </Text>
      </View>

      {/* Historial */}
      <TouchableOpacity
        style={styles.item}
        onPress={onHistorialPress}
        activeOpacity={0.85}
      >
        <Ionicons
          name="time-outline"
          size={22}
          color={activeTab === 'historial' ? COLORS.primary : COLORS.text}
        />
        <Text
          style={[
            styles.label,
            activeTab === 'historial' && styles.labelActive,
          ]}
        >
          Historial
        </Text>
      </TouchableOpacity>

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
  // barra blanca
  wrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 14,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingTop: 10, // espacio para el FAB
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    // sombra
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    width: 92,
  },
  centerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    width: 92, // mismo ancho que los tabs laterales
  },
  label: { fontSize: 12, color: COLORS.text, marginTop: 4 },
  labelActive: { color: COLORS.primary, fontWeight: '600' },

  // botón flotante
  fab: {
    position: 'absolute',
    top: -26,
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

  // texto bajo el FAB
  fabText: {
    position: 'absolute',
    left: 0, // ocupa todo el ancho del wrapper
    right: 0,
    textAlign: 'center',
    alignSelf: 'center',
    bottom: 8,
    fontSize: 12,
    color: COLORS.text,
  },
});
