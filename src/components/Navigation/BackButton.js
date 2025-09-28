import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BackButton = ({
  onPress,
  text = 'Volver al perfil',
  iconName = 'arrow-back',
  iconSize = 20,
  style = {},
  textStyle = {},
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Ionicons name={iconName} size={iconSize} color={COLORS.text} />
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default BackButton;

const COLORS = {
  text: '#636363', // Color unificado para flecha y texto
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 18,
    alignSelf: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Espacio entre el icono y el texto
  },
  text: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 25.6,
  },
});
