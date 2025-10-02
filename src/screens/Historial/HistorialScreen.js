// src/screens/Historial/HistorialScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { THEME_COLORS } from '../../constants/formConstants';
import { BackButton, QRModal } from '../../components';
import ContentContainer from '../../components/ContentContainer/ContentContainer';
import ConsultationCard from '../../components/Cards/ConsultationCard';
import PetDetailsFooter from '../../components/Footers/PetDetailsFooter';

export default function HistorialScreen({ route, navigation }) {
  const { petName, pet } = route.params; // 👈 llega el nombre y objeto pet desde HomeScreen
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('historial'); // Tab activo por defecto

  // Datos hardcodeados para probar la ConsultationCard
  const hasConsultations = true; // Cambiar a false para ver empty state
  const consultations = [
    {
      id: 1,
      title: 'Consulta de rutina',
      description: 'Revisión general, vacunación antirrábica y desparasitación. Todo en perfecto estado.',
      date: '15/09/2025'
    },
    {
      id: 2,
      title: 'Control post-cirugía',
      description: 'Revisión de sutura tras esterilización. Cicatrización correcta, sin complicaciones.',
      date: '28/08/2025'
    }
  ];

  const handleArchivosPress = () => {
    console.log('Archivos pressed');
    setActiveTab('archivos');
    // TODO: Implementar navegación a archivos o mostrar contenido de archivos
  };

  const handleQRPress = () => {
    console.log('QR pressed in HistorialScreen');
    setActiveTab('qr');
    setQrModalVisible(true);
    console.log('qrModalVisible set to true in HistorialScreen');
  };

  const handleHistorialPress = () => {
    console.log('Historial pressed');
    setActiveTab('historial');
    // Ya estamos en historial, podrías agregar alguna animación o efecto
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

          {/* Content Container with Header and Conditional Content */}
          <ContentContainer
            title="Historial médico"
            subtitle="Consulta los diagnósticos que constan en tu história clínica."
            showEmptyState={!hasConsultations}
            emptyStateProps={emptyStateProps}
          >
            {hasConsultations && (
              <ScrollView 
                style={styles.consultationsContainer}
                showsVerticalScrollIndicator={false}
              >
                {consultations.map((consultation) => (
                  <ConsultationCard
                    key={consultation.id}
                    title={consultation.title}
                    description={consultation.description}
                    date={consultation.date}
                  />
                ))}
              </ScrollView>
            )}
          </ContentContainer>
        </View>

        {/* PetDetailsFooter con tabs interactivos */}
        <PetDetailsFooter
          activeTab={activeTab}
          onArchivosPress={handleArchivosPress}
          onQRPress={handleQRPress}
          onHistorialPress={handleHistorialPress}
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
  consultationsContainer: {
    flex: 1,
    paddingTop: 8,
  },
});
