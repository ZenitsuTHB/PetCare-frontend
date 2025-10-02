// src/screens/Archivos/ArchivosScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Text } from 'react-native';
import { BackButton, QRModal } from '../../components';
import PageHeader from '../../components/Headers/PageHeader';
import EmptyState from '../../components/EmptyState/EmptyState';
import Button from '../../components/Button/Button';
import PetDetailsFooter from '../../components/Footers/PetDetailsFooter';

export default function ArchivosScreen({ route, navigation }) {
  const { petName, pet } = route.params; // Recibir datos de la mascota
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('archivos'); // Tab activo por defecto

  // Datos para simular que no hay archivos (empty state)
  const hasFiles = false; // Cambiar a true cuando haya archivos

  const handleArchivosPress = () => {
    console.log('Archivos pressed');
    setActiveTab('archivos');
    // Ya estamos en archivos
  };

  const handleQRPress = () => {
    console.log('QR pressed in ArchivosScreen');
    setActiveTab('qr');
    setQrModalVisible(true);
  };

  const handleHistorialPress = () => {
    console.log('Historial pressed');
    setActiveTab('historial');
    navigation.navigate('Historial', { petName, pet });
  };

  const handleAddDocument = () => {
    console.log('Añadir documento pressed');
    // TODO: Implementar funcionalidad para agregar documentos
    // Podrías abrir un selector de archivos, cámara, etc.
  };

  // Configuración del empty state personalizado
  const renderEmptyStateWithButton = () => (
    <View style={styles.emptyStateContainer}>
      <EmptyState
        image={require('../../assets/images/barbob.png')}
        title="¡Sin papeles!"
        description="Sube aquí la documentación de tu mascota"
        containerStyle={styles.emptyStateContent}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Añadir documento"
          variant="primary"
          size="large"
          iconName="add"
          iconPosition="left"
          onPress={handleAddDocument}
          fullWidth
        />
      </View>
    </View>
  );

  // Simular lista de archivos para cuando hasFiles = true
  const renderFilesList = () => (
    <View style={styles.filesListContainer}>
      {/* Simulando archivos para mostrar el scroll */}
      {Array.from({ length: 10 }, (_, index) => (
        <View key={index} style={styles.fileItem}>
          <View style={styles.fileContent}>
            <View style={styles.fileIcon} />
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>Documento {index + 1}.pdf</Text>
              <Text style={styles.fileDate}>Subido hace 2 días</Text>
            </View>
          </View>
        </View>
      ))}
      
      {/* Botón de agregar documento también cuando hay archivos */}
      <View style={styles.buttonContainer}>
        <Button
          title="Añadir documento"
          variant="primary"
          size="large"
          iconName="add"
          iconPosition="left"
          onPress={handleAddDocument}
          fullWidth
        />
      </View>
      
      {/* Spacer para que el último elemento no quede pegado al footer */}
      <View style={styles.bottomSpacer} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFF8F4" barStyle="dark-content" />

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.contentWrapper}>
          {/* Back Button */}
          <BackButton
            text="Volver al perfil"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />

          {/* Page Header */}
          <PageHeader 
            title="Archivos adjuntos" 
            subtitle="Documentación de la mascota." 
          />

          {/* Content with ScrollView for files or EmptyState */}
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {hasFiles ? renderFilesList() : renderEmptyStateWithButton()}
          </ScrollView>
        </View>

        {/* PetDetailsFooter */}
        <PetDetailsFooter
          activeTab={activeTab}
          onArchivosPress={handleArchivosPress}
          onQRPress={handleQRPress}
          onHistorialPress={handleHistorialPress}
        />
      </View>

      {/* QR Modal */}
      <QRModal
        visible={qrModalVisible}
        onClose={() => setQrModalVisible(false)}
        petName={petName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F4',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
    zIndex: 1, // Permitir que el contenido pase debajo del footer
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20, // Espacio extra para scroll cómodo
  },
  // Estados Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContent: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  // Estados con archivos
  filesListContainer: {
    flex: 1,
    paddingTop: 8,
  },
  fileItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FA8081',
    borderRadius: 8,
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  fileDate: {
    fontSize: 14,
    color: '#666666',
  },
  bottomSpacer: {
    height: 80, // Espacio para que el footer no tape el último elemento
  },
});