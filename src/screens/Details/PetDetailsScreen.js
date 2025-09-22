// src/screens/PetDetailsScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const COLORS = {
  bg: '#FFF8F4',
  header: '#FB999A',
  primary: '#FA8081',
  text: '#121212',
  label: '#9F4D4E',
  muted: '#62748E',
  card: '#FFF',
  line: '#E2E8F0',
};

const PetDetailsScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const pet = route?.params?.pet ?? {
    name: 'Michi',
    species: 'Gato',
    breed: 'Común',
    birthdate: '11/07/2020',
    gender: 'Hembra',
    weight: '23',
    chip: '981100002343567',
    notes: 'Le gusta mucho el salmón.',
    avatar:
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop',
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* HEADER grande con avatar dentro */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => navigation?.goBack?.()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color="#FFF" />
          <Text style={styles.backText}>Atrás</Text>
        </TouchableOpacity>

        {/* Avatar centrado que “asoma” sobre el siguiente panel */}
        <View style={styles.headerAvatarWrap}>
          <Image source={{ uri: pet.avatar }} style={styles.avatar} />
          <View style={styles.avatarBorder} />
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation?.navigate?.('EditPet', { pet })}
            activeOpacity={0.8}
          >
            <MaterialIcons name="edit" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        {/* Nombre */}
        <Text style={styles.name}>{pet.name}</Text>

        {/* Ficha */}
        <View style={styles.card}>
          {/* Especie / Raza */}
          <View style={styles.rowWrap}>
            <Row label="Especie" value={pet.species} />
            <Row label="Raza" value={pet.breed} right />
          </View>
          <Divider />

          {/* Fecha de nacimiento (fila completa) */}
          <Row label="Fecha de nacimiento" value={pet.birthdate} full />
          <Divider />

          {/* Género / Peso */}
          <View style={styles.rowWrap}>
            <Row label="Género" value={pet.gender} />
            <Row label="Peso (kg)" value={String(pet.weight)} right />
          </View>
          <Divider />

          {/* Chip (fila completa) */}
          <Row label="Chip" value={pet.chip} full />
          <Divider />

          <View style={{ marginTop: 6 }}>
            <Text style={styles.labelRed}>Observaciones</Text>
            <Text style={styles.value}>{pet.notes}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom ? insets.bottom - 6 : 10 },
        ]}
      >
        <TouchableOpacity
          style={styles.barItem}
          onPress={() => navigation?.navigate?.('PetFiles', { pet })}
          activeOpacity={0.8}
        >
          <Ionicons name="folder-open-outline" size={22} />
          <Text style={styles.barLabel}>Archivos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation?.navigate?.('PetQR', { pet })}
          activeOpacity={0.85}
        >
          <Ionicons name="qr-code-outline" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.fabText}>Generar QR</Text>

        <TouchableOpacity
          style={styles.barItem}
          onPress={() => navigation?.navigate?.('PetHistory', { pet })}
          activeOpacity={0.8}
        >
          <Ionicons name="time-outline" size={22} />
          <Text style={styles.barLabel}>Historial</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PetDetailsScreen;

/* ---------- Aux ---------- */
const Row = ({ label, value, right, full, empty }) => {
  const container = [
    styles.row,
    right && { paddingLeft: 18 },
    full && { paddingRight: 0, paddingLeft: 0 },
  ];
  return (
    <View style={full ? styles.rowFull : container}>
      {!!label && (
        <Text
          style={[styles.label, label === 'Chip' && { color: COLORS.label }]}
        >
          {label}
        </Text>
      )}
      {!empty && <Text style={styles.value}>{value}</Text>}
    </View>
  );
};
const Divider = () => <View style={styles.divider} />;

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    backgroundColor: COLORS.header,
    paddingHorizontal: 16,
    paddingBottom: 72, // ← más alto para dejar espacio al avatar
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  backRow: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#FFF', fontSize: 16, fontWeight: '600', marginLeft: 4 },

  // avatar ahora vive EN el header
  headerAvatarWrap: {
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: -58, // ← hace que “asome” sobre la sección inferior
  },
  avatar: {
    width: 116,
    height: 116,
    borderRadius: 999,
    backgroundColor: '#FFD0CA',
  },
  avatarBorder: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  editBtn: {
    position: 'absolute',
    right: -2,
    bottom: 8,
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  scroll: { flex: 1 },

  name: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 6,
    marginTop: 20,
  },

  card: { backgroundColor: COLORS.bg, paddingHorizontal: 24 },

  row: {
    flexDirection: 'column',
    width: '48%',
    paddingRight: 18,
    marginBottom: 10,
  },
  rowWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowFull: { width: '100%', marginTop: 2 },

  label: { fontSize: 13, color: COLORS.muted, marginBottom: 4 },
  labelRed: {
    fontSize: 13,
    color: COLORS.primary,
    marginBottom: 6,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.line,
    marginVertical: 8,
    width: '100%',
  },

  bottomBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 14,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingTop: 10,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  barItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    width: 92,
  },
  barLabel: { fontSize: 12, color: COLORS.text },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    top: -26,
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 8,
    fontSize: 12,
    color: COLORS.text,
  },
});
