import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Background = ({
  children,
  colors = ['#FFF8F4', '#FB999A'], // 🎨 colores por defecto
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
  // locations = [0.5, 0.5], // mitad izquierda un color, mitad derecha otro
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      // locations={locations}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
};

export default Background;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
