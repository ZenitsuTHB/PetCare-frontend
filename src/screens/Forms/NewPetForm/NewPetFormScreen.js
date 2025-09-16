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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from '../../../components/LinearGradient';

const COLORS = {
  header: '#FB999A',
  text: '#121212',
  sub: '#6B6B6B',
  inputBg: '#FFFFFF',
  border: '#EADAD6',
  danger: '#FF6B6B',
  cta: '#FA8081',
};

const initial = {
  name: '',
  species: '',
  breed: '',
  birthdate: '',
  gender: '',
  weight: '',
  chip: '',
  notes: '',
  consent: false,
};

const SPECIES = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];
const GENDERS = ['Macho', 'Hembra'];

export default function NewPetFormScreen({ navigation }) {
  const [v, setV] = useState(initial);
  const [touched, setTouched] = useState({});
  const [selectOpen, setSelectOpen] = useState(null);

  const openSelect = (k) => setSelectOpen(k);
  const closeSelect = () => setSelectOpen(null);
  const onChange = (k) => (text) => setV((s) => ({ ...s, [k]: text }));
  const onBlur = (k) => () => setTouched((s) => ({ ...s, [k]: true }));

  const errors = useMemo(() => {
    const e = {};
    if (!v.name.trim()) e.name = 'Obligatorio';
    if (!v.species.trim()) e.species = 'Obligatorio';
    if (!v.gender.trim()) e.gender = 'Obligatorio';
    if (!v.weight.trim()) e.weight = 'Obligatorio';
    if (v.birthdate && !/^\d{2}\/\d{2}\/\d{4}$/.test(v.birthdate))
      e.birthdate = 'Usa dd/mm/aaaa';
    if (v.weight && isNaN(Number(v.weight.replace(',', '.'))))
      e.weight = 'Numérico';
    if (v.chip && v.chip.length < 5) e.chip = 'Muy corto';
    if (!v.consent) e.consent = 'Requerido';
    return e;
  }, [v]);

  const submit = () => {
    setTouched({
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
      Alert.alert('Revisa los campos', 'Hay datos obligatorios o inválidos.');
      return;
    }
    Alert.alert('¡Mascota creada!', 'Guardamos los datos correctamente.', [
      { text: 'OK', onPress: () => navigation?.goBack?.() },
    ]);
  };

  return (
    <LinearGradient>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor="#FB999A" barStyle="dark-content" />

        {/* Header (rosado) sobre el gradient. SIN fondos extra que tapen el gradiente */}
        <View style={styles.header}>
          <View style={styles.headerBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation?.goBack?.()}
            >
              <Ionicons name="chevron-back" size={22} color="#fff" />
              <Text style={styles.backTxt}>Atrás</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Nueva mascota</Text>
            <View style={{ width: 48 }} />
          </View>

          {/* Avatar (posición normal, no absoluta, para evitar solapes) */}
          <View style={styles.avatar}>
            <Text style={{ fontSize: 44 }}>🐾</Text>
            <TouchableOpacity
              style={styles.camBtn}
              onPress={() =>
                Alert.alert('Imagen', 'Conecta aquí tu selector de imágenes')
              }
            >
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* PANEL inferior con borde superior derecho redondeado (igual que Register) */}
        <View style={styles.container}>
          <KeyboardAvoidingView
            style={styles.formSection}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.card}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Field
                label="Nombre de tu mascota *"
                placeholder="Nombre completo"
                value={v.name}
                onChangeText={onChange('name')}
                onBlur={onBlur('name')}
                error={touched.name && errors.name}
              />

              <Select
                label="Especie *"
                placeholder="Tipo"
                value={v.species}
                error={touched.species && errors.species}
                onPress={() => openSelect('species')}
              />

              <Row>
                <Field
                  style={{ flex: 1, marginRight: 8 }}
                  label="Raza"
                  placeholder="Indique raza específica"
                  value={v.breed}
                  onChangeText={onChange('breed')}
                  onBlur={onBlur('breed')}
                />
                <Field
                  style={{ flex: 1, marginLeft: 8 }}
                  label="Fecha de nacimiento"
                  placeholder="dd/mm/aaaa"
                  value={v.birthdate}
                  onChangeText={onChange('birthdate')}
                  onBlur={onBlur('birthdate')}
                  error={touched.birthdate && errors.birthdate}
                />
              </Row>

              <Row>
                <Select
                  style={{ flex: 1, marginRight: 8 }}
                  label="Género *"
                  placeholder="Macho o hembra"
                  value={v.gender}
                  error={touched.gender && errors.gender}
                  onPress={() => openSelect('gender')}
                />
                <Field
                  style={{ flex: 1, marginLeft: 8 }}
                  label="Peso *"
                  placeholder="Ej. 7.8"
                  keyboardType="numeric"
                  value={v.weight}
                  onChangeText={onChange('weight')}
                  onBlur={onBlur('weight')}
                  error={touched.weight && errors.weight}
                />
              </Row>

              <Field
                label="Chip"
                placeholder="15 dígitos del número del chip"
                value={v.chip}
                onChangeText={onChange('chip')}
                onBlur={onBlur('chip')}
                error={touched.chip && errors.chip}
              />

              <Field
                label="Observaciones"
                placeholder="Apunta lo que quieras aquí"
                value={v.notes}
                onChangeText={onChange('notes')}
                onBlur={onBlur('notes')}
                multiline
                numberOfLines={4}
                style={{ height: 110, textAlignVertical: 'top' }}
              />

              <TouchableOpacity
                style={styles.checkRow}
                activeOpacity={0.8}
                onPress={() => setV((s) => ({ ...s, consent: !s.consent }))}
              >
                <View style={[styles.checkbox, v.consent && styles.checkboxOn]}>
                  {v.consent && (
                    <Text style={{ color: '#fff', fontWeight: '900' }}>✓</Text>
                  )}
                </View>
                <Text style={styles.checkText}>
                  Autorizo el uso y cesión de los datos de mi mascota según la
                  política de privacidad.
                </Text>
              </TouchableOpacity>
              {touched.consent && errors.consent ? (
                <Text style={styles.errorSmall}>{errors.consent}</Text>
              ) : null}

              <TouchableOpacity style={styles.cta} onPress={submit}>
                <Text style={styles.ctaText}>Crear mascota</Text>
              </TouchableOpacity>

              <View style={{ height: 24 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>

        {/* Modales de selección */}
        <OptionsModal
          visible={selectOpen === 'species'}
          title="Selecciona especie"
          options={SPECIES}
          onClose={closeSelect}
          onSelect={(val) => {
            setV((s) => ({ ...s, species: val }));
            closeSelect();
          }}
        />
        <OptionsModal
          visible={selectOpen === 'gender'}
          title="Selecciona género"
          options={GENDERS}
          onClose={closeSelect}
          onSelect={(val) => {
            setV((s) => ({ ...s, gender: val }));
            closeSelect();
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

/* -------------------- UI components -------------------- */

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

function Row({ children }) {
  return <View style={{ flexDirection: 'row' }}>{children}</View>;
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

/* ------------------------- styles ------------------------- */

const styles = StyleSheet.create({
  // Header rosado con curva inferior
  header: {
    backgroundColor: COLORS.header,
    paddingTop: Platform.select({ ios: 56, android: 24 }),
    paddingBottom: 24,
    borderBottomLeftRadius: 40, // curva inferior izquierda
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

  // Avatar centrado bajo el título (sin position absolute para no solapar)
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

  // Panel inferior como en Register
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

  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
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
  checkboxOn: { backgroundColor: COLORS.cta, borderColor: COLORS.cta },
  checkText: { color: COLORS.sub, flex: 1, fontSize: 12, lineHeight: 18 },

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
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
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
