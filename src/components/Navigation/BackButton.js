import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BackButton = ({ 
  onPress, 
  text = "Volver al perfil",
  iconName = "chevron-back",
  iconSize = 24,
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
        <Ionicons 
          name={iconName} 
          size={iconSize} 
          color="#636363" 
        />
        <Text style={[styles.text, textStyle]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    textAlign: 'center',
    color: '#636363',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    lineHeight: 25.6,
  },
});