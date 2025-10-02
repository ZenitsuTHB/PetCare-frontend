import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Button from '../Button/Button';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const QRModal = ({ visible, onClose, petName = 'tu mascota' }) => {
  const [imageError, setImageError] = useState(false);
  
  console.log('QRModal render - visible:', visible, 'petName:', petName);

  const handleImageError = (error) => {
    console.log('Image loading error:', error);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully');
    setImageError(false);
  };

  if (!visible) {
    console.log('QRModal not visible, returning null');
    return null;
  }

  console.log('QRModal rendering modal content');

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
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Código QR</Text>
              <Text style={styles.subtitle}>de {petName}</Text>
            </View>

            {/* QR Content Section */}
            <View style={styles.qrSection}>
              {/* QR Image */}
              {imageError ? (
                <View style={[styles.qrImage, styles.errorContainer]}>
                  <Text style={styles.errorText}>⚠️ Error cargando QR</Text>
                  <Text style={styles.errorSubtext}>Intenta cerrar y abrir de nuevo</Text>
                </View>
              ) : (
                <Image
                  source={require('../../assets/images/qrCodeEX.png')}
                  style={styles.qrImage}
                  resizeMode="contain"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              )}

              {/* Description */}
              <View style={styles.descriptionSection}>
                <Text style={styles.description}>
                  Escanea el QR para acceder a todos los datos de {petName}.
                </Text>
              </View>
            </View>

            {/* Button Section */}
            <View style={styles.buttonSection}>
              <Button
                title="Cerrar"
                variant="primary"
                size="large"
                onPress={onClose}
                fullWidth
                style={styles.closeButton}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default QRModal;

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

  // Header
  header: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#020618',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#636363',
  },

  // QR Section
  qrSection: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  qrImage: {
    alignSelf: 'stretch',
    height: 280,
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  errorSubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  descriptionSection: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 12,
  },
  description: {
    alignSelf: 'stretch',
    textAlign: 'center',
    color: '#636363',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 21,
  },

  // Button Section
  buttonSection: {
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 16,
  },
  closeButton: {
    flex: 1,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FA8081',
    borderRadius: 18,
  },
});
