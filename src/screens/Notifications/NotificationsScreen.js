import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../../components/Footers/Footer';
import PetCard from '../../components/Cards/PetCard';
import NotificationCard from '../../components/Cards/NotificationCard';

const COLORS = {
  bg: '#FFF8F4',
  primary: '#FA8081',
  text: '#121212',
};

const INITIAL_DATA = [
  {
    id: '1',
    title: 'Visita médico',
    dateText: 'Fecha: 12/03/2025',
    timeText: 'Hora: 11:00',
    variant: 'vet', // verde → no editable
  },
  {
    id: '2',
    title: 'Vacuna Tétanos',
    dateText: 'Fecha: 20/05/2025',
    timeText: 'Hora: 09:00',
    variant: 'vet', // verde
  },
  {
    id: '3',
    title: 'Medicación',
    dateText: 'Fecha: 01/02/2025',
    timeText: 'Hora: 08:00',
    variant: 'user', // rosa → editable
    toggle: true,
  },
  {
    id: '4',
    title: 'Consejo de la semana',
    description: 'Descubre consejos sobre salud y bienestar',
    variant: 'bonvet', // naranja → no editable
  },
];

const NotificationsScreen = ({ navigation }) => {
  const [items, setItems] = useState(INITIAL_DATA);

  const handleToggle = (id, next) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, toggle: next } : it))
    );
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor={COLORS.bg} barStyle="dark-content" />

      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          data={items}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.title}>Notificaciones</Text>
              <Text style={styles.subtitle}>Al día, siempre</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={{ marginBottom: 12 }}>
              <NotificationCard
                title={item.title}
                description={item.description}
                dateText={item.dateText}
                timeText={item.timeText}
                variant={item.variant}
                showToggle={!!item.showToggle}
                toggleValue={!!item.toggle}
                onToggle={(val) => handleToggle(item.id, val)}
                onClose={() => handleRemove(item.id)}
              />
            </View>
          )}
        />
      </View>

      {/* CTA + Footer fijo */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.cta}
          onPress={() => console.log('Nuevo recordatorio')}
          accessibilityRole="button"
          accessibilityLabel="Crear nuevo recordatorio"
        >
          <Text style={styles.ctaText}>+ Nuevo recordatorio</Text>
        </TouchableOpacity>

        <Footer
          activeTab="notifications"
          onPetsPress={() => navigation.navigate('Home')}
          onNotificationsPress={() => {}}
          onProfilePress={() => navigation.navigate('Profile')}
        />
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  title: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 4,
    color: COLORS.text,
    fontSize: 14,
  },
  bottomArea: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  cta: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
