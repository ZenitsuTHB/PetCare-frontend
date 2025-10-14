// src/screens/Archivos/ArchivosScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Alert, Platform, Linking } from 'react-native';
import { BackButton, QRModal, DocumentCard } from '../../components';
import PageHeader from '../../components/Headers/PageHeader';
import EmptyState from '../../components/EmptyState/EmptyState';
import Button from '../../components/Button/Button';
import PetDetailsFooter from '../../components/Footers/PetDetailsFooter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ArchivosScreen({ route, navigation }) {
  const { petName, pet } = route.params; // Recibir datos de la mascota
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('archivos'); // Tab activo por defecto
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load documents from AsyncStorage
  const loadDocuments = useCallback(async () => {
    try {
      console.log('📂 Loading documents for pet:', pet?.id || petName);
      const docKey = `documents:${pet?.id || petName || 'default'}`;
      const docsStr = await AsyncStorage.getItem(docKey);
      
      if (docsStr) {
        const docs = JSON.parse(docsStr);
        console.log('✅ Loaded documents:', docs.length);
        setDocuments(docs);
      } else {
        console.log('📭 No documents found');
        setDocuments([]);
      }
    } catch (err) {
      console.error('❌ Error loading documents:', err);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, [pet, petName]);

  // Load documents when screen comes into focus
  useEffect(() => {
    loadDocuments();
    
    // Reload documents when screen comes back into focus
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🔄 Screen focused, reloading documents...');
      loadDocuments();
    });

    return unsubscribe;
  }, [loadDocuments, navigation]);

  const hasFiles = documents.length > 0;

  const handleArchivosPress = () => {
    console.log('Archivos pressed');
    setActiveTab('archivos');
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
    navigation.navigate('UploadDocument', { petName, pet });
  };

  const handleDownloadDocument = async (document) => {
    console.log('📥 Download requested for:', document.fileName);
    
    // Show info that this is test mode with temporary files
    Alert.alert(
      'Modo de prueba',
      'Los archivos se guardan temporalmente y serán limpiados automáticamente por el sistema.\n\nCuando se integre con el backend, los archivos se almacenarán en el servidor y estarán disponibles permanentemente.',
      [
        { text: 'Entendido', style: 'cancel' },
        {
          text: 'Intentar abrir',
          onPress: async () => {
            try {
              if (Platform.OS === 'web') {
                if (document.fileUri) {
                  window.open(document.fileUri, '_blank');
                } else {
                  Alert.alert('Error', 'No se encontró la URL del archivo');
                }
              } else {
                // Try to check and share the file
                if (!document.fileUri) {
                  Alert.alert('Archivo no disponible', 'No se encontró la URI del archivo');
                  return;
                }

                // Check if file still exists
                try {
                  const fileInfo = await FileSystem.getInfoAsync(document.fileUri);
                  if (!fileInfo.exists) {
                    Alert.alert(
                      'Archivo temporal eliminado',
                      'El sistema ya limpió este archivo temporal. Esto es normal en modo de prueba sin backend.'
                    );
                    return;
                  }
                } catch (checkErr) {
                  console.warn('⚠️ Could not check file:', checkErr);
                }

                // Try to share
                const isAvailable = await Sharing.isAvailableAsync();
                if (isAvailable) {
                  await Sharing.shareAsync(document.fileUri, {
                    mimeType: 'application/pdf',
                    dialogTitle: document.title || 'Compartir documento',
                  });
                  console.log('✅ File shared successfully');
                } else {
                  Alert.alert('Info', 'No se puede compartir archivos en este dispositivo');
                }
              }
            } catch (err) {
              console.error('❌ Download/share error:', err);
              Alert.alert(
                'Archivo no disponible',
                'El archivo temporal ya no está disponible (limpiado por el sistema).\n\nEn producción con backend, los archivos estarán siempre disponibles.'
              );
            }
          },
        },
      ]
    );
  };

  const handleDocumentPress = (document) => {
    console.log('📄 Document pressed:', document.title);
    // Could navigate to a document detail screen or preview
    Alert.alert(
      document.title,
      `${document.description || 'Sin descripción'}\n\nFecha: ${document.date || 'Sin fecha'}\nTamaño: ${formatFileSize(document.fileSize)}`,
      [
        { text: 'Cerrar', style: 'cancel' },
        { text: 'Descargar', onPress: () => handleDownloadDocument(document) }
      ]
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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

  // Render list of documents using DocumentCard
  const renderFilesList = () => (
    <View style={styles.filesListContainer}>
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          title={doc.title}
          uploadedBy="Subido por ti"
          date={doc.uploadedAt || doc.date}
          fileType="PDF"
          onDownload={() => handleDownloadDocument(doc)}
          onPress={() => handleDocumentPress(doc)}
        />
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
  bottomSpacer: {
    height: 80, // Espacio para que el footer no tape el último elemento
  },
});
