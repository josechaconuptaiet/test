/**
 * Funciones de utilidad para validación de componentes.
 */

// Valida longitud mínima
export function validateMinLength(value, min, customMessage) {
  if (value.length > 0 && value.length < min) {
    return {
      valid: false,
      message: customMessage || `Mínimo ${min} caracteres requeridos`,
    };
  }
  return { valid: true, message: '' };
}

// Valida longitud máxima
export function validateMaxLength(value, max, customMessage) {
  if (value.length > max) {
    return {
      valid: false,
      message: customMessage || `Máximo ${max} caracteres permitidos`,
    };
  }
  return { valid: true, message: '' };
}

// Valida que solo contenga letras y espacios
export function validateTextOnly(value, customMessage) {
  if (value.length > 0 && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) {
    return {
      valid: false,
      message: customMessage || 'Solo se permiten letras',
    };
  }
  return { valid: true, message: '' };
}

// Valida que no contenga caracteres especiales
export function validateNoSpecialChars(value, customMessage) {
  if (value.length > 0 && !/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) {
    return {
      valid: false,
      message: customMessage || 'No se permiten caracteres especiales',
    };
  }
  return { valid: true, message: '' };
}

// Valida contra un patrón regex personalizado
export function validateAllowedChars(value, pattern, customMessage) {
  const regex = typeof pattern === 'string' ? new RegExp(`^[${pattern}]+$`) : pattern;
  if (value.length > 0 && !regex.test(value)) {
    return {
      valid: false,
      message: customMessage || 'Contiene caracteres no permitidos',
    };
  }
  return { valid: true, message: '' };
}

// Ejecuta todas las validaciones aplicables
export function runValidations(value, options) {
  const { required, minLength, maxLength, textOnly, allowSpecialChars, allowedChars, errorMessage } = options;

  if (required && value.trim().length === 0) {
    return {
      valid: false,
      message: errorMessage || 'Este campo es obligatorio',
    };
  }

  if (textOnly) {
    const result = validateTextOnly(value, errorMessage);
    if (!result.valid) return result;
  }

  if (allowSpecialChars === false) {
    const result = validateNoSpecialChars(value, errorMessage);
    if (!result.valid) return result;
  }

  if (allowedChars) {
    const result = validateAllowedChars(value, allowedChars, errorMessage);
    if (!result.valid) return result;
  }

  if (minLength !== undefined) {
    const result = validateMinLength(value, minLength, errorMessage);
    if (!result.valid) return result;
  }

  if (maxLength !== undefined) {
    const result = validateMaxLength(value, maxLength, errorMessage);
    if (!result.valid) return result;
  }

  return { valid: true, message: '' };
}
