import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  Dimensions 
} from 'react-native';
import Button from '../Button/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width: screenWidth } = Dimensions.get('window');

const Dropdown = ({
  trigger,
  options = [],
  onSelect,
  visible,
  onClose,
  dropdownStyle,
  position = 'center', // 'center' | 'absolute' | 'inline'
  absolutePosition = {}, // { top, right, left, bottom }
}) => {
  // Si es inline, renderizar directamente sin Modal
  if (position === 'inline') {
    return visible ? (
      <View style={[styles.inlineDropdown, absolutePosition, dropdownStyle]}>
        {options.map((option, index) => (
          <Button
            key={index}
            title={option.label}
            variant="ghost"
            size="small"
            iconName={option.icon}
            iconPosition="left"
            iconSize={16}
            onPress={() => {
              onSelect(option);
              onClose();
            }}
            style={[
              styles.dropdownOption,
              option.danger && styles.dangerOption
            ]}
            textStyle={[
              styles.dropdownOptionText,
              option.danger && styles.dangerText
            ]}
          />
        ))}
      </View>
    ) : null;
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={position === 'absolute' ? styles.absoluteOverlay : styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={[
          position === 'absolute' ? styles.absoluteDropdown : styles.dropdown, 
          position === 'absolute' && absolutePosition,
          dropdownStyle
        ]}>
          {options.map((option, index) => (
            <Button
              key={index}
              title={option.label}
              variant="ghost"
              size="small"
              iconName={option.icon}
              iconPosition="left"
              iconSize={16}
              onPress={() => {
                onSelect(option);
                onClose();
              }}
              style={[
                styles.dropdownOption,
                option.danger && styles.dangerOption
              ]}
              textStyle={[
                styles.dropdownOptionText,
                option.danger && styles.dangerText
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  absoluteOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 120,
    maxWidth: screenWidth - 40,
  },
  absoluteDropdown: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 120,
    paddingVertical: 4,
  },
  inlineDropdown: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 120,
    paddingVertical: 4,
    zIndex: 15,
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
    borderRadius: 0,
    justifyContent: 'flex-start',
  },
  dropdownOptionText: {
    color: '#020618',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'left',
  },
  dangerOption: {
    // Estilo específico para opciones peligrosas si es necesario
  },
  dangerText: {
    color: '#FF4444',
  },
});