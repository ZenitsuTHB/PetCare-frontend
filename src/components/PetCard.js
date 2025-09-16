import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const PetCard = () => {
  return (
    <View style={styles.card}>
      {/* Imagen redonda */}
      <Image 
        source={require('../assets/images/hamgster.jpg')} 
        style={styles.image} 
      />

      {/* Contenido */}
      <View style={styles.content}>
        {/* Título */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Aperitivo :)</Text>
          <View style={styles.iconPlaceholder} />
        </View>

        {/* Subtítulo */}
        <Text style={styles.subtitle}>Hamster - Ruso - 1 kg</Text>

        {/* Info extra */}
        <Text style={styles.info}>Chip: 981100002343567</Text>
        <Text style={styles.info}>Fecha: 00/00/0000</Text>

        {/* Botones */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Mostrar QR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PetCard;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 24,
    backgroundColor: '#FFF8F4',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFBA92',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#FFBA92',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    color: '#594133',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 32,
  },
  iconPlaceholder: {
    width: 28,
    height: 28,
  },
  subtitle: {
    color: '#2C2C2C',
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 16.8,
  },
  info: {
    color: '#2C2C2C',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  outlineButton: {
    flex: 1,
    height: 32,
    backgroundColor: 'white',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  outlineButtonText: {
    color: '#0F172B',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
  primaryButton: {
    flex: 1,
    height: 32,
    backgroundColor: '#FFBA92',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#2C2C2C',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
});
