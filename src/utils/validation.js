import { VALIDATION_MESSAGES } from '../constants/formConstants';

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 8; // Cambié a 8 para que coincida con RegisterScreen
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateDateFormat = (date) => {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  return dateRegex.test(date);
};

export const validateChip = (chip) => {
  // Debe ser exactamente 15 dígitos numéricos
  if (!/^\d{15}$/.test(chip)) {
    return { isValid: false, message: 'Debe contener exactamente 15 dígitos numéricos' };
  }
  
  // Los 3 primeros dígitos deben estar entre 900 y 985
  const prefix = parseInt(chip.substring(0, 3), 10);
  if (prefix < 900 || prefix > 985) {
    return { isValid: false, message: 'Los 3 primeros dígitos deben estar entre 900 y 985' };
  }
  
  return { isValid: true };
};

export const validatePostalCode = (postalCode) => {
  // Código postal español: 5 dígitos
  const postalRegex = /^\d{5}$/;
  return postalRegex.test(postalCode);
};

// Validación para formulario de registro básico (RegisterScreen)
export const validateRegistrationBasicForm = (formData) => {
  const errors = {};

  if (!validateRequired(formData.firstName)) {
    errors.firstName = 'Obligatorio';
  }

  if (!validateRequired(formData.lastName)) {
    errors.lastName = 'Obligatorio';
  }

  if (!validateRequired(formData.email)) {
    errors.email = 'Obligatorio';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Formato de email inválido';
  }

  if (!validateRequired(formData.password)) {
    errors.password = 'Obligatorio';
  } else if (!validatePassword(formData.password)) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  }

  if (!validateRequired(formData.confirmPassword)) {
    errors.confirmPassword = 'Obligatorio';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validación para formulario de registro completo (RegisterScreen2)
export const validateRegistrationCompleteForm = (formData) => {
  const errors = {};

  if (!validateRequired(formData.address)) {
    errors.address = 'Obligatorio';
  }

  if (!validateRequired(formData.city)) {
    errors.city = 'Obligatorio';
  }

  if (!validateRequired(formData.postalCode)) {
    errors.postalCode = 'Obligatorio';
  } else if (!validatePostalCode(formData.postalCode)) {
    errors.postalCode = 'Código postal debe tener 5 dígitos';
  }

  if (!validateRequired(formData.province)) {
    errors.province = 'Obligatorio';
  }

  if (!formData.termsAccepted) {
    errors.termsAccepted = 'Debes aceptar los términos y condiciones';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validación para formulario de nueva mascota
export const validatePetForm = (values) => {
  const errors = {};

  if (!validateRequired(values.name)) {
    errors.name = 'Obligatorio';
  }

  if (!validateRequired(values.species)) {
    errors.species = 'Obligatorio';
  }

  if (!validateRequired(values.breed)) {
    errors.breed = 'Obligatorio';
  }

  if (!validateRequired(values.birthdate)) {
    errors.birthdate = 'Obligatorio';
  } else if (!validateDateFormat(values.birthdate)) {
    errors.birthdate = 'Usa dd/mm/aaaa';
  }

  if (!validateRequired(values.gender)) {
    errors.gender = 'Obligatorio';
  }

  if (!validateRequired(values.weight)) {
    errors.weight = 'Obligatorio';
  } else {
    const weightValue = parseFloat(values.weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      errors.weight = 'Debe ser un número válido mayor a 0';
    } else if (weightValue > 200) {
      errors.weight = 'El peso no puede exceder 200 kg';
    }
  }

  if (!validateRequired(values.chip)) {
    errors.chip = 'Obligatorio';
  } else {
    const chipValidation = validateChip(values.chip);
    if (!chipValidation.isValid) {
      errors.chip = chipValidation.message;
    }
  }

  if (!values.consent) {
    errors.consent = 'Debes aceptar la política de privacidad';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validación legacy para compatibilidad con código existente
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
