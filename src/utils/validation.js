import { VALIDATION_MESSAGES } from '../constants/formConstants';

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateRegistrationForm = (formData) => {
  const errors = {};

  // Validate required fields
  if (!validateRequired(formData.nombre)) {
    errors.nombre = VALIDATION_MESSAGES.REQUIRED;
  }

  if (!validateRequired(formData.apellidos)) {
    errors.apellidos = VALIDATION_MESSAGES.REQUIRED;
  }

  if (!validateRequired(formData.correo)) {
    errors.correo = VALIDATION_MESSAGES.REQUIRED;
  } else if (!validateEmail(formData.correo)) {
    errors.correo = VALIDATION_MESSAGES.INVALID_EMAIL;
  }

  if (!validateRequired(formData.contraseña)) {
    errors.contraseña = VALIDATION_MESSAGES.REQUIRED;
  } else if (!validatePassword(formData.contraseña)) {
    errors.contraseña = VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
  }

  if (!validateRequired(formData.ciudad)) {
    errors.ciudad = VALIDATION_MESSAGES.REQUIRED;
  }

  if (!validateRequired(formData.provincia)) {
    errors.provincia = VALIDATION_MESSAGES.REQUIRED;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
