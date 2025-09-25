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
import PetDetailsFooter from '../../components/Footers/PetDetailsFooter';

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
        </View>
      </View>

      <View style={styles.detailsContainer}>
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
            <Divider />
          </View>
        </ScrollView>

        <PetDetailsFooter
          onArchivosPress={() => navigation.navigate('PetFiles', { pet })}
          onQRPress={() => navigation.navigate('PetQR', { pet })}
          onHistorialPress={() => navigation.navigate('PetHistory', { pet })}
        />
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
      {!!label && <Text style={styles.label}>{label}</Text>}
      {!empty && <Text style={styles.value}>{value}</Text>}
    </View>
  );
};

const Divider = () => <View style={styles.divider} />;

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.header },

  detailsContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 60,
    marginTop: -70,
    zIndex: -1,
  },

  header: {
    paddingHorizontal: 16,
  },
  backRow: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#FFF', fontSize: 16, fontWeight: '600', marginLeft: 4 },

  headerAvatarWrap: {
    marginTop: 50,
    alignSelf: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
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
    borderWidth: 4,
    borderColor: COLORS.header,
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
    marginBottom: 20,
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

  // ← labels en rojo (como la maqueta)
  label: {
    fontSize: 13,
    color: COLORS.label,
    marginBottom: 4,
    fontWeight: '600',
  },
  labelRed: {
    fontSize: 13,
    color: COLORS.label,
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

  // (el footer real está en PetDetailsFooter)
});
