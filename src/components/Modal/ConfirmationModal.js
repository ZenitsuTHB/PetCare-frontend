import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Button from '../Button/Button';
import { AntDesign } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  title = '¿Eliminar mascota?',
  message = 'Estas a punto de eliminar todos los datos de este perfil. Este cambio',
  messageHighlight = 'es irreversible',
  messageContinuation = '.',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  confirmVariant = 'danger',
  icon = 'exclamation',
}) => {
  console.log('ConfirmationModal render - visible:', visible);
  
  if (!visible) return null;
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Background Overlay */}
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backgroundTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        
        {/* Modal Content */}
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            {/* Icon Section */}
            <View style={styles.iconSection}>
              <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                  <AntDesign name={icon} size={32} color="#FA8081" />
                </View>
              </View>

              {/* Title */}
              <Text style={styles.title}>{title}</Text>
            </View>

            {/* Message Section */}
            <View style={styles.messageSection}>
              <Text style={styles.message}>
                {message}{' '}
                <Text style={styles.messageHighlight}>
                  {messageHighlight}
                </Text>
                {messageContinuation}
              </Text>
            </View>

            {/* Buttons Section */}
            <View style={styles.buttonsSection}>
              <Button
                title={cancelText}
                variant="outline"
                size="medium"
                onPress={onClose}
                style={styles.cancelButton}
              />

              <Button
                title={confirmText}
                variant={confirmVariant}
                size="medium"
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
                style={styles.confirmButton}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backgroundTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    gap: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  // Icon section
  iconSection: {
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#FA8081',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    textAlign: 'center',
    color: '#FA8081',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 38.4,
  },

  // Message section
  messageSection: {
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    color: '#636363',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  messageHighlight: {
    fontWeight: '600',
    color: '#636363',
  },

  // Buttons section
  buttonsSection: {
    flexDirection: 'row',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#FA8081',
  },
});
