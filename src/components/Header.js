import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Header = ({
  title,
  subtitle,
  showBackButton = false,
  backButtonText = "← Back",
  onBackPress,
  backgroundColor = '#FB999A',
}) => {
  return (
    <View style={[styles.headerSection, { backgroundColor }]}>

      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Text style={styles.backButtonText}>{backButtonText}</Text>
        </TouchableOpacity>
      )}

      {(title || subtitle) && (
        <View style={styles.headerContent}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerSection: {
    backgroundColor: '#FB999A',
    paddingTop: 12,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
  },
  statusBar: {
    height: 24,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  backButton: {
    padding: 12,
    marginLeft: 4,
    borderRadius: 18,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerContent: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  title: {
    color: '#FFF2F2',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0.72,
    textShadowColor: '#FA8081',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0,
    marginBottom: 18,
  },
  subtitle: {
    color: '#FFF8F4',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 25.6,
  },
});