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
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from '../Utils/LinearGradient';
import * as ImagePicker from 'expo-image-picker';
import { usePets } from '../../contexts/PetContext';
import { validatePetForm } from '../../utils/validation';
import ConfirmationModal from '../Modal/ConfirmationModal';
import {
  SPECIES_OPTIONS,
  THEME_COLORS,
  IMAGE_PICKER_CONFIG,
  PERMISSION_MESSAGES,
} from '../../constants/formConstants';

export default function NewPetFormScreen({ navigation, route }) {
  const pet = route?.params?.pet || null;
  const isEdit = !!pet;
  const { addPet, updatePet, deletePet } = usePets();

  console.log('NewPetFormScreen - pet:', pet);
  console.log('NewPetFormScreen - isEdit:', isEdit);
  console.log('NewPetFormScreen - pet.id:', pet?.id);

  // Capturar el ID del pet al inicio para evitar problemas de scope
  const petId = pet?.id;

  const [values, setValues] = useState({
    photoUri: pet?.photoUri || '',
    name: pet?.name || '',
    species: pet?.species || '',
    breed: pet?.breed || '',
    birthdate: pet?.birthdate || '', // dd/mm/aaaa
    gender: pet?.gender || '',
    weight: pet?.weight || '',
    chip: pet?.chip || '',
    notes: pet?.notes || '',
    consent: !!pet?.consent,
  });
  const [touched, setTouched] = useState({});
  const [selectOpen, setSelectOpen] = useState(null); // 'species' | null
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const onChange = (k) => (text) => setValues((s) => ({ ...s, [k]: text }));
  const onBlur = (k) => () => setTouched((s) => ({ ...s, [k]: true }));

  const validationResult = useMemo(() => validatePetForm(values), [values]);
  const errors = validationResult.errors;

  const handleDeletePetFromEdit = () => {
    if (!petId) {
      Alert.alert(
        'Error',
        'No se puede eliminar: información de mascota no válida.'
      );
      return;
    }
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteModalVisible(false);
    try {
      // Usar directamente la función del contexto
      await deletePet(petId);
      // Navegar de vuelta al Home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.error('Error deleting pet:', error);
      Alert.alert(
        'Error',
        'No se pudo eliminar la mascota. Inténtalo de nuevo.'
      );
    }
  };

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
      gender: true,
      weight: true,
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
        gender: values.gender,
        weight: values.weight,
        chip: values.chip,
        notes: values.notes,
        photoUri: values.photoUri,
      };

      if (isEdit) {
        await updatePet(pet.id, payload);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        setTimeout(() => {
          Alert.alert(
            '¡Guardado!',
            'Los cambios se han actualizado correctamente.'
          );
        }, 500);
      } else {
        await addPet(payload);

        // Navegación inmediata sin alert para mejor UX
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });

        // Mostrar mensaje de éxito después de navegar
        setTimeout(() => {
          Alert.alert('¡Mascota creada!', 'Guardamos los datos correctamente.');
        }, 500);
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
        PERMISSION_MESSAGES.CAMERA_REQUIRED.title,
        PERMISSION_MESSAGES.CAMERA_REQUIRED.message
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      ...IMAGE_PICKER_CONFIG,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        PERMISSION_MESSAGES.LIBRARY_REQUIRED.title,
        PERMISSION_MESSAGES.LIBRARY_REQUIRED.message
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      ...IMAGE_PICKER_CONFIG,
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
        <StatusBar
          backgroundColor={THEME_COLORS.PRIMARY_PINK}
          barStyle="dark-content"
        />

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

              <View style={styles.fieldContainerRow}>
                <Field
                  label="Raza *"
                  placeholder="Indique raza específica"
                  value={values.breed}
                  onChangeText={onChange('breed')}
                  onBlur={onBlur('breed')}
                  error={touched.breed && errors.breed}
                  style={styles.fieldRow}
                />

                <Field
                  label="Fecha de nacimiento *"
                  placeholder="dd/mm/aaaa"
                  value={values.birthdate}
                  onChangeText={onChange('birthdate')}
                  onBlur={onBlur('birthdate')}
                  error={touched.birthdate && errors.birthdate}
                  style={styles.fieldRow}
                />
              </View>

              <View style={styles.fieldContainerRow}>
                <Select
                  label="Género *"
                  placeholder="Macho o hembra"
                  value={values.gender}
                  error={touched.gender && errors.gender}
                  onPress={() => setSelectOpen('gender')}
                  style={styles.fieldRow}
                />
                <Field
                  label="Peso *"
                  placeholder="Peso en kg (ej: 15.5)"
                  value={values.weight}
                  onChangeText={(text) => {
                    // Permitir solo números y punto decimal
                    const filtered = text.replace(/[^0-9.]/g, '');
                    // Evitar múltiples puntos
                    const parts = filtered.split('.');
                    const formatted =
                      parts.length > 2
                        ? parts[0] + '.' + parts.slice(1).join('')
                        : filtered;
                    onChange('weight')(formatted);
                  }}
                  onBlur={onBlur('weight')}
                  error={touched.weight && errors.weight}
                  keyboardType="decimal-pad"
                  style={styles.fieldRow}
                />
              </View>

              <Field
                label="Chip *"
                placeholder="15 dígitos del número del chip"
                value={values.chip}
                onChangeText={onChange('chip')}
                onBlur={onBlur('chip')}
                error={touched.chip && errors.chip}
                keyboardType="numeric"
                maxLength={15}
                editable={!isEdit}
              />
              {isEdit && (
                <Text style={styles.chipMessage}>
                  Este campo no es editable. Si los datos del chip son
                  incorrectos, consulta con tu veterinaria o Borra y crea un
                  nuevo perfil.
                </Text>
              )}
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

              <View style={styles.buttonContainer}>
                {isEdit && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeletePetFromEdit}
                  >
                    <Ionicons name="trash-outline" size={24} color="#693636" />
                    <Text style={styles.deleteButtonText}>Eliminar perfil</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.cta,
                    !isEdit &&
                      (!values.consent || submitting) &&
                      styles.ctaDisabled,
                  ]}
                  onPress={submit}
                  disabled={!isEdit && (!values.consent || submitting)}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFF8F4" />
                  ) : (
                    <Text style={styles.ctaText}>
                      {isEdit ? 'Guardar datos' : 'Crear mascota'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={{ height: 24 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>

        {/* Select especie */}
        <OptionsModal
          visible={selectOpen === 'species'}
          title="Selecciona especie"
          options={SPECIES_OPTIONS}
          onClose={() => setSelectOpen(null)}
          onSelect={(val) => {
            setValues((s) => ({ ...s, species: val }));
            setSelectOpen(null);
          }}
        />

        {/* Select género */}
        <OptionsModal
          visible={selectOpen === 'gender'}
          title="Selecciona género"
          options={['Macho', 'Hembra']}
          onClose={() => setSelectOpen(null)}
          onSelect={(val) => {
            setValues((s) => ({ ...s, gender: val }));
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

        {/* Modal de confirmación para eliminar */}
        <ConfirmationModal
          visible={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={handleConfirmDelete}
          title="¿Eliminar mascota?"
          message="Estas a punto de eliminar todos los datos de este perfil. Este cambio"
          messageHighlight="es irreversible"
          messageContinuation="."
          confirmText="Eliminar"
          cancelText="Cancelar"
          confirmVariant="danger"
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

/* ---------- UI helpers ---------- */

function Field({ label, error, style, editable = true, ...inputProps }) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        editable={editable}
        placeholderTextColor="#B9B9B9"
        style={[
          styles.input,
          !!error && styles.inputError,
          !editable && styles.inputDisabled,
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
        <Ionicons name="chevron-down" size={20} color="#9B9B9B" />
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
            <Text
              style={[
                styles.modalItemText,
                { color: THEME_COLORS.TEXT_SECONDARY },
              ]}
            >
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
    borderColor: THEME_COLORS.BORDER_DEFAULT,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxOn: {
    backgroundColor: THEME_COLORS.CTA_BUTTON,
    borderColor: THEME_COLORS.CTA_BUTTON,
  },
  checkMark: { color: '#fff', fontWeight: '900', fontSize: 12 },
  checkText: {
    flex: 1,
    color: THEME_COLORS.TEXT_SECONDARY,
    fontSize: 12,
    lineHeight: 16,
  },
  header: {
    backgroundColor: THEME_COLORS.PRIMARY_PINK,
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
    backgroundColor: THEME_COLORS.CTA_BUTTON,
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
    backgroundColor: THEME_COLORS.FORM_BACKGROUND,
    borderTopRightRadius: 40,
  },
  card: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },

  field: { marginBottom: 14 },
  fieldContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  fieldRow: {
    flex: 1,
  },
  label: {
    color: THEME_COLORS.TEXT_PRIMARY,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    backgroundColor: THEME_COLORS.INPUT_BACKGROUND,
    borderWidth: 1,
    borderColor: THEME_COLORS.BORDER_DEFAULT,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: THEME_COLORS.TEXT_PRIMARY,
  },
  inputError: { borderColor: THEME_COLORS.BORDER_ERROR },
  inputDisabled: {
    backgroundColor: '#F8F9FA',
    color: '#6C757D',
    opacity: 0.7,
  },

  chipMessage: {
    color: THEME_COLORS.TEXT_SECONDARY,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 14,
    fontStyle: 'italic',
    lineHeight: 16,
  },

  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: { fontSize: 16, color: THEME_COLORS.TEXT_PRIMARY },

  buttonContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },

  deleteButton: {
    alignSelf: 'stretch',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'transparent',
  },
  deleteButtonText: {
    textAlign: 'center',
    color: '#3D3D3D',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 25.6,
  },

  cta: {
    alignSelf: 'stretch',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: THEME_COLORS.CTA_BUTTON,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    minHeight: 48,
  },
  ctaDisabled: {
    backgroundColor: '#E2E8F0',
    opacity: 0.6,
  },
  ctaText: {
    textAlign: 'center',
    color: '#FFF8F4',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 25.6,
  },

  errorSmall: { color: THEME_COLORS.BORDER_ERROR, fontSize: 12, marginTop: 6 },

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
    borderColor: THEME_COLORS.BORDER_DEFAULT,
    marginTop: 8,
  },
  modalItemText: {
    fontSize: 16,
    color: THEME_COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
});
