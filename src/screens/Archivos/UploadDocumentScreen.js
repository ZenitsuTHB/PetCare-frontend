import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BackButton } from '../../components';
import PetDetailsFooter from '../../components/Footers/PetDetailsFooter';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { uploadDocument } from '../../api/documents';
import '../../utils/debugStorage'; // Load debug tools

export default function UploadDocumentScreen({ route, navigation }) {
  const { petName, pet } = route.params || {};
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState(null);
  const [fileUri, setFileUri] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('archivos');
  const [fileSize, setFileSize] = useState(null);

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const handlePickFile = async () => {
    try {
      console.log('🔍 Starting file picker...');
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: false,
      });
      
      console.log('📄 Picker result:', res);

      if (res.canceled) {
        console.log('❌ User canceled picker');
        return;
      }

      if (res.assets && res.assets.length > 0) {
        // New API (Expo SDK 51+)
        const file = res.assets[0];
        console.log('✅ File picked (new API):', file);
        
        const isPdf = file.mimeType === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        if (!isPdf) {
          Alert.alert('Error', 'Solo se permiten archivos PDF por ahora');
          return;
        }

        let uriToUse = file.uri;

        // Handle content URI on Android (skip for web)
        if (Platform.OS !== 'web' && uriToUse && uriToUse.startsWith('content:')) {
          try {
            const dest = FileSystem.cacheDirectory + (file.name || `picked-${Date.now()}.pdf`);
            await FileSystem.copyAsync({ from: uriToUse, to: dest });
            uriToUse = dest;
            console.log('📋 Copied content URI to:', dest);
          } catch (fsErr) {
            console.warn('⚠️  FileSystem copy failed, using original uri', fsErr);
          }
        }

        setFileName(file.name);
        setFileUri(uriToUse);
        setFileSize(file.size);

        console.log('✅ File set:', { name: file.name, size: file.size, uri: uriToUse });
        
        // Start upload simulation immediately after file picked
        await simulateUpload(file.name, file.size, uriToUse);
        
      } else if (res.type === 'success') {
        // Old API (backward compatibility)
        const name = res.name || '';
        const mime = res.mimeType || '';
        const isPdf = mime === 'application/pdf' || name.toLowerCase().endsWith('.pdf');
        
        if (!isPdf) {
          Alert.alert('Error', 'Solo se permiten archivos PDF por ahora');
          return;
        }

        let uriToUse = res.uri;

        if (Platform.OS !== 'web' && uriToUse && uriToUse.startsWith('content:')) {
          try {
            const dest = FileSystem.cacheDirectory + (res.name || `picked-${Date.now()}.pdf`);
            await FileSystem.copyAsync({ from: uriToUse, to: dest });
            uriToUse = dest;
          } catch (fsErr) {
            console.warn('FileSystem copy failed, will try original uri', fsErr);
          }
        }

        setFileName(res.name);
        setFileUri(uriToUse);
        setFileSize(res.size);

        console.log('✅ File set (old API):', { name: res.name, size: res.size, uri: uriToUse });
        
        // Start upload simulation immediately after file picked
        await simulateUpload(res.name, res.size, uriToUse);
      }
    } catch (err) {
      console.error('❌ Document pick error:', err);
      Alert.alert('Error', `No se pudo seleccionar el archivo: ${err.message}`);
    }
  };

  const simulateUpload = async (name, size, uri) => {
    setUploading(true);
    setUploadProgress(0);
    setUploadedFile(null);
    console.log('⏳ Starting upload simulation...');

    try {
      // Simulate upload progress
      await new Promise((resolve) => {
        let pct = 0;
        const int = setInterval(() => {
          pct += Math.floor(Math.random() * 20) + 10;
          if (pct >= 100) {
            pct = 100;
            setUploadProgress(pct);
            clearInterval(int);
            resolve();
          } else {
            setUploadProgress(pct);
          }
        }, 200);
      });

      console.log('✅ Upload simulation complete');
      
      // Set uploaded file to show the completed card
      setUploadedFile({ name, size });
      
      if (__DEV__) {
        Alert.alert('✅ Archivo cargado', `${name}\nTamaño: ${formatFileSize(size)}\n\nAhora completa el formulario.`);
      }
    } catch (err) {
      console.error('❌ Upload simulation error:', err);
      Alert.alert('Error', 'Falló la carga del archivo');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async () => {
    console.log('🚀 Submit started');
    
    // Validate required fields
    if (!uploadedFile) {
      Alert.alert('Error', 'Por favor sube un archivo primero');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título');
      return;
    }

    console.log('✅ Validation passed');
    console.log('� Submit data:', { title, date, description, uploadedFile, fileUri });

    setIsSubmitting(true);
    console.log('💾 Starting document save...');

    try {
      // Save document metadata to AsyncStorage
      const docKey = `documents:${pet?.id || petName || 'default'}`;
      console.log('💾 Saving to AsyncStorage key:', docKey);
      
      const existingDocsStr = await AsyncStorage.getItem(docKey);
      const existingDocs = existingDocsStr ? JSON.parse(existingDocsStr) : [];
      console.log('📚 Existing documents:', existingDocs.length);

      const newDoc = {
        id: Date.now().toString(),
        fileName: uploadedFile.name,
        fileUri,
        fileSize: uploadedFile.size,
        title: title.trim(),
        date: date.trim(),
        description: description.trim(),
        uploadedAt: new Date().toISOString(),
        petId: pet?.id,
        petName: pet?.name || petName,
      };

      existingDocs.push(newDoc);
      await AsyncStorage.setItem(docKey, JSON.stringify(existingDocs));

      console.log('✅ Document saved:', newDoc);
      console.log('� Total documents for pet:', existingDocs.length);

      Alert.alert(
        '✅ Documento guardado',
        `"${title}" ha sido guardado exitosamente`,
        [
          {
            text: 'Ver Archivos',
            onPress: () => {
              console.log('📂 Navigating back to Archivos');
              navigation.goBack();
            },
          },
          {
            text: 'Subir Otro',
            onPress: () => {
              console.log('🔄 Resetting form for another upload');
              setTitle('');
              setDate('');
              setDescription('');
              setFileName('');
              setFileUri('');
              setFileSize(0);
              setUploadedFile(null);
              setUploadProgress(0);
            },
          },
        ]
      );
    } catch (err) {
      console.error('❌ Save error:', err);
      Alert.alert('Error', `No se pudo guardar: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFile = () => {
    setFileName('');
    setFileUri('');
    setFileSize(0);
    setUploadedFile(null);
    setUploadProgress(0);
    console.log('🗑️ File removed');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar backgroundColor="#FFF8F4" barStyle="dark-content" />

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContentContainer}
      >
        <BackButton
          text="Volver al perfil"
          onPress={() => navigation.goBack()}
        />

        <Text style={styles.title}>Subir archivo</Text>
        <Text style={styles.subtitle}>
          Añade el documento que quieras subir.
        </Text>

        {/* Show upload button ONLY if not uploading and no file uploaded yet */}
        {!uploading && !uploadedFile && (
          <TouchableOpacity style={styles.uploadBox} onPress={handlePickFile}>
            <View style={styles.uploadInner}>
              <View style={styles.iconPlaceholder} />
              <View style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Subir archivo</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Uploading progress card - replaces upload button during upload */}
        {uploading && (
          <View style={styles.uploadingCard}>
            <Text style={styles.uploadingTitle}>Uploading...</Text>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${uploadProgress}%` },
                ]}
              />
            </View>
          </View>
        )}

        {/* Uploaded file card - replaces uploading card when done */}
        {uploadedFile && !uploading && (
          <View style={styles.uploadedCard}>
            <View style={styles.uploadedRow}>
              <View style={{ width: 36, height: 36, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="document-text" size={32} color="#FA8081" />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.uploadedName}>{uploadedFile.name}</Text>
                <Text style={styles.uploadedSize}>{formatFileSize(uploadedFile.size)}</Text>
              </View>
              <View style={{ justifyContent: 'center' }}>
                <Ionicons name="checkmark-circle" size={24} color="#B3C494" />
              </View>
            </View>
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.label}>Título del documento *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#717171"
            editable={!uploading}
          />
          {formErrors.title ? (
            <Text style={styles.errorText}>{formErrors.title}</Text>
          ) : null}

          <Text style={styles.label}>Fecha *</Text>
          <TextInput
            style={styles.input}
            placeholder="Fecha de expedición"
            value={date}
            onChangeText={setDate}
            placeholderTextColor="#62748E"
            editable={!uploading}
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Breve descripción."
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#62748E"
            multiline
            editable={!uploading}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!uploadedFile || !title.trim() || isSubmitting) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!uploadedFile || !title.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF8F4" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Subir</Text>
            )}
          </TouchableOpacity>

          {formErrors.file ? (
            <Text style={styles.errorText}>{formErrors.file}</Text>
          ) : null}
          
          {fileName && !uploading ? (
            <View style={styles.fileNameRow}>
              <Text style={styles.fileName}>
                Archivo seleccionado: {fileName}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setFileName(null);
                  setFileUri(null);
                  setFileSize(null);
                  setUploadedFile(null);
                  setFormErrors({});
                }}
                style={styles.removeFileButton}
              >
                <Ionicons name="close-circle" size={20} color="#D9534F" />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>
      
      {/* Footer */}
      <PetDetailsFooter
        activeTab={activeTab}
        onArchivosPress={() => navigation.navigate('Archivos', { petName, pet })}
        onQRPress={() => navigation.navigate('PetDetails', { petName, pet })}
        onHistorialPress={() => navigation.navigate('Historial', { petName, pet })}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F4',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  content: { flex: 1 },
  title: { color: '#FB999A', fontSize: 24, fontWeight: '900', marginTop: 8 },
  subtitle: { color: '#494949', fontSize: 16, marginTop: 8, marginBottom: 16 },
  errorText: { color: '#D9534F', marginBottom: 8 },
  uploadBox: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B3C494',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadInner: { alignItems: 'center' },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: '#86936F',
    borderRadius: 4,
    marginBottom: 12,
  },
  uploadButton: {
    height: 32,
    paddingHorizontal: 12,
    backgroundColor: '#CADDA7',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: { color: '#4E5641', fontSize: 14, fontWeight: '600' },
  form: { marginTop: 12 },
  label: { color: '#2C2C2C', fontSize: 14, fontWeight: '500', marginBottom: 6 },
  input: {
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    color: '#000',
  },
  textarea: { height: 80, textAlignVertical: 'top', paddingTop: 8 },
  submitButton: {
    alignSelf: 'stretch',
    paddingVertical: 16,
    backgroundColor: '#FA8081',
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: '#FFF8F4', fontSize: 16, fontWeight: '600' },
  fileName: { marginTop: 8, color: '#333', flex: 1 },
  fileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  removeFileButton: {
    padding: 4,
  },
  uploadingCard: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CADDA7',
    marginBottom: 12,
  },
  uploadingTitle: { color: '#3D3D3D', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  progressBarTrack: { height: 8, backgroundColor: '#FAFAFA', borderRadius: 100, overflow: 'hidden' },
  progressBarFill: { height: 8, backgroundColor: '#A8B88B', borderRadius: 100, width: '0%' },
  uploadedCard: { padding: 16, backgroundColor: '#FCFEF8', borderRadius: 12, borderWidth: 1, borderColor: '#B3C494', marginBottom: 12 },
  uploadedRow: { flexDirection: 'row', alignItems: 'center' },
  uploadedName: { fontSize: 12, fontWeight: '600', color: '#0B0B0B' },
  uploadedSize: { fontSize: 12, color: '#6D6D6D' },
  uploadedIconPlaceholder: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: '#020618' },
});
