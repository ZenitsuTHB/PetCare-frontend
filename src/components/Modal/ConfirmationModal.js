import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Button from '../Button/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  icon = 'warning',
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Blur Background */}
      <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          {/* Modal Content */}
          <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
            <View style={styles.modal}>
              {/* Icon Section */}
              <View style={styles.iconSection}>
                <View style={styles.iconContainer}>
                  <View style={styles.iconCircle}>
                    <Icon name={icon} size={28} color="#FA8081" />
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
          </TouchableOpacity>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
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
