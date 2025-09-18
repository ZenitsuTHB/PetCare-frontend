import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Button = ({
  // Texto y contenido
  title,

  // Funcionalidad
  onPress,
  disabled = false,
  loading = false,

  // Variantes de diseño
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost', 'danger'
  size = 'medium', // 'small', 'medium', 'large'

  // Iconos
  iconName,
  iconPosition = 'left', // 'left', 'right', 'only'
  iconSize = 18,

  // Estilos personalizados
  style,
  textStyle,

  // Props adicionales
  fullWidth = false,
  ...props
}) => {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    loading && styles.loading,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  const renderIcon = () => {
    if (!iconName) return null;

    return (
      <Icon
        name={iconName}
        size={iconSize}
        color={getIconColor(variant, disabled)}
      />
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator size="small" color={getLoadingColor(variant)} />
      );
    }

    if (iconPosition === 'only') {
      return renderIcon();
    }

    return (
      <View style={styles.content}>
        {iconPosition === 'left' && renderIcon()}
        {title && <Text style={textStyles}>{title}</Text>}
        {iconPosition === 'right' && renderIcon()}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

// Helper functions
const getIconColor = (variant, disabled) => {
  if (disabled) return '#999';

  const colors = {
    primary: '#FFF8F4',
    secondary: '#FA8081',
    outline: '#FA8081',
    ghost: '#FA8081',
    danger: '#FFF8F4',
  };

  return colors[variant] || '#FA8081';
};

const getLoadingColor = (variant) => {
  const colors = {
    primary: '#FFF8F4',
    secondary: '#FA8081',
    outline: '#FA8081',
    ghost: '#FA8081',
    danger: '#FFF8F4',
  };

  return colors[variant] || '#FA8081';
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  // Variantes
  button_primary: {
    backgroundColor: '#FA8081',
    borderWidth: 0,
  },
  button_secondary: {
    backgroundColor: '#FFF8F4',
    borderWidth: 1,
    borderColor: '#FA8081',
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FA8081',
  },
  button_ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  button_danger: {
    backgroundColor: '#FF4444',
    borderWidth: 0,
  },

  // Tamaños
  button_small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 32,
  },
  button_medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 44,
  },
  button_large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 52,
  },

  // Estados
  disabled: {
    opacity: 0.5,
  },
  loading: {
    opacity: 0.8,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },

  // Contenido
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Texto base
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },

  // Texto por variante
  text_primary: {
    color: '#FFF8F4',
  },
  text_secondary: {
    color: '#FA8081',
  },
  text_outline: {
    color: '#FA8081',
  },
  text_ghost: {
    color: '#FA8081',
  },
  text_danger: {
    color: '#FFF8F4',
  },

  // Texto por tamaño
  text_small: {
    fontSize: 14,
    lineHeight: 20,
  },
  text_medium: {
    fontSize: 16,
    lineHeight: 24,
  },
  text_large: {
    fontSize: 18,
    lineHeight: 28,
  },

  textDisabled: {
    opacity: 0.7,
  },
});
