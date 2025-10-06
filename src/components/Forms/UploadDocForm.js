import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import ContentContainer from '../../components/ContentContainer/ContentContainer';
import BackButton from '../Navigation/BackButton';

export default function UploadDocForm({ onSubmit }) {
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = () => {
    if (!titulo || !fecha) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }
    const data = { titulo, fecha, descripcion };
    onSubmit?.(data); // callback opcional
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>

        <BackButton
          text="Volver al perfil"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <ContentContainer
          title="Subir documento"
          subtitle="Añade el documento que quieras subir."
        >

          <View style={styles.uploadBox}>
            <View style={styles.iconWrapper}>
              <View style={styles.iconPlaceholder} />
            </View>

            <View style={styles.buttonArea}>
              <TouchableOpacity style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Subir archivo</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Título del documento *</Text>
            <TextInput
              value={titulo}
              onChangeText={setTitulo}
              style={styles.input}
              placeholder="Nombre completo"
            />

            <Text style={styles.label}>Fecha *</Text>
            <TextInput
              value={fecha}
              onChangeText={setFecha}
              style={styles.input}
              placeholder="Fecha de expedición"
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              value={descripcion}
              onChangeText={setDescripcion}
              style={[styles.input, styles.textArea]}
              placeholder="Breve descripción."
              multiline
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Subir</Text>
          </TouchableOpacity>
        </ContentContainer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFA',
    borderRadius: 20,
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  uploadBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B3C494',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    position: 'relative',
    marginBottom: 12,
  },
  iconPlaceholder: {
    width: 36,
    height: 32,
    position: 'absolute',
    left: 6,
    top: 8,
    borderWidth: 2,
    borderColor: '#86936F',
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  buttonArea: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  uploadButton: {
    height: 32,
    paddingHorizontal: 12,
    backgroundColor: '#CADDA7',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: '#4E5641',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 21,
  },
  form: {
    gap: 12,
  },
  label: {
    color: '#2C2C2C',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textArea: {
    height: 80,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#FA8081',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFF8F4',
    fontSize: 16,
    fontWeight: '600',
  },
});
