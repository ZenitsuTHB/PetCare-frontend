// src/utils/petUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Genera un UUID v4 simple para usar como ID único
 * @returns {string} UUID único
 */
export const generateUniqueId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Obtiene o genera un ID único para una mascota
 * @param {Object} pet - Objeto de la mascota
 * @param {string} petName - Nombre de la mascota (fallback)
 * @returns {Promise<string>} ID único para la mascota
 */
export const getPetId = async (pet, petName) => {
  // Si la mascota ya tiene un ID asignado, usarlo
  if (pet?.id) {
    return pet.id;
  }

  // Buscar ID existente basado en características únicas de la mascota
  const petKey = `pet_${pet?.name}_${pet?.chip || pet?.birthdate || ''}`.replace(/[^a-zA-Z0-9_]/g, '_');
  
  try {
    const existingId = await AsyncStorage.getItem(`petId_${petKey}`);
    if (existingId) {
      return existingId;
    }
    
    // Generar nuevo ID y guardarlo
    const newId = generateUniqueId();
    await AsyncStorage.setItem(`petId_${petKey}`, newId);
    return newId;
  } catch (error) {
    console.error('Error managing pet ID:', error);
    // Fallback a un ID basado en timestamp y nombre
    return `pet_${Date.now()}_${(pet?.name || petName || 'unknown').replace(/[^a-zA-Z0-9]/g, '_')}`;
  }
};

/**
 * Versión síncrona de getPetId para casos donde ya tenemos el ID
 * @param {Object} pet - Objeto de la mascota
 * @param {string} petName - Nombre de la mascota
 * @returns {string} ID de la mascota o temporal
 */
export const getPetIdSync = (pet, petName) => {
  if (pet?.id) {
    return pet.id;
  }
  
  // Para compatibilidad inmediata, generar ID temporal basado en características
  const petKey = `${pet?.name || petName}_${pet?.chip || pet?.birthdate || Date.now()}`;
  return petKey.replace(/[^a-zA-Z0-9_]/g, '_');
};

/**
 * Migra una mascota a usar un ID único permanente
 * @param {Object} pet - Objeto de la mascota
 * @param {string} tempId - ID temporal actual
 * @returns {Promise<Object>} Mascota con ID permanente
 */
export const migratePetToUniqueId = async (pet, tempId) => {
  const uniqueId = await getPetId(pet);
  
  // Si el ID cambió, necesitamos migrar los datos
  if (uniqueId !== tempId) {
    return { ...pet, id: uniqueId, _migrated: true, _oldId: tempId };
  }
  
  return { ...pet, id: uniqueId };
};

/**
 * Genera parámetros de navegación consistentes para una mascota
 * @param {Object} pet - Objeto de la mascota
 * @param {string} petName - Nombre de la mascota (fallback)
 * @returns {Object} Parámetros para navegación
 */
export const getPetNavigationParams = (pet, petName) => {
  return {
    pet,
    petName: pet?.name || petName
  };
};