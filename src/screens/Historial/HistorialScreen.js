// src/screens/Historial/HistorialScreen.js
import React, { useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { THEME_COLORS } from '../../constants/formConstants';
import { PageFooter, BackButton, QRModal } from '../../components';
import ContentContainer from '../../components/ContentContainer/ContentContainer';

export default function HistorialScreen({ route, navigation }) {
  const { petName, pet } = route.params; // 👈 llega el nombre y objeto pet desde HomeScreen
  const [qrModalVisible, setQrModalVisible] = useState(false);

  const handleArchivosPress = () => {
    console.log('Archivos pressed');
    // TODO: Implementar navegación a archivos
  };

  const handleQRPress = () => {
    console.log('QR pressed');
    setQrModalVisible(true);
  };

  const handleHistorialPress = () => {
    console.log('Historial pressed');
    // Ya estamos en historial
  };

  // Configuración del empty state
  const emptyStateProps = {
    image: require('../../assets/images/tomyjery.png'),
    title: '¡Todo limpio!',
    description: `Pronto aquí vivirá la historia médica de ${petName}.`,
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFF8F4" barStyle="dark-content" />

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.contentWrapper}>
          {/* Back Button */}
          <BackButton
            text="Volver al perfil"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />

          {/* Content Container with Header and Empty State */}
          <ContentContainer
            title="Historial médico"
            subtitle="Consulta los diagnósticos que constan en tu história clínica."
            showEmptyState={true} // Por ahora siempre mostramos empty state
            emptyStateProps={emptyStateProps}
          >
            {/* Aquí iría el contenido del historial cuando exista */}
          </ContentContainer>
        </View>

        {/* Page Footer */}
        <PageFooter
          activeTab="historial"
          onArchivosPress={handleArchivosPress}
          onQRPress={handleQRPress}
          onHistorialPress={handleHistorialPress}
          showProfileIcon={true}
        />
      </View>

      {/* QR Modal */}
      <QRModal
        visible={qrModalVisible}
        onClose={() => setQrModalVisible(false)}
        petName={petName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F4',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
});
