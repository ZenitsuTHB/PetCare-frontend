import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PageHeader = ({ 
  title, 
  subtitle, 
  titleStyle, 
  subtitleStyle, 
  containerStyle 
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {title && (
        <Text style={[styles.title, titleStyle]}>
          {title}
        </Text>
      )}
      
      {subtitle && (
        <Text style={[styles.subtitle, subtitleStyle]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

export default PageHeader;

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    color: '#FA8081',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 28.8,
    marginBottom: 8,
  },
  subtitle: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 25.6,
  },
});