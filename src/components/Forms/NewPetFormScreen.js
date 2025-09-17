// screens/Forms/NewPetForm/NewPetFormScreen.js
import React, { useMemo, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  Alert,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from '../Utils/LinearGradient';
import * as ImagePicker from 'expo-image-picker';
import { usePets } from '../../contexts/PetContext';

const PINK = '#FB999A'; // unificamos rosa para gradient y header

const COLORS = {
  header: PINK,
  text: '#121212',
  sub: '#6B6B6B',
  inputBg: '#FFFFFF',
  border: '#EADAD6',
  danger: '#FF6B6B',
  cta: '#FA8081',
};

const SPECIES = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];

export default function NewPetFormScreen({ navigation, route }) {
  const pet = route?.params?.pet || null;
  const isEdit = !!pet;
  const { addPet, updatePet } = usePets();

  const [values, setValues] = useState({
    photoUri: pet?.photoUri || '',
    name: pet?.name || '',
    species: pet?.species || '',
    breed: pet?.breed || '',
    birthdate: pet?.birthdate || '', // dd/mm/aaaa
    chip: pet?.chip || '',
    notes: pet?.notes || '',
    consent: !!pet?.consent,
  });
  const [touched, setTouched] = useState({});
  const [selectOpen, setSelectOpen] = useState(null); // 'species' | null
  const [submitting, setSubmitting] = useState(false);

  const onChange = (k) => (text) => setValues((s) => ({ ...s, [k]: text }));
  const onBlur = (k) => () => setTouched((s) => ({ ...s, [k]: true }));

  const errors = useMemo(() => {
    const e = {};
    if (!values.name.trim()) e.name = 'Obligatorio';
    if (!values.species.trim()) e.species = 'Obligatorio';
    if (!values.breed.trim()) e.breed = 'Obligatorio';
    if (!values.birthdate.trim()) e.birthdate = 'Obligatorio';
    else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(values.birthdate))
      e.birthdate = 'Usa dd/mm/aaaa';
    if (!values.chip.trim()) {
      e.chip = 'Obligatorio';
    } else if (!/^\d{15}$/.test(values.chip)) {
      e.chip = 'Debe contener exactamente 15 dígitos numéricos';
    } else {
      const prefix = parseInt(values.chip.substring(0, 3), 10);
      if (prefix < 900 || prefix > 985) {
        e.chip = 'Los 3 primeros dígitos deben estar entre 900 y 985';
      }
    }
    if (!values.consent) e.consent = 'Debes aceptar la política de privacidad';
    return e;
  }, [values]);

  const pickImage = async () => {
    // Ejemplo con expo-image-picker (descomenta imports si lo usas)
    // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (status !== 'granted') {
    //   Alert.alert('Permisos', 'Se necesita permiso para acceder a tus fotos.');
    //   return;
    // }
    // const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8 });
    // if (!result.canceled) {
    //   setValues((s) => ({ ...s, photoUri: result.assets[0].uri }));
    // }
    Alert.alert('Imagen', 'Conecta aquí tu selector de imágenes');
  };

  const submit = async () => {
    // marcar todo como tocado para mostrar errores
    setTouched({
      photoUri: true,
      name: true,
      species: true,
      breed: true,
      birthdate: true,
      chip: true,
      notes: true,
      consent: true,
    });

    if (Object.keys(errors).length) {
      Alert.alert(
        'Revisa los campos',
        'Hay datos obligatorios o con formato incorrecto.'
      );
      return;
    }

    try {
      setSubmitting(true);

      const payload = { 
        name: values.name,
        species: values.species,
        breed: values.breed,
        birthdate: values.birthdate,
        chip: values.chip,
        notes: values.notes,
        photoUri: values.photoUri,
      };

      if (isEdit) {
        await updatePet(pet.id, payload);
        Alert.alert('¡Guardado!', 'Los cambios se han actualizado.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await addPet(payload);
        Alert.alert('¡Mascota creada!', 'Guardamos los datos correctamente.', [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
      }
    } catch (err) {
      Alert.alert('Ups', 'No se pudo guardar. Intenta nuevamente.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const [photoModal, setPhotoModal] = useState(false);

  const requestCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  };

  const requestLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  const openCameraAsync = async () => {
    const ok = await requestCamera();
    if (!ok) {
      Alert.alert(
        'Permiso requerido',
        'Activa el acceso a la cámara para continuar.'
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.85,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setValues((s) => ({ ...s, photoUri: result.assets[0].uri }));
    }
    setPhotoModal(false);
  };

  const openLibraryAsync = async () => {
    const ok = await requestLibrary();
    if (!ok) {
      Alert.alert(
        'Permiso requerido',
        'Activa el acceso a tus fotos para continuar.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.85,
      aspect: [1, 1],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setValues((s) => ({ ...s, photoUri: result.assets[0].uri }));
    }
    setPhotoModal(false);
  };

  return (
    <LinearGradient>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={PINK} barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={22} color="#fff" />
              <Text style={styles.backTxt}>Atrás</Text>
            </TouchableOpacity>
            <Text style={styles.title}>
              {isEdit ? 'Editar mascota' : 'Nueva mascota'}
            </Text>
            <View style={{ width: 48 }} />
          </View>

          {/* Foto + botón cámara */}
          <View style={styles.avatar}>
            {values.photoUri ? (
              <Image
                source={{ uri: values.photoUri }}
                style={styles.avatarImg}
              />
            ) : (
              <Text style={{ fontSize: 44 }}>🐾</Text>
            )}
            <TouchableOpacity
              style={styles.camBtn}
              onPress={() => setPhotoModal(true)}
            >
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Panel inferior (igual que Register) */}
        <View style={styles.container}>
          <KeyboardAvoidingView
            style={styles.formSection}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.card}
              keyboardShouldPersistTaps="handled"
            >
              <Field
                label="Nombre *"
                placeholder="Nombre completo"
                value={values.name}
                onChangeText={onChange('name')}
                onBlur={onBlur('name')}
                error={touched.name && errors.name}
              />

              <Select
                label="Especie *"
                placeholder="Tipo"
                value={values.species}
                error={touched.species && errors.species}
                onPress={() => setSelectOpen('species')}
              />

              <Field
                label="Raza *"
                placeholder="Indique raza específica"
                value={values.breed}
                onChangeText={onChange('breed')}
                onBlur={onBlur('breed')}
                error={touched.breed && errors.breed}
              />

              <Field
                label="Fecha de nacimiento *"
                placeholder="dd/mm/aaaa"
                value={values.birthdate}
                onChangeText={onChange('birthdate')}
                onBlur={onBlur('birthdate')}
                error={touched.birthdate && errors.birthdate}
              />

              <Field
                label="Chip *"
                placeholder="15 dígitos del número del chip"
                value={values.chip}
                onChangeText={onChange('chip')}
                onBlur={onBlur('chip')}
                error={touched.chip && errors.chip}
                keyboardType="numeric"
                maxLength={15}
              />
              <Field
                label="Observaciones"
                placeholder="Apunta lo que quieras aquí (opcional)"
                value={values.notes}
                onChangeText={onChange('notes')}
                onBlur={onBlur('notes')}
                multiline
                numberOfLines={4}
                style={{ height: 110, textAlignVertical: 'top' }}
              />
              <TouchableOpacity
                style={styles.checkRow}
                activeOpacity={0.7}
                onPress={() => {
                  setValues((s) => ({ ...s, consent: !s.consent }));
                  setTouched((t) => ({ ...t, consent: true })); // opcional: marcarlo al tocar
                }}
              >
                <View
                  style={[styles.checkbox, values.consent && styles.checkboxOn]}
                >
                  {values.consent && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={styles.checkText}>
                  Autorizo el uso y cesión de los datos de mi mascota según la
                  política de privacidad. *
                </Text>
              </TouchableOpacity>

              {touched.consent && errors.consent && (
                <Text style={styles.errorSmall}>{errors.consent}</Text>
              )}

              <TouchableOpacity
                style={[
                  styles.cta,
                  (!values.consent || submitting) && { opacity: 0.5 },
                ]}
                onPress={submit}
                disabled={!values.consent || submitting}
              >
                <Text style={styles.ctaText}>
                  {isEdit ? 'Guardar cambios' : 'Crear mascota'}
                </Text>
              </TouchableOpacity>

              <View style={{ height: 24 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>

        {/* Select especie */}
        <OptionsModal
          visible={selectOpen === 'species'}
          title="Selecciona especie"
          options={SPECIES}
          onClose={() => setSelectOpen(null)}
          onSelect={(val) => {
            setValues((s) => ({ ...s, species: val }));
            setSelectOpen(null);
          }}
        />
        <Modal
          visible={photoModal}
          transparent
          animationType="fade"
          onRequestClose={() => setPhotoModal(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setPhotoModal(false)}
          >
            <View style={styles.photoCard}>
              <View style={styles.photoHeaderIcon}>
                <Ionicons name="image-outline" size={28} color="#FA8081" />
              </View>
              <Text style={styles.photoTitle}>Cambiar foto</Text>

              <TouchableOpacity
                style={styles.photoPrimary}
                onPress={openCameraAsync}
              >
                <Text style={styles.photoPrimaryText}>Tomar foto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.photoSecondary}
                onPress={openLibraryAsync}
              >
                <Text style={styles.photoSecondaryText}>
                  Subir desde la galería
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

/* ---------- UI helpers ---------- */

function Field({ label, error, style, ...inputProps }) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        placeholderTextColor="#B9B9B9"
        style={[
          styles.input,
          !!error && styles.inputError,
          inputProps.multiline && { paddingTop: 12 },
        ]}
      />
      {!!error && <Text style={styles.errorSmall}>{error}</Text>}
    </View>
  );
}

function Select({ label, value, placeholder, onPress, error, style }) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.input, styles.select, !!error && styles.inputError]}
        onPress={onPress}
      >
        <Text style={[styles.selectText, !value && { color: '#B9B9B9' }]}>
          {value || placeholder}
        </Text>
        <Text style={styles.caret}>▾</Text>
      </TouchableOpacity>
      {!!error && <Text style={styles.errorSmall}>{error}</Text>}
    </View>
  );
}

function OptionsModal({ visible, title, options, onClose, onSelect }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.modalItem}
              onPress={() => onSelect(opt)}
            >
              <Text style={styles.modalItemText}>{opt}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.modalItem, { marginTop: 8 }]}
            onPress={onClose}
          >
            <Text style={[styles.modalItemText, { color: COLORS.sub }]}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxOn: {
    backgroundColor: COLORS.cta,
    borderColor: COLORS.cta,
  },
  checkMark: { color: '#fff', fontWeight: '900', fontSize: 12 },
  checkText: { flex: 1, color: COLORS.sub, fontSize: 12, lineHeight: 16 },
  header: {
    backgroundColor: COLORS.header,
    paddingTop: Platform.select({ ios: 56, android: 24 }),
    paddingBottom: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 4 },
  backTxt: { color: '#fff', fontWeight: '600', fontSize: 14 },
  title: { color: '#fff', fontSize: 20, fontWeight: '900' },

  avatar: {
    alignSelf: 'center',
    marginTop: 18,
    marginBottom: 8,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFD0CA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: { width: '100%', height: '100%', borderRadius: 60 },
  camBtn: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 34,
    height: 34,
    borderRadius: 18,
    backgroundColor: COLORS.cta,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  container: {
    flex: 1,
    borderTopRightRadius: 40,
    marginTop: 0,
    overflow: 'hidden',
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFF8F4',
    borderTopRightRadius: 40,
  },
  card: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },

  field: { marginBottom: 14 },
  label: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  inputError: { borderColor: COLORS.danger },

  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: { fontSize: 16, color: COLORS.text },
  caret: { fontSize: 16, color: '#9B9B9B' },

  cta: {
    marginTop: 16,
    backgroundColor: COLORS.cta,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  errorSmall: { color: COLORS.danger, fontSize: 12, marginTop: 6 },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  photoCard: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },

  photoHeaderIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  photoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FA8081',
    marginTop: 4,
  },

  photoPrimary: {
    alignSelf: 'stretch',
    backgroundColor: '#FA8081',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  photoPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  photoSecondary: {
    alignSelf: 'stretch',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EADAD6',
  },
  photoSecondaryText: { color: '#3A3A3A', fontWeight: '600', fontSize: 16 },

  modalCard: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    margin: 8,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
  },
  modalItemText: { fontSize: 16, color: COLORS.text, textAlign: 'center' },
});
