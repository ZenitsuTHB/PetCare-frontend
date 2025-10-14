import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomToggle from '../Toggle/CustomToggle';

const PALETTE = {
  primary: '#FA8081',
  text: '#693636',
  muted: '#62748E',
  secondary: '#000000',

  vetBg: '#F5FCE9',
  vetBr: '#A8B88B',

  bonBg: '#FFEADD',
  bonBr: '#FFBA92',

  userBg: '#FDD8D8',
  userBr: '#FA8081',
};

const variants = {
  vet: {
    bg: PALETTE.vetBg,
    br: PALETTE.vetBr,
    icon: 'information-circle-outline',
    editable: false,
  },
  bonvet: {
    bg: PALETTE.bonBg,
    br: PALETTE.bonBr,
    icon: 'alert-outline',
    editable: false,
  },
  user: {
    bg: PALETTE.userBg,
    br: PALETTE.userBr,
    icon: 'alert-circle-outline',
    editable: true,
  },
};

function NotificationCard({
  title,
  description,
  dateText,
  timeText,
  variant = 'vet', // 'vet' | 'bonvet' | 'user'
  toggleValue = false,
  onToggle = () => {},
  onClose = () => {},
  onEdit = () => {},
  leftIconName, // opcional
  testID = 'notification-card',
}) {
  const v = variants[variant] ?? variants.vet;
  const leftIcon = leftIconName || v.icon;

  return (
    <View
      style={[styles.card, { backgroundColor: v.bg, borderColor: v.br }]}
      testID={testID}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={[styles.iconWrap]}>
            <Ionicons name={leftIcon} size={28} color="#000000" />
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.actions}>
          {v.editable && (
            <>
              <TouchableOpacity
                onPress={onEdit}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Editar recordatorio"
              ></TouchableOpacity>

              {/* Toggle rojo con borde = borde de la card */}
              <CustomToggle
                value={toggleValue}
                onChange={onToggle}
                trackOn={PALETTE.primary}
                trackOff="#FFFFFF"
                borderColor={v.br}
                testID={`${testID}-toggle`}
              />
            </>
          )}

          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Eliminar notificación"
          >
            <Ionicons name="close" size={28} color="#693636" />
          </TouchableOpacity>
        </View>
      </View>

      {!!description && <Text style={styles.description}>{description}</Text>}

      <View style={styles.meta}>
        {!!dateText && <Text style={styles.metaText}>{dateText}</Text>}
        {!!timeText && <Text style={styles.metaText}>{timeText}</Text>}
      </View>
    </View>
  );
}

export default memo(NotificationCard);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: PALETTE.text,
    fontSize: 20,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  description: {
    color: PALETTE.secondary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 400,
  },
  meta: {
    gap: 2,
  },
  metaText: {
    color: PALETTE.secondary,
    fontSize: 14,
    fontWeight: 400,
  },
});
