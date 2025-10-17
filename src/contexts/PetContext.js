import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPetId, migratePetToUniqueId, generateUniqueId } from '../utils/petUtils';

const PetContext = createContext();

export const usePets = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
};

export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar mascotas desde AsyncStorage al iniciar
  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const storedPets = await AsyncStorage.getItem('pets');
      if (storedPets) {
        const parsedPets = JSON.parse(storedPets);
        console.log('=== LOADED PETS FROM STORAGE ===');
        console.log('Loaded pets:', parsedPets);
        
        // Migrar mascotas a IDs únicos si es necesario
        const migratedPets = await migratePetsToUniqueIds(parsedPets);
        setPets(migratedPets);
      } else {
        // Datos de prueba si no hay mascotas guardadas con IDs únicos
        const testPets = [
          {
            id: generateUniqueId(),
            name: 'Max',
            species: 'Perro',
            breed: 'Golden Retriever',
            weight: '25',
            chip: 'CHI001234567',
            registrationDate: '15/09/2025',
            photoUri: null,
            birthdate: '2022-03-15',
            gender: 'Macho',
            notes: 'Muy juguetón y amigable',
          },
          {
            id: generateUniqueId(),
            name: 'Luna',
            species: 'Gato',
            breed: 'Persa',
            weight: '4',
            chip: 'CHI001234568',
            registrationDate: '20/08/2025',
            photoUri: null,
            birthdate: '2021-07-10',
            gender: 'Hembra',
            notes: 'Le gusta dormir en lugares altos',
          },
        ];
        setPets(testPets);
        await savePets(testPets);
      }
    } catch (error) {
      console.error('Error loading pets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Migrar mascotas existentes a IDs únicos
  const migratePetsToUniqueIds = async (petsArray) => {
    let hasChanges = false;
    const migratedPets = [];

    for (const pet of petsArray) {
      if (!pet.id || typeof pet.id !== 'string' || pet.id.length < 10) {
        console.log(`Migrating pet ${pet.name} to unique ID...`);
        const uniqueId = generateUniqueId();
        const migratedPet = { ...pet, id: uniqueId, _migrated: true, _oldId: pet.id };
        migratedPets.push(migratedPet);
        hasChanges = true;
      } else {
        migratedPets.push(pet);
      }
    }

    // Guardar si hubo cambios
    if (hasChanges) {
      console.log('Saving migrated pets:', migratedPets);
      await AsyncStorage.setItem('pets', JSON.stringify(migratedPets));
    }

    return migratedPets;
  };

  // Guardar mascotas en AsyncStorage
  const savePets = async (newPets) => {
    try {
      await AsyncStorage.setItem('pets', JSON.stringify(newPets));
    } catch (error) {
      console.error('Error saving pets:', error);
    }
  };

  // Agregar nueva mascota con ID único
  const addPet = async (petData) => {
    const newPet = {
      id: generateUniqueId(), // ID único UUID
      ...petData,
      registrationDate: new Date().toLocaleDateString('es-ES'), // Fecha actual
    };

    const updatedPets = [...pets, newPet];
    setPets(updatedPets);
    await savePets(updatedPets);
    return newPet;
  };

  // Obtener mascota por ID
  const getPetById = (petId) => {
    return pets.find(pet => pet.id === petId) || null;
  };

  // Obtener ID de mascota (para compatibilidad con FilesContext)
  const getPetIdImmediate = (pet, petName) => {
    if (pet?.id) {
      return pet.id;
    }
    
    // Buscar en mascotas registradas por características únicas
    const foundPet = pets.find(p => 
      p.name === (pet?.name || petName) && 
      (p.chip === pet?.chip || p.birthdate === pet?.birthdate)
    );
    
    if (foundPet) {
      return foundPet.id;
    }
    
    // Si no se encuentra, devolver null para forzar creación/registro
    return null;
  };

  // Actualizar mascota existente
  const updatePet = async (petId, petData) => {
    const updatedPets = pets.map((pet) =>
      pet.id === petId ? { ...pet, ...petData } : pet
    );
    setPets(updatedPets);
    await savePets(updatedPets);
  };

  // Eliminar mascota
  const deletePet = async (petId) => {
    console.log('PetContext deletePet called with petId:', petId);

    // Asegurar que estamos comparando el mismo tipo
    const petIdStr = String(petId);
    const updatedPets = pets.filter((pet) => String(pet.id) !== petIdStr);

    setPets(updatedPets);
    await savePets(updatedPets);
    console.log('Pet deletion completed');
  };

  const value = {
    pets,
    loading,
    addPet,
    updatePet,
    deletePet,
    refreshPets: loadPets,
    getPetById,
    getPetIdImmediate,
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
};
