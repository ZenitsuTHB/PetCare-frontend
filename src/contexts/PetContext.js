import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        setPets(JSON.parse(storedPets));
      }
    } catch (error) {
      console.error('Error loading pets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Guardar mascotas en AsyncStorage
  const savePets = async (newPets) => {
    try {
      await AsyncStorage.setItem('pets', JSON.stringify(newPets));
    } catch (error) {
      console.error('Error saving pets:', error);
    }
  };

  // Agregar nueva mascota
  const addPet = async (petData) => {
    const newPet = {
      id: Date.now().toString(), // ID único simple
      ...petData,
      registrationDate: new Date().toLocaleDateString('es-ES'), // Fecha actual
    };

    const updatedPets = [...pets, newPet];
    setPets(updatedPets);
    await savePets(updatedPets);
    return newPet;
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
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
};
