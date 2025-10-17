// src/screens/Notifications/NotificationDetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import BackButton from '../../components/Navigation/BackButton';

const COLORS = {
  bg: '#FFF8F4',
  primary: '#FA8081',
  text: '#121212',
  textLight: '#666',
  border: '#E5E5E5',
};

const NotificationDetailScreen = ({ route, navigation }) => {
  const { notification } = route.params;
  const [isActive, setIsActive] = useState(notification.toggle || false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const getVariantColors = (variant) => {
    switch (variant) {
      case 'vet':
        return { bg: '#F5FCE9', border: '#A8B88B', icon: '#A8B88B' };
      case 'bonvet':
        return { bg: '#FFEADD', border: '#FFBA92', icon: '#FFBA92' };
      case 'user':
        return { bg: '#FDD8D8', border: '#FA8081', icon: '#FA8081' };
      default:
        return { bg: '#F5FCE9', border: '#A8B88B', icon: '#A8B88B' };
    }
  };

  const colors = getVariantColors(notification.variant);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor={COLORS.bg} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Card */}
        <View style={[styles.card, { backgroundColor: colors.bg, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <MaterialIcons 
                name={notification.variant === 'vet' ? 'local-hospital' : 
                      notification.variant === 'bonvet' ? 'info' : 'medication'} 
                size={24} 
                color={colors.icon} 
              />
            </View>
            
            {notification.variant === 'user' && (
              <TouchableOpacity onPress={handleToggle} style={styles.toggle}>
                <View style={[styles.toggleTrack, isActive && styles.toggleTrackActive]}>
                  <View style={[styles.toggleThumb, isActive && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.cardTitle}>{notification.title}</Text>
          
          {notification.dateText && (
            <Text style={styles.cardDate}>{notification.dateText}</Text>
          )}
          
          {notification.timeText && (
            <Text style={styles.cardTime}>{notification.timeText}</Text>
          )}

          {notification.description && (
            <Text style={styles.cardDescription}>{notification.description}</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('ReminderTimer', { notification })}
          >
            <MaterialIcons name="alarm" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>Crear recordatorio</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="edit" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="share" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>Compartir</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Información adicional</Text>
          <Text style={styles.infoText}>
            Esta notificación te ayuda a mantener al día el cuidado de tu mascota. 
            Puedes configurar recordatorios para no olvidar fechas importantes.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggle: {
    padding: 4,
  },
  toggleTrack: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleTrackActive: {
    backgroundColor: COLORS.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  cardTime: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
  },
  actionSection: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginLeft: 12,
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
});

export default NotificationDetailScreen;