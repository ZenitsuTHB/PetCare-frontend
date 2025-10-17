// src/screens/Archivos/ArchivosScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Alert, Platform, Linking } from 'react-native';
import { BackButton, QRModal, DocumentCard } from '../../components';
import PageHeader from '../../components/Headers/PageHeader';
import EmptyState from '../../components/EmptyState/EmptyState';
import Button from '../../components/Button/Button';
import PetDetailsFooter from '../../components/Footers/PetDetailsFooter';
import { useFiles } from '../../contexts/FilesContext';
import { usePets } from '../../contexts/PetContext';
import { getPetIdSync } from '../../utils/petUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ArchivosScreen({ route, navigation }) {
  const { petName, pet } = route.params; // Recibir datos de la mascota
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('archivos'); // Tab activo por defecto
  const { getPetFiles, addFile, removeFile, petFiles } = useFiles();
  const { getPetIdImmediate } = usePets();
  
  // Obtener archivos del contexto usando ID único
  const petId = getPetIdImmediate(pet, petName) || getPetIdSync(pet, petName);
  const petData = getPetFiles(petId);
  const documents = petData.files || [];

  // Verificar si hay archivos
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
    
    if (!document.fileUri) {
      Alert.alert('Error', 'No se encontró el archivo para descargar');
      return;
    }

    try {
      // Verificar si el archivo existe
      const fileInfo = await FileSystem.getInfoAsync(document.fileUri);
      if (!fileInfo.exists) {
        Alert.alert(
          'Archivo no disponible',
          'El archivo temporal ya no está disponible. En modo de prueba, los archivos se limpian automáticamente.',
          [{ text: 'Entendido', style: 'default' }]
        );
        return;
      }

      if (Platform.OS === 'web') {
        // En web, intentar descargar el archivo
        try {
          // Crear un enlace de descarga
          const link = window.document.createElement('a');
          link.href = document.fileUri;
          link.download = document.fileName || 'documento';
          link.style.display = 'none';
          window.document.body.appendChild(link);
          link.click();
          window.document.body.removeChild(link);
          
          Alert.alert('✅ Descarga iniciada', `"${document.title || document.fileName}" se está descargando...`);
        } catch (webError) {
          console.error('Web download error:', webError);
          // Fallback: abrir en nueva ventana
          window.open(document.fileUri, '_blank');
          Alert.alert('✅ Archivo abierto', 'El archivo se ha abierto en una nueva ventana');
        }
      } else {
        // En móvil, usar sharing para "descargar" (guardar/compartir)
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(document.fileUri, {
            mimeType: getMimeType(document.fileName),
            dialogTitle: `Descargar ${document.title || document.fileName}`,
          });
        } else {
          Alert.alert('Error', 'No se puede descargar archivos en este dispositivo');
        }
      }
    } catch (error) {
      console.error('❌ Download error:', error);
      Alert.alert(
        'Error de descarga',
        'No se pudo descargar el archivo. El archivo temporal puede haber sido eliminado.',
        [{ text: 'Entendido', style: 'default' }]
      );
    }
  };

  const handleDocumentPress = async (document) => {
    console.log('📄 Document pressed:', document.title);
    
    // Si es una imagen, intentar abrir directamente
    const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];
    const fileExtension = document.fileName?.split('.').pop()?.toLowerCase();
    const isImage = imageTypes.includes(fileExtension);
    
    if (Platform.OS === 'web') {
      // En web, abrir directamente el archivo
      if (document.fileUri) {
        window.open(document.fileUri, '_blank');
      } else {
        Alert.alert('Error', 'No se puede visualizar el archivo: URI no disponible');
      }
    } else {
      // En móvil, mostrar opciones
      Alert.alert(
        document.title,
        `${document.description || 'Sin descripción'}\n\nFecha: ${document.date || 'Sin fecha'}\nTamaño: ${formatFileSize(document.fileSize)}`,
        [
          { text: 'Cerrar', style: 'cancel' },
          { 
            text: isImage ? 'Ver imagen' : 'Abrir', 
            onPress: () => handleViewDocument(document) 
          },
          { text: 'Descargar', onPress: () => handleDownloadDocument(document) }
        ]
      );
    }
  };

  const handleViewDocument = async (document) => {
    console.log('👀 Viewing document:', document.fileName);
    
    if (!document.fileUri) {
      Alert.alert('Error', 'No se encontró el archivo');
      return;
    }

    try {
      // Verificar si el archivo existe
      const fileInfo = await FileSystem.getInfoAsync(document.fileUri);
      if (!fileInfo.exists) {
        Alert.alert(
          'Archivo no disponible',
          'El archivo temporal ya no está disponible. Los archivos se limpian automáticamente por el sistema.',
          [{ text: 'Entendido', style: 'default' }]
        );
        return;
      }

      // Intentar abrir el archivo con una aplicación externa
      if (Platform.OS === 'ios') {
        // En iOS usar Linking para abrir con aplicación predeterminada
        const canOpen = await Linking.canOpenURL(document.fileUri);
        if (canOpen) {
          await Linking.openURL(document.fileUri);
        } else {
          // Fallback: compartir el archivo
          await Sharing.shareAsync(document.fileUri);
        }
      } else {
        // En Android, usar sharing que permite abrir con aplicaciones
        await Sharing.shareAsync(document.fileUri);
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      Alert.alert(
        'No se puede abrir',
        'No se pudo abrir el archivo. Intenta descargarlo o abrirlo con otra aplicación.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Compartir', onPress: () => handleShareDocument(document) }
        ]
      );
    }
  };

  const handleShareDocument = async (document) => {
    try {
      if (document.fileUri && await FileSystem.getInfoAsync(document.fileUri).then(info => info.exists)) {
        await Sharing.shareAsync(document.fileUri, {
          mimeType: getMimeType(document.fileName),
          dialogTitle: `Compartir ${document.title}`
        });
      } else {
        Alert.alert('Error', 'Archivo no disponible para compartir');
      }
    } catch (error) {
      console.error('Error sharing document:', error);
      Alert.alert('Error', 'No se pudo compartir el archivo');
    }
  };

  const getMimeType = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    const mimeTypes = {
      'pdf': 'application/pdf',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    return mimeTypes[extension] || 'application/octet-stream';
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
          pet={pet}
          petName={petName}
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
