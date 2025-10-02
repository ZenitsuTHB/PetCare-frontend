// src/screens/ProfileScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../../components/Footers/Footer';

const COLORS = {
  bg: '#FFF8F4',
  card: '#FFFFFF',
  primary: '#FA8081',
  text: '#121212',
  progressTrack: '#FFE3D7',
  progressFill: '#FFB089',
  edit: '#4E3A2F',
};

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const storageUsed = 0.65; // mock UI

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.bg} barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <Text style={styles.greeting}>¡Hola [nombre]!</Text>

      {/* Avatar + editar */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatarRing}>
          {/* Reemplaza por tu imagen */}
          <Image
            style={styles.avatar}
            source={{
              uri: 'https://dummyimage.com/200x200/ffffff/cccccc.png&text=',
            }}
          />
        </View>
        <TouchableOpacity style={styles.editBtn} activeOpacity={0.85}>
          <Ionicons name="create-outline" size={18} color={COLORS.card} />
        </TouchableOpacity>
      </View>

      {/* Espacio disponible */}
      <View style={styles.storageWrap}>
        <Text style={styles.spaceLabel}>Espacio disponible:</Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.round(storageUsed * 100)}%` },
            ]}
          />
        </View>
      </View>

      {/* Botones grandes (todos estilo Ajustes) */}
      <View style={styles.listWrap}>
        <ActionButton label="Ajustes" icon="settings-outline" />
        <ActionButton label="Newsletter" icon="file-tray-outline" />
        <ActionButton label="Faqs" icon="help-outline" />
        <ActionButton label="Contacto" icon="chatbubble-outline" />
      </View>

      <Footer
        activeTab="profile"
        onPetsPress={() => navigation.navigate('Home')}
        onNotificationsPress={() => navigation.navigate('Notifications')}
        onProfilePress={() => {}}
      />
    </View>
  );
};

export default ProfileScreen;

/* ---------- Botón (estilo Ajustes para todos) ---------- */
const ActionButton = ({ label, icon }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      style={[styles.actionBtn, styles.actionBtnPrimary]}
    >
      <View style={styles.actionContent}>
        <Ionicons
          name={icon}
          size={20}
          color="#FFFFFF"
          style={{ marginRight: 10 }}
        />
        <Text style={[styles.actionText, styles.actionTextPrimary]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

/* ---------- Estilos ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingVertical: 12, // alinea el footer con otras screens
  },

  header: { alignItems: 'flex-start', paddingBottom: 50 },
  headerTitle: { color: COLORS.primary, fontSize: 24, fontWeight: '900' },

  greeting: {
    textAlign: 'center',
    color: '#3B3B3B',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
  },

  avatarWrap: {
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing: {
    padding: 10,
    borderRadius: 999,
    backgroundColor: COLORS.card,
    borderWidth: 3,
    borderColor: COLORS.primary,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: '#F2F2F2',
  },
  editBtn: {
    position: 'absolute',
    right: -2,
    bottom: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.edit,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  /* Espacio disponible a la izquierda y barra más ancha */
  storageWrap: {
    alignSelf: 'center',
    width: '90%', // más ancho
    marginTop: 18,
  },
  spaceLabel: {
    textAlign: 'left',
    paddingLeft: 40, // pequeño padding-left
    color: '#3B3B3B',
    fontSize: 12,
    fontWeight: '700', // negrita
    marginBottom: 6,
  },
  progressTrack: {
    width: '100%',
    height: 40, // un poco más alta
    backgroundColor: COLORS.progressTrack,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F8D3C8',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.progressFill,
    borderRadius: 999,
  },

  /* Botones grandes ocupando la sección vacía */
  listWrap: {
    marginTop: 'auto', // empuja hacia abajo
    paddingBottom: 20,
    gap: 14,
  },
  actionBtn: {
    borderRadius: 16,
    paddingVertical: 18, // más alto
    paddingHorizontal: 18,
    minHeight: 60, // tamaño grande
  },
  actionBtnPrimary: { backgroundColor: COLORS.primary },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // icono + texto centrados
  },
  actionText: { fontSize: 16 },
  actionTextPrimary: { color: '#FFFFFF', fontWeight: '700' },
});
