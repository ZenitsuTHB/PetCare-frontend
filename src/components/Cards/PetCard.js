import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import Button from '../Button/Button';
import ConfirmationModal from '../Modal/ConfirmationModal';
import Dropdown from '../Dropdown/Dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PetCard = ({
  petName = 'Aperitivo :)',
  petType = 'Hamster',
  breed = 'Ruso',
  weight = '1 kg',
  chipId = '981100002343567',
  registrationDate = '00/00/0000',
  imageSource,
  onEditPet,
  onDeletePet,
  onShowHistory,
  onShowQR,
  onPress,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const dropdownOptions = [
    {
      label: 'Editar',
      icon: 'edit',
      onPress: onEditPet,
    },
    {
      label: 'Eliminar',
      icon: 'delete',
      danger: true,
      onPress: () => setDeleteModalVisible(true),
    },
  ];

  const handleDropdownSelect = (option) => {
    if (option.onPress) {
      option.onPress();
    }
  };

  const handleConfirmDelete = () => {
    if (onDeletePet) {
      onDeletePet();
    }
  };
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        activeOpacity={0.96}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Abrir perfil de ${petName}`}
      >
        <View style={styles.card}>
          {/* Imagen redonda */}
          <Image
            source={imageSource || require('../../assets/images/hamgster.jpg')}
            style={styles.image}
          />

          {/* Contenido */}
          <View style={styles.content}>
            {/* Título */}
            <View style={styles.headerRow}>
              <Text style={styles.title}>{petName}</Text>
            </View>

            {/* Subtítulo */}
            <Text style={styles.subtitle}>
              {petType} - {breed} - {weight}
            </Text>

            {/* Info extra */}
            <Text style={styles.info}>Chip: {chipId}</Text>
            <Text style={styles.info}>Fecha: {registrationDate}</Text>

            {/* Botones */}
            <View style={styles.buttonRow}>
              <Button
                title="Historial"
                variant="outline"
                size="small"
                onPress={onShowHistory}
                style={styles.historyButton}
              />

              <Button
                title="Mostrar QR"
                variant="secondary"
                size="small"
                onPress={onShowQR}
                style={styles.qrButton}
              />
            </View>
          </View>

          {/* Botón de menú en esquina superior derecha */}
          <View style={styles.menuButtonContainer}>
            <Button
              variant="ghost"
              size="small"
              iconName="more-vert"
              iconPosition="only"
              iconSize={20}
              onPress={() => setDropdownVisible(true)}
              style={styles.menuButton}
            />
          </View>

          {/* Componente Dropdown inline dentro de la card */}
          <Dropdown
            visible={dropdownVisible}
            onClose={() => setDropdownVisible(false)}
            onSelect={handleDropdownSelect}
            options={dropdownOptions}
            position="inline"
            absolutePosition={{
              top: 48,
              right: 16,
            }}
          />
        </View>
      </TouchableOpacity>
      <ConfirmationModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar mascota?"
        message="Estas a punto de eliminar todos los datos de este perfil. Este cambio"
        messageHighlight="es irreversible"
        messageContinuation="."
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmVariant="danger"
        icon="warning"
      />
    </View>
  );
};

export default PetCard;

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    width: '100%',
  },
  card: {
    width: '100%',
    padding: 24,
    backgroundColor: '#FFF8F4',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFBA92',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#FFBA92',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  title: {
    color: '#594133',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 32,
    flex: 1,
  },
  menuButtonContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  menuButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 32,
  },
  subtitle: {
    color: '#2C2C2C',
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 16.8,
  },
  info: {
    color: '#2C2C2C',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  historyButton: {
    flex: 1,
    height: 32,
    backgroundColor: 'white',
    borderColor: '#E2E8F0',
  },
  qrButton: {
    flex: 1,
    height: 32,
    backgroundColor: '#FFBA92',
  },
});
