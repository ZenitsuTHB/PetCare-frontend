import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ConsultationCard = ({ title, description, date }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.date}>Fecha: {date}</Text>
    </View>
  );
};

export default ConsultationCard;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#FAFEF5',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#CADDA7',
    paddingVertical: 24,
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4E5641',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontWeight: '300',
    color: '#2C2C2C',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FA8081', // Mismo color que el título principal
  },
});