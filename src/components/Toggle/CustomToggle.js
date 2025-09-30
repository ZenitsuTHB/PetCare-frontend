import React, { useMemo, useRef, useEffect } from 'react';
import { Pressable, View, StyleSheet, Animated } from 'react-native';

// Toggle 44x28 aprox, con borde personalizable.
// thumb animado y accesibilidad.
export default function CustomToggle({
  value = false,
  onChange = () => {},
  trackOn = '#FA8081', // rojo de diseño
  trackOff = '#FFFFFF',
  borderColor = '#FFD5C2', // por defecto, igual al de las cards "naranja"
  disabled = false,
  testID,
}) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 160,
      useNativeDriver: true,
    }).start();
  }, [value, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 18], // recorre dentro del track
  });

  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [trackOff, trackOn],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      onPress={() => !disabled && onChange(!value)}
      style={[styles.wrap, { borderColor }]}
      testID={testID}
    >
      <Animated.View style={[styles.track, { backgroundColor: bgColor }]} />
      <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 44,
    height: 28,
    borderWidth: 1, // ← borde visible igual al de la card
    borderRadius: 16,
    padding: 1,
    justifyContent: 'center',
  },
  track: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1.5,
  },
});
