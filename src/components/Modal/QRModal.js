import React from 'react';
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

const QRModal = ({
  visible,
  onClose,
  petName = 'tu mascota',
}) => {
  console.log('QRModal render - visible:', visible);
  
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
            {/* QR Content Section */}
            <View style={styles.qrSection}>
              {/* QR Image */}
              <Image
                source={require('../../assets/images/qrCodeEX.png')}
                style={styles.qrImage}
                resizeMode="contain"
              />
              
              {/* Description */}
              <View style={styles.descriptionSection}>
                <Text style={styles.description}>
                  Escanea el QR para acceder a todos sus datos.
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
    height: 349.42,
    width: '100%',
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