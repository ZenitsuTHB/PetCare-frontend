export const FORM_FIELDS = {
  NOMBRE: 'nombre',
  APELLIDOS: 'apellidos',
  CORREO: 'correo',
  CONTRASEÑA: 'contraseña',
  DOMICILIO: 'domicilio',
  CIUDAD: 'ciudad',
  PROVINCIA: 'provincia',
  // Campos de mascotas
  PET_NAME: 'name',
  PET_SPECIES: 'species',
  PET_BREED: 'breed',
  PET_BIRTHDATE: 'birthdate',
  PET_CHIP: 'chip',
  PET_NOTES: 'notes',
  PET_PHOTO: 'photoUri',
  PET_CONSENT: 'consent',
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo es requerido',
  INVALID_EMAIL: 'Ingrese un correo válido',
  PASSWORD_MIN_LENGTH: 'La contraseña debe tener al menos 6 caracteres',
};

export const FORM_LABELS = {
  [FORM_FIELDS.NOMBRE]: 'Nombre',
  [FORM_FIELDS.APELLIDOS]: 'Apellidos',
  [FORM_FIELDS.CORREO]: 'Correo',
  [FORM_FIELDS.CONTRASEÑA]: 'Contraseña',
  [FORM_FIELDS.DOMICILIO]: 'Domicilio',
  [FORM_FIELDS.CIUDAD]: 'Ciudad',
  [FORM_FIELDS.PROVINCIA]: 'Provincia',
};

export const SPECIES_OPTIONS = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];

export const SPECIES = {
  DOG: 'Perro',
  CAT: 'Gato',
  BIRD: 'Ave',
  FISH: 'Pez',
  RABBIT: 'Conejo',
  OTHER: 'Otro',
};

// Colores del tema para formularios
export const THEME_COLORS = {
  PRIMARY_PINK: '#FB999A',
  TEXT_PRIMARY: '#121212',
  TEXT_SECONDARY: '#6B6B6B',
  INPUT_BACKGROUND: '#FFFFFF',
  BORDER_DEFAULT: '#EADAD6',
  BORDER_ERROR: '#FF6B6B',
  CTA_BUTTON: '#FA8081',
  FORM_BACKGROUND: '#FFF8F4',
};

// Configuración de picker de imágenes
export const IMAGE_PICKER_CONFIG = {
  allowsEditing: true,
  quality: 0.85,
  aspect: [1, 1],
};

// Mensajes de permisos
export const PERMISSION_MESSAGES = {
  CAMERA_REQUIRED: {
    title: 'Permiso requerido',
    message: 'Activa el acceso a la cámara para continuar.',
  },
  LIBRARY_REQUIRED: {
    title: 'Permiso requerido',
    message: 'Activa el acceso a tus fotos para continuar.',
  },
};
