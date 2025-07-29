export const FORM_FIELDS = {
  NOMBRE: 'nombre',
  APELLIDOS: 'apellidos',
  CORREO: 'correo',
  CONTRASEÑA: 'contraseña',
  DOMICILIO: 'domicilio',
  CIUDAD: 'ciudad',
  PROVINCIA: 'provincia',
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
