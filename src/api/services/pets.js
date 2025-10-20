import api from './config';
import { buildErrorResult, buildGenericSuccessResult } from './auth';

const toIsoDate = (value) => {
  if (!value) return undefined;
  if (typeof value !== 'string') return value;

  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return value;

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
};

const toNumber = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const sanitizeValue = (value) => (typeof value === 'string' ? value.trim() : value);

const sanitizePayload = (payload) =>
  Object.fromEntries(
    Object.entries(payload)
      .map(([key, value]) => [key, sanitizeValue(value)])
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
  );

const toFormUrlEncoded = (payload) =>
  Object.entries(payload)
    .map(([key, value]) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join('&');

const buildCreatePetPayload = (input = {}) => ({
  nombre: input.name?.trim(),
  especie: input.species,
  raza: input.breed,
  genero: input.gender,
  fecha_nacimiento: toIsoDate(input.birthdate),
  chip: input.chip,
  peso: toNumber(input.weight),
  notas: input.notes,
});

const buildUpdatePetPayload = (input = {}) => ({
  nombre: input.name?.trim(),
  especie: input.species,
  raza: input.breed,
  genero: input.gender,
  fecha_nacimiento: toIsoDate(input.birthdate),
  peso: toNumber(input.weight),
  notas: input.notes,
});

const authConfig = (token) => ({
  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
});

export const listPets = async (token) => {
  try {
    const { data } = await api.get('/pets', authConfig(token));
    return buildGenericSuccessResult(data);
  } catch (error) {
    return buildErrorResult(error);
  }
};

export const getPet = async (id, token) => {
  try {
    const { data } = await api.get(`/pets/${id}`, authConfig(token));
    return buildGenericSuccessResult(data);
  } catch (error) {
    return buildErrorResult(error);
  }
};

export const createPet = async (payload = {}, token) => {
  const bodyAsObject = buildCreatePetPayload(payload);
  const sanitizedBody = sanitizePayload(bodyAsObject);
  const body = toFormUrlEncoded(sanitizedBody);

  const config = authConfig(token);
  const headers = {
    ...(config.headers ?? {}),
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const { data } = await api.post('/pets', body, { ...config, headers });
    return buildGenericSuccessResult(data);
  } catch (error) {
    return buildErrorResult(error);
  }
};

export const updatePet = async (id, payload = {}, token) => {
  const bodyAsObject = buildUpdatePetPayload(payload);
  const sanitizedBody = sanitizePayload(bodyAsObject);
  const body = toFormUrlEncoded(sanitizedBody);

  const config = authConfig(token);
  const headers = {
    ...(config.headers ?? {}),
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const { data } = await api.put(`/pets/${id}`, body, { ...config, headers });
    return buildGenericSuccessResult(data);
  } catch (error) {
    return buildErrorResult(error);
  }
};

export const deletePet = async (id, token) => {
  try {
    const { data } = await api.delete(`/pets/${id}`, authConfig(token));
    return buildGenericSuccessResult(data);
  } catch (error) {
    return buildErrorResult(error);
  }
};
