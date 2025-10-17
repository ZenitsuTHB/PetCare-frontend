import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPetIdSync } from '../utils/petUtils';

const FilesContext = createContext();

export const useFiles = () => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error('useFiles must be used within a FilesProvider');
  }
  return context;
};

export const FilesProvider = ({ children }) => {
  // Estructura: { petId: { files: [], vaccinations: [] } }
  const [petFiles, setPetFiles] = useState({});
  const [loading, setLoading] = useState(true);

  // Cargar archivos desde AsyncStorage al iniciar
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const storedFiles = await AsyncStorage.getItem('petFiles');
      if (storedFiles) {
        const parsedFiles = JSON.parse(storedFiles);
        console.log('=== LOADED FILES FROM STORAGE ===');
        console.log('Loaded petFiles:', parsedFiles);
        
        // Migrar datos antiguos si es necesario
        const migratedFiles = await migrateOldData(parsedFiles);
        setPetFiles(migratedFiles);
      }
    } catch (error) {
      console.error('Error loading pet files:', error);
    } finally {
      setLoading(false);
    }
  };

  // Migrar datos guardados con IDs antiguos
  const migrateOldData = async (petFiles) => {
    console.log('=== MIGRATING OLD FILES DATA ===');
    let hasChanges = false;
    const migratedFiles = { ...petFiles };
    
    // Obtener las mascotas registradas para mapear IDs antiguos a nuevos
    const storedPets = await AsyncStorage.getItem('pets');
    let registeredPets = [];
    if (storedPets) {
      registeredPets = JSON.parse(storedPets);
    }
    
    // Verificar si hay archivos guardados con IDs antiguos
    for (const [petId, petData] of Object.entries(petFiles)) {
      // Si el ID es numérico corto o un timestamp, intentar migrar
      if (/^\d{1,10}$/.test(petId) || petId === 'default') {
        console.log(`Found old petId: ${petId}, attempting migration...`);
        
        if (petData.files && petData.files.length > 0) {
          // Intentar encontrar la mascota real usando información de los archivos
          const firstFile = petData.files[0];
          const targetPetName = firstFile.petName;
          
          if (targetPetName) {
            // Buscar la mascota registrada con ese nombre
            const matchingPet = registeredPets.find(pet => pet.name === targetPetName);
            
            if (matchingPet && matchingPet.id && matchingPet.id !== petId) {
              console.log(`Migrating files from ${petId} to ${matchingPet.id} for pet ${targetPetName}`);
              
              // Si ya existe data para el ID correcto, combinar
              if (migratedFiles[matchingPet.id]) {
                migratedFiles[matchingPet.id].files = [
                  ...migratedFiles[matchingPet.id].files,
                  ...petData.files
                ];
                migratedFiles[matchingPet.id].vaccinations = [
                  ...migratedFiles[matchingPet.id].vaccinations,
                  ...(petData.vaccinations || [])
                ];
              } else {
                // Mover la data al ID correcto
                migratedFiles[matchingPet.id] = petData;
              }
              
              // Eliminar el ID antiguo
              delete migratedFiles[petId];
              hasChanges = true;
            }
          }
        }
      }
    }
    
    // Si hubo cambios, guardar la versión migrada
    if (hasChanges) {
      console.log('Saving migrated files data:', migratedFiles);
      await AsyncStorage.setItem('petFiles', JSON.stringify(migratedFiles));
    }
    
    return migratedFiles;
  };

  // Guardar archivos en AsyncStorage
  const saveFiles = async (newPetFiles) => {
    try {
      await AsyncStorage.setItem('petFiles', JSON.stringify(newPetFiles));
    } catch (error) {
      console.error('Error saving pet files:', error);
    }
  };

  // Obtener archivos de una mascota específica
  const getPetFiles = (petId) => {
    return petFiles[petId] || { files: [], vaccinations: [] };
  };

  // Agregar archivo a una mascota
  const addFile = async (petId, file) => {
    const newPetFiles = {
      ...petFiles,
      [petId]: {
        ...getPetFiles(petId),
        files: [...getPetFiles(petId).files, { ...file, id: Date.now().toString() }]
      }
    };
    
    setPetFiles(newPetFiles);
    await saveFiles(newPetFiles);
  };

  // Eliminar archivo de una mascota
  const removeFile = async (petId, fileId) => {
    const petData = getPetFiles(petId);
    const newPetFiles = {
      ...petFiles,
      [petId]: {
        ...petData,
        files: petData.files.filter(file => file.id !== fileId)
      }
    };
    setPetFiles(newPetFiles);
    await saveFiles(newPetFiles);
  };

  // Agregar vacuna a una mascota
  const addVaccination = async (petId, vaccination) => {
    const newPetFiles = {
      ...petFiles,
      [petId]: {
        ...getPetFiles(petId),
        vaccinations: [...getPetFiles(petId).vaccinations, { ...vaccination, id: Date.now().toString() }]
      }
    };
    setPetFiles(newPetFiles);
    await saveFiles(newPetFiles);
  };

  // Eliminar vacuna de una mascota
  const removeVaccination = async (petId, vaccinationId) => {
    const petData = getPetFiles(petId);
    const newPetFiles = {
      ...petFiles,
      [petId]: {
        ...petData,
        vaccinations: petData.vaccinations.filter(vacc => vacc.id !== vaccinationId)
      }
    };
    setPetFiles(newPetFiles);
    await saveFiles(newPetFiles);
  };

  // Verificar si una mascota tiene archivos
  const hasFiles = (petId) => {
    const petData = getPetFiles(petId);
    return petData.files.length > 0 || petData.vaccinations.length > 0;
  };

  // Obtener conteo total de archivos de una mascota
  const getFilesCount = (petId) => {
    const petData = getPetFiles(petId);
    return petData.files.length + petData.vaccinations.length;
  };

  const value = {
    loading,
    petFiles, // Agregar petFiles para debugging
    getPetFiles,
    addFile,
    removeFile,
    addVaccination,
    removeVaccination,
    hasFiles,
    getFilesCount,
  };

  return (
    <FilesContext.Provider value={value}>
      {children}
    </FilesContext.Provider>
  );
};