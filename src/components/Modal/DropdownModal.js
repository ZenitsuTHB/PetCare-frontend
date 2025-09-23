import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import Button from '../Button/Button';

const { width: screenWidth } = Dimensions.get('window');

const DropdownModal = ({
  visible,
  onClose,
  options = [],
  onSelect,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.blurOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.dropdown}>
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
                option.danger && styles.dangerOption,
              ]}
              textStyle={[
                styles.dropdownOptionText,
                option.danger && styles.dangerText,
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default DropdownModal;

const styles = StyleSheet.create({
  blurOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Efecto blur más intenso
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingVertical: 4,
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