import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { BackButton } from '../../components';
import * as DocumentPicker from 'expo-document-picker';
import { uploadDocument } from '../../api/documents';

export default function UploadDocumentScreen({ route, navigation }) {
  const { petName, pet } = route.params || {};
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState(null);
  const [fileUri, setFileUri] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false });
      if (res.type === 'success') {
        // res.uri, res.name, res.size, res.mimeType
        setFileName(res.name);
        setFileUri(res.uri);
      }
    } catch (err) {
      console.log('Document pick error', err);
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  const handleSubmit = async () => {
    // Validar campos
    const errors = {};
    if (!title.trim()) errors.title = 'El título es obligatorio';
    if (!fileUri) errors.file = 'Debes seleccionar un archivo';

    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await uploadDocument({
        fileUri,
        fileName,
        title,
        date,
        description,
        petId: pet?.id || '',
      });

      console.log('Upload response', resp);
      Alert.alert('Éxito', 'Documento subido correctamente');
      navigation.goBack();
    } catch (err) {
      console.error('Upload error', err);
      Alert.alert('Error', err.message || 'La subida falló');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFF8F4" barStyle="dark-content" />

      <View style={styles.content}>
        <BackButton text="Volver al perfil" onPress={() => navigation.goBack()} />

        <Text style={styles.title}>Subir archivo</Text>
        <Text style={styles.subtitle}>Añade el documento que quieras subir.</Text>

        <TouchableOpacity style={styles.uploadBox} onPress={handlePickFile}>
          <View style={styles.uploadInner}>
            <View style={styles.iconPlaceholder} />
            <View style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Subir archivo</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>Título del documento *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#717171"
          />
          {formErrors.title ? <Text style={styles.errorText}>{formErrors.title}</Text> : null}

          <Text style={styles.label}>Fecha *</Text>
          <TextInput
            style={styles.input}
            placeholder="Fecha de expedición"
            value={date}
            onChangeText={setDate}
            placeholderTextColor="#62748E"
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Breve descripción."
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#62748E"
            multiline
          />

          <TouchableOpacity
            style={[styles.submitButton, (!fileName || isSubmitting) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!fileName || isSubmitting}
          >
            <Text style={styles.submitButtonText}>Subir</Text>
          </TouchableOpacity>

          {formErrors.file ? <Text style={styles.errorText}>{formErrors.file}</Text> : null}
          {fileName ? <Text style={styles.fileName}>Archivo seleccionado: {fileName}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F4', paddingHorizontal: 16, paddingVertical: 12 },
  content: { flex: 1 },
  title: { color: '#FB999A', fontSize: 24, fontWeight: '900', marginTop: 8 },
  subtitle: { color: '#494949', fontSize: 16, marginTop: 8, marginBottom: 16 },
  errorText: { color: '#D9534F', marginBottom: 8 },
  uploadBox: { padding: 24, backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#B3C494', alignItems: 'center', marginBottom: 12 },
  uploadInner: { alignItems: 'center' },
  iconPlaceholder: { width: 48, height: 48, borderWidth: 2, borderColor: '#86936F', borderRadius: 4, marginBottom: 12 },
  uploadButton: { height: 32, paddingHorizontal: 12, backgroundColor: '#CADDA7', borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  uploadButtonText: { color: '#4E5641', fontSize: 14, fontWeight: '600' },
  form: { marginTop: 12 },
  label: { color: '#2C2C2C', fontSize: 14, fontWeight: '500', marginBottom: 6 },
  input: { height: 40, paddingHorizontal: 12, backgroundColor: '#FFFFFF', borderRadius: 6, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12, color: '#000' },
  textarea: { height: 80, textAlignVertical: 'top', paddingTop: 8 },
  submitButton: { alignSelf: 'stretch', paddingVertical: 16, backgroundColor: '#FA8081', borderRadius: 18, alignItems: 'center', marginTop: 8 },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: '#FFF8F4', fontSize: 16, fontWeight: '600' },
  fileName: { marginTop: 8, color: '#333' },
});
