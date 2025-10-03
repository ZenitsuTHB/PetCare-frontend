import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Pressable,
  Platform,
} from 'react-native';
import { Menu } from 'react-native-paper';
import Button from '../Button/Button';
import ConfirmationModal from '../Modal/ConfirmationModal';
import { MaterialIcons } from '@expo/vector-icons';

const PetCard = ({
  petName = '',
  petType = '',
  breed = '',
  weight = '',
  chipId = '',
  birthdate = '00/00/0000',
  imageSource,
  onEditPet,
  onDeletePet,
  onShowHistory,
  onShowQR,
  onPress,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Valores animados para el efecto flotante
  const animatedValue = useRef(new Animated.Value(0)).current;
  const shadowOpacity = useRef(new Animated.Value(0.15)).current;



  const handleConfirmDelete = () => {
    setDeleteModalVisible(false);
    if (onDeletePet) {
      onDeletePet();
    }
  };

  // Animaciones de click/press
  const handlePressIn = () => {
    setIsPressed(true);
    Animated.parallel([
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 6,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.35,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.spring(animatedValue, {
        toValue: 0,
        useNativeDriver: true,
        tension: 200,
        friction: 6,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.15,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // Estilos animados
  const animatedStyle = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -12], // Levanta la card 12 unidades
        }),
      },
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.05], // Escala más notoria (5%)
        }),
      },
    ],
  };

  const shadowStyle = {
    shadowOpacity: shadowOpacity,
  };

  return (
    <View style={styles.cardContainer}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.pressableWrapper}
        disabled={dropdownVisible || deleteModalVisible} // Deshabilita cuando hay modales abiertos
        accessibilityRole="button"
        accessibilityLabel={`Abrir perfil de ${petName}`}
      >
        <Animated.View style={[styles.card, animatedStyle, shadowStyle]}>
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
            <Text style={styles.info}>Nacimiento: {birthdate}</Text>

            {/* Botones */}
            <View style={styles.buttonRow}>
              <Button
                title="Historial"
                variant="outline"
                size="small"
                onPress={(e) => {
                  e.stopPropagation();
                  onShowHistory();
                }}
                style={styles.historyButton}
              />

              <Button
                title="Mostrar QR"
                variant="secondary"
                size="small"
                onPress={(e) => {
                  e.stopPropagation();
                  onShowQR();
                }}
                style={styles.qrButton}
              />
            </View>
          </View>

          {/* Menu de opciones */}
            <View style={styles.menuButtonContainer}>
              <Menu
                visible={dropdownVisible}
                onDismiss={() => setDropdownVisible(false)}
                anchor={
                  <Button
                    variant="ghost"
                    size="small"
                    iconName="more-vert"
                    iconPosition="only"
                    iconSize={20}
                    onPress={(e) => {
                      e.stopPropagation();
                      setDropdownVisible(true);
                    }}
                    style={styles.menuButton}
                  />
                }
                contentStyle={styles.menuContent}
              >
                <Menu.Item
                  onPress={() => {
                    setDropdownVisible(false);
                    setTimeout(() => {
                      if (onEditPet) onEditPet();
                    }, 100);
                  }}
                  title="Editar"
                  leadingIcon={() => <MaterialIcons name="edit" size={16} color="#020618" />}
                  titleStyle={styles.menuItemText}
                  style={styles.menuItem}
                />
                <Menu.Item
                  onPress={() => {
                    setDropdownVisible(false);
                    setTimeout(() => {
                      setDeleteModalVisible(true);
                    }, 100);
                  }}
                  title="Eliminar"
                  leadingIcon={() => <MaterialIcons name="delete" size={16} color="#FF4444" />}
                  titleStyle={styles.deleteMenuText}
                  style={styles.menuItem}
                />
              </Menu>
            </View>
        </Animated.View>
      </Pressable>



      {/* Modal de confirmación para eliminar */}
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
  pressableWrapper: {
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
    // Sombra base
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 16,
    elevation: 10, // Para Android
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
  // Estilos para el Menu de react-native-paper (idénticos al dropdown original)
  menuContent: {
    backgroundColor: 'white',
    borderRadius: 6, // Mismo que el dropdown original
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 120,
    paddingVertical: 4, // Mismo padding que el dropdown original
    marginTop: 8,
  },
  menuItem: {
    paddingHorizontal: 12, // Mismo padding que dropdownOption
    paddingVertical: 6,
    minHeight: 32,
    borderRadius: 0,
  },
  menuItemText: {
    color: '#020618', // Mismo color que dropdownOptionText
    fontSize: 14,
    fontWeight: '400',
  },
  deleteMenuText: {
    color: '#FF4444', // Mismo color que dangerText
    fontSize: 14,
    fontWeight: '400',
  },
});
