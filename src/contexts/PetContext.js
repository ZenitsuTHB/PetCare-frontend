import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AutContext';
import {
  listPets,
  createPet as createPetApi,
  updatePet as updatePetApi,
  deletePet as deletePetApi,
} from '../api/services/pets';

const PetContext = createContext();

const formatDateToDisplay = (value) => {
  if (!value) return '';
  if (value instanceof Date) {
    return value.toLocaleDateString('es-ES');
  }
  if (typeof value !== 'string') {
    return String(value);
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value;
  }
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}/${month}/${year}`;
  }
  return value;
};

const toStringOrEmpty = (value) => {
  if (value === undefined || value === null) return '';
  return String(value);
};

const normalizePet = (input = {}) => {
  if (!input) return null;

  const birthdateRaw =
    input.birthdate ??
    input.fecha_nacimiento ??
    input.fechaNacimiento ??
    input.birth_date ??
    '';

  const registrationRaw =
    input.registrationDate ??
    input.fecha_registro ??
    input.fechaRegistro ??
    input.created_at ??
    input.createdAt ??
    '';

  const resolvedId =
    input.id ??
    input.pet_id ??
    input.petId ??
    input.uuid ??
    (input.chip ? `chip-${input.chip}` : undefined) ??
    Date.now();

  return {
    id: String(resolvedId),
    name: input.name ?? input.nombre ?? '',
    species: input.species ?? input.especie ?? '',
    breed: input.breed ?? input.raza ?? '',
    birthdate: formatDateToDisplay(birthdateRaw),
    gender: input.gender ?? input.genero ?? '',
    weight: toStringOrEmpty(input.weight ?? input.peso),
    chip: toStringOrEmpty(
      input.chip ?? input.numero_chip ?? input.numeroChip ?? ''
    ),
    notes: input.notes ?? input.notas ?? '',
    photoUri:
      input.photoUri ??
      input.foto_uri ??
      input.fotoUrl ??
      input.foto_url ??
      input.image_url ??
      '',
    registrationDate:
      formatDateToDisplay(registrationRaw) ||
      new Date().toLocaleDateString('es-ES'),
    consent: input.consent ?? input.autorizado ?? true,
  };
};

const extractPetsFromResponse = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.pets)) return payload.pets;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
};

const extractPetFromResponse = (payload) => {
  if (!payload) return null;
  if (payload.pet) return payload.pet;
  if (payload.data && !Array.isArray(payload.data)) {
    if (payload.data.pet) return payload.data.pet;
    return payload.data;
  }
  return payload;
};

const buildLocalPet = (petData) =>
  normalizePet({
    ...petData,
    id: Date.now(),
    registrationDate: new Date().toLocaleDateString('es-ES'),
  });

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
  const { token } = useContext(AuthContext);

  const savePets = useCallback(async (newPets) => {
    try {
      await AsyncStorage.setItem('pets', JSON.stringify(newPets));
    } catch (error) {
      console.error('Error saving pets:', error);
    }
  }, []);

  const hydrateFromCache = useCallback(async () => {
    try {
      const storedPets = await AsyncStorage.getItem('pets');
      if (storedPets) {
        const parsed = JSON.parse(storedPets);
        if (Array.isArray(parsed)) {
          setPets(parsed.map(normalizePet).filter(Boolean));
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading cached pets:', error);
    }
    setPets([]);
    return [];
  }, []);

  const loadPets = useCallback(async () => {
    if (!token) {
      await hydrateFromCache();
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await listPets(token);
      if (response.success) {
        const remotePets = extractPetsFromResponse(response.data)
          .map(normalizePet)
          .filter(Boolean);

        setPets(remotePets);
        await savePets(remotePets);
      } else {
        console.warn(
          'No se pudo obtener la lista de mascotas:',
          response.message
        );
        await hydrateFromCache();
      }
    } catch (error) {
      console.error('Error loading pets:', error);
      await hydrateFromCache();
    } finally {
      setLoading(false);
    }
  }, [hydrateFromCache, savePets, token]);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  const addPet = async (petData) => {
    if (!token) {
      const fallbackPet = buildLocalPet(petData);
      const updatedPets = [...pets, fallbackPet];
      setPets(updatedPets);
      await savePets(updatedPets);
      return fallbackPet;
    }

    const response = await createPetApi(petData, token);
    if (!response.success) {
      throw new Error(response.message || 'No se pudo crear la mascota.');
    }

    const createdPetRaw = extractPetFromResponse(response.data);
    const createdPet =
      normalizePet(createdPetRaw) ??
      buildLocalPet({ ...petData, id: Date.now() });

    const updatedPets = [...pets, createdPet];
    setPets(updatedPets);
    await savePets(updatedPets);
    return createdPet;
  };

  const updatePet = async (petId, petData) => {
    const petIdStr = String(petId);

    if (!token) {
      const updatedPets = pets.map((pet) =>
        String(pet.id) === petIdStr
          ? {
              ...pet,
              ...petData,
            }
          : pet
      );
      setPets(updatedPets);
      await savePets(updatedPets);
      return updatedPets.find((pet) => String(pet.id) === petIdStr);
    }

    const response = await updatePetApi(petId, petData, token);
    if (!response.success) {
      throw new Error(response.message || 'No se pudo actualizar la mascota.');
    }

    const updatedPetRaw = extractPetFromResponse(response.data);
    const payloadForNormalization = {
      ...petData,
      ...(updatedPetRaw && typeof updatedPetRaw === 'object'
        ? updatedPetRaw
        : {}),
      id:
        updatedPetRaw &&
        typeof updatedPetRaw === 'object' &&
        updatedPetRaw.id !== undefined
          ? updatedPetRaw.id
          : petId,
    };

    const normalizedUpdatedPet = normalizePet(payloadForNormalization);

    const updatedPets = pets.map((pet) =>
      String(pet.id) === petIdStr
        ? {
            ...pet,
            ...normalizedUpdatedPet,
          }
        : pet
    );

    setPets(updatedPets);
    await savePets(updatedPets);
    return updatedPets.find((pet) => String(pet.id) === petIdStr);
  };

  const deletePet = async (petId) => {
    const petIdStr = String(petId);

    if (token) {
      const response = await deletePetApi(petId, token);
      if (!response.success) {
        throw new Error(response.message || 'No se pudo eliminar la mascota.');
      }
    }

    const updatedPets = pets.filter((pet) => String(pet.id) !== petIdStr);
    setPets(updatedPets);
    await savePets(updatedPets);
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
