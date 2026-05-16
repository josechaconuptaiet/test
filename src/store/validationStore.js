import { create } from 'zustand';

/**
 * Store global de validación (Zustand).
 * Gestiona los errores y el estado "touched" de todos los campos del formulario.
 */
export const useValidationStore = create((setStoreState, getStoreState) => ({
  errors: {},
  touched: {},

  // Registra o actualiza errores de un campo
  setError: (fieldName, errorList) =>
    setStoreState((currentState) => ({
      errors: { ...currentState.errors, [fieldName]: errorList },
    })),

  // Limpia los errores de un campo
  clearError: (fieldName) =>
    setStoreState((currentState) => {
      const newErrors = { ...currentState.errors };
      delete newErrors[fieldName];
      return { errors: newErrors };
    }),

  // Marca un campo como interactuado
  setTouched: (fieldName) =>
    setStoreState((currentState) => ({
      touched: { ...currentState.touched, [fieldName]: true },
    })),

  resetAll: () => setStoreState({ errors: {}, touched: {} }),

  getFieldErrors: (fieldName) => getStoreState().errors[fieldName] || [],

  isFieldValid: (fieldName) => {
    const fieldErrors = getStoreState().errors[fieldName];
    return !fieldErrors || fieldErrors.length === 0;
  },

  isFieldTouched: (fieldName) => getStoreState().touched[fieldName] || false,
}));
