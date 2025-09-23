import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const PageFooter = ({
  activeTab = 'archivos', // 'archivos', 'qr', 'historial'
  onArchivosPress,
  onQRPress,
  onHistorialPress,
  showProfileIcon = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.footerContent}>
        {/* Profile Icon (Centro elevado) */}
        {showProfileIcon && (
          <View style={styles.profileIconContainer}>
            <View style={styles.profileIcon}>
              <Ionicons name="paw" size={40} color="white" />
            </View>
          </View>
        )}

        {/* Archivos Tab */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 'archivos' && styles.activeTab]}
          onPress={onArchivosPress}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="folder-open"
            size={28}
            color={activeTab === 'archivos' ? '#FA8081' : '#494949'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'archivos' && styles.activeTabText,
            ]}
          >
            Archivos
          </Text>
          {activeTab === 'archivos' && <View style={styles.underline} />}
        </TouchableOpacity>

        {/* Generar QR Tab */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 'qr' && styles.activeTab]}
          onPress={onQRPress}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.tabText, activeTab === 'qr' && styles.activeTabText]}
          >
            Generar QR
          </Text>
          {activeTab === 'qr' && <View style={styles.underline} />}
        </TouchableOpacity>

        {/* Historial Tab */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 'historial' && styles.activeTab]}
          onPress={onHistorialPress}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="history"
            size={28}
            color={activeTab === 'historial' ? '#FA8081' : '#494949'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'historial' && styles.activeTabText,
            ]}
          >
            Historial
          </Text>
          {activeTab === 'historial' && <View style={styles.underline} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PageFooter;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingTop: 30,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 8,
  },
  footerContent: {
    alignSelf: 'stretch',
    paddingTop: 8,
    paddingLeft: 12,
    paddingRight: 12,
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 75, // Ajustado para dar espacio al icono elevado
  },
  profileIconContainer: {
    position: 'absolute',
    top: -30,
    left: '50%',
    marginLeft: -40, // Centro del icono (80/2)
    zIndex: 10,
  },
  profileIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#FA8081',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tab: {
    flex: 1,
    height: 67,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FA8081',
  },
  tabText: {
    color: '#494949',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 21,
    marginTop: 2,
  },
  activeTabText: {
    color: '#FA8081',
    fontWeight: '600',
  },
  underline: {
    position: 'absolute',
    bottom: -2,
    height: 2,
    width: '60%',
    backgroundColor: '#FA8081',
  },
});
