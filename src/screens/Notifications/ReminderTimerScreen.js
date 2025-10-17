// src/screens/Notifications/ReminderTimerScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
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
  timerBg: '#FFE5E5',
};

const ReminderTimerScreen = ({ route, navigation }) => {
  const { notification } = route.params;
  
  // Timer state
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState('Selecciona una frecuencia');
  
  const intervalRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            Alert.alert('¡Tiempo cumplido!', 'El recordatorio ha terminado');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, totalSeconds]);

  // Update display when totalSeconds changes
  useEffect(() => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    setHours(h);
    setMinutes(m);
    setSeconds(s);
  }, [totalSeconds]);

  const startTimer = () => {
    if (totalSeconds > 0) {
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTotalSeconds(0);
  };

  const setCustomTime = (h, m, s) => {
    const total = (h * 3600) + (m * 60) + s;
    setTotalSeconds(total);
  };

  const quickTimers = [
    { label: '5m', seconds: 300 },
    { label: '15m', seconds: 900 },
    { label: '30m', seconds: 1800 },
    { label: '1h', seconds: 3600 },
  ];

  const triggers = [
    'Una vez',
    'Cada día',
    'Cada semana',
    'Cada mes',
    'Los viernes 18 Sept',
  ];

  const formatTime = (time) => time.toString().padStart(2, '0');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor={COLORS.bg} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Recordatorio</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerDisplay}>
            {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
          </Text>
          <Text style={styles.timerLabel}>
            {notification.title}
          </Text>
        </View>

        {/* Custom Time Input */}
        <View style={styles.timeInputContainer}>
          <Text style={styles.sectionTitle}>Establecer tiempo</Text>
          <View style={styles.timeInputRow}>
            <View style={styles.timeInput}>
              <TextInput
                style={styles.timeInputText}
                value={hours.toString()}
                onChangeText={(text) => {
                  const h = parseInt(text) || 0;
                  setCustomTime(h, minutes, seconds);
                }}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.timeInputLabel}>H</Text>
            </View>
            
            <View style={styles.timeInput}>
              <TextInput
                style={styles.timeInputText}
                value={minutes.toString()}
                onChangeText={(text) => {
                  const m = parseInt(text) || 0;
                  setCustomTime(hours, m, seconds);
                }}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.timeInputLabel}>M</Text>
            </View>
            
            <View style={styles.timeInput}>
              <TextInput
                style={styles.timeInputText}
                value={seconds.toString()}
                onChangeText={(text) => {
                  const s = parseInt(text) || 0;
                  setCustomTime(hours, minutes, s);
                }}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.timeInputLabel}>S</Text>
            </View>
          </View>
        </View>

        {/* Quick Timer Buttons */}
        <View style={styles.quickTimersContainer}>
          <Text style={styles.sectionTitle}>Tiempos rápidos</Text>
          <View style={styles.quickTimersRow}>
            {quickTimers.map((timer, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickTimer}
                onPress={() => setTotalSeconds(timer.seconds)}
              >
                <Text style={styles.quickTimerText}>{timer.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trigger Selection */}
        <View style={styles.triggerContainer}>
          <TouchableOpacity style={styles.triggerSelector}>
            <MaterialIcons name="repeat" size={20} color={COLORS.primary} />
            <Text style={styles.triggerText}>{selectedTrigger}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
          
          <View style={styles.triggerOptions}>
            {triggers.map((trigger, index) => (
              <TouchableOpacity
                key={index}
                style={styles.triggerOption}
                onPress={() => setSelectedTrigger(trigger)}
              >
                <Text style={styles.triggerOptionText}>{trigger}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, styles.resetButton]}
            onPress={resetTimer}
          >
            <Text style={styles.resetButtonText}>Eliminar recordatorio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.startButton]}
            onPress={isRunning ? pauseTimer : startTimer}
          >
            <Text style={styles.startButtonText}>
              {isRunning ? 'Pausar' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  cancelButton: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  timerContainer: {
    backgroundColor: COLORS.timerBg,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.primary,
    fontFamily: 'monospace',
  },
  timerLabel: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 8,
    textAlign: 'center',
  },
  timeInputContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  timeInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  timeInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeInputText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    minWidth: 40,
  },
  timeInputLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  quickTimersContainer: {
    marginBottom: 24,
  },
  quickTimersRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickTimer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickTimerText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  triggerContainer: {
    marginBottom: 24,
  },
  triggerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  triggerText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
  },
  triggerOptions: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  triggerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  triggerOptionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  controlsContainer: {
    gap: 12,
  },
  controlButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textLight,
  },
  startButton: {
    backgroundColor: COLORS.primary,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default ReminderTimerScreen;