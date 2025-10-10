import axios from 'axios';
import api from './config';

const sanitizeValue = (value) =>
  typeof value === 'string' ? value.trim() : value;

const sanitizePayload = (payload) =>
  Object.fromEntries(
    Object.entries(payload)
      .map(([key, value]) => [key, sanitizeValue(value)])
      .filter(
        ([, value]) => value !== undefined && value !== null && value !== ''
      )
  );

const toFormUrlEncoded = (payload) =>
  Object.entries(payload)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join('&');

const buildRegisterPayload = (input = {}) => {
  const termsValue =
    input.termsAccepted ?? input.terminos ?? input.terms ?? input.agree ?? false;

  const payload = sanitizePayload({
    nombre: input.firstName,
    apellidos: input.lastName,
    correo: input.email?.toLowerCase(),
    contrasena: input.password,
    contrasena_confirmation:
      input.confirmPassword ?? input.passwordConfirmation ?? input.password,
    domicilio: input.address,
    ciudad: input.city,
    provincia: input.province,
    cp: input.postalCode,
    terminos:
      typeof termsValue === 'boolean' ? Number(termsValue) : sanitizeValue(termsValue),
  });

  return payload;
};

const buildLoginPayload = (input = {}) =>
  sanitizePayload({
    correo: input.email?.toLowerCase(),
    contrasena: input.password,
  });

const buildSuccessResult = (data, fallbackPayload) => {
  const container = typeof data === 'object' && data !== null ? data : {};
  const nestedData =
    (typeof container.data === 'object' && container.data !== null
      ? container.data
      : {}) || {};
  const userPayload =
    (typeof nestedData.user === 'object' && nestedData.user !== null
      ? nestedData.user
      : typeof container.user === 'object' && container.user !== null
        ? container.user
        : {}) || {};

  const nombre = userPayload.nombre ?? fallbackPayload?.nombre;
  const apellidos = userPayload.apellidos ?? fallbackPayload?.apellidos;

  return {
    success: container.success ?? true,
    message: container.message ?? container.error ?? 'Operacion completada',
    user: {
      ...userPayload,
      nombre,
      apellidos,
      correo: userPayload.correo ?? fallbackPayload?.correo,
      full_name:
        userPayload.full_name ??
        [nombre, apellidos].filter(Boolean).join(' ').trim(),
    },
    token: nestedData.token ?? container.token,
    raw: container,
  };
};

const buildGenericSuccessResult = (data) => {
  const container = typeof data === 'object' && data !== null ? data : {};
  return {
    success: container.success ?? true,
    message: container.message ?? container.error ?? 'Operacion completada',
    data: container.data ?? container,
    raw: container,
  };
};

const buildErrorResult = (error) => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    return {
      success: false,
      message:
        responseData?.message ??
        responseData?.error ??
        error.response?.statusText ??
        'No fue posible completar la solicitud',
      errors: responseData?.errors ?? responseData?.data?.errors,
      status: error.response?.status,
      raw: responseData,
    };
  }

  return {
    success: false,
    message: 'No fue posible completar la solicitud',
    errors: undefined,
    status: undefined,
    raw: error,
  };
};

const withAuth = (token) =>
  token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};

export const register = async (userInput = {}) => {
  const payload = buildRegisterPayload(userInput);
  const body = toFormUrlEncoded(payload);

  try {
    const { data } = await api.post('/auth/register', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return buildSuccessResult(data, payload);
  } catch (error) {
    return buildErrorResult(error);
  }
};

export const login = async (credentials = {}) => {
  const payload = buildLoginPayload(credentials);
  const body = toFormUrlEncoded(payload);

  try {
    const { data } = await api.post('/auth/login', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return buildSuccessResult(data, payload);
  } catch (error) {
    return buildErrorResult(error);
  }
};

export const getMe = async (token) => {
  try {
    const { data } = await api.get('/auth/me', withAuth(token));
    return buildGenericSuccessResult(data);
  } catch (error) {
    return buildErrorResult(error);
  }
};

export const logout = async (token) => {
  try {
    const { data } = await api.post('/auth/logout', null, withAuth(token));
    return buildGenericSuccessResult(data);
  } catch (error) {
    return buildErrorResult(error);
  }
};

export const refreshToken = async (token) => {
  try {
    const { data } = await api.post('/auth/refresh', null, withAuth(token));
    return buildGenericSuccessResult(data);
  } catch (error) {
    return buildErrorResult(error);
  }
};


