import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Añadir displayName para mejor debugging
const EmptyState = ({
  image,
  title,
  description,
  imageStyle,
  titleStyle,
  descriptionStyle,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {image && (
        <View style={styles.imageContainer}>
          <Image
            source={image}
            style={[styles.image, imageStyle]}
            resizeMode="contain"
          />
        </View>
      )}

      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}

      {description && (
        <Text style={[styles.description, descriptionStyle]}>
          {description}
        </Text>
      )}
    </View>
  );
};

// Añadir displayName para React DevTools y mejor debugging
EmptyState.displayName = 'EmptyState';

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginBottom: 24,
  },
  image: {
    width: 200,
    height: 176,
  },
  title: {
    textAlign: 'center',
    color: '#FA8081',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    color: '#494949',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    maxWidth: 280,
  },
});
