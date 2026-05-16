import React, { forwardRef, useState, useId, useEffect } from 'react';
import { cn, toCssSize } from '../../utils/cn';
import { runValidations } from '../../utils/validators';
import { useValidationStore } from '../../store/validationStore';
import './Input.css';

export const Input = forwardRef((props, ref) => {
  const { 
    name, label, showLabel = true, placeholder = 'Escribe algo...', showPlaceholder = true, 
    type = 'text', value, defaultValue = '', onChange, onBlur, onFocus, 
    width = '100%', height, maxLength, minLength, textOnly, allowSpecialChars = true, 
    allowedChars, errorMessage, disabled, readOnly, showCounter, className, 
    style, id, autoComplete, required, size = 'medium', variant = 'outlined', 
    status = 'default', prefix, suffix, color = '#6366f1' 
  } = props;

  const inputId = id || useId();
  const fieldName = name || inputId;
  const { setError, clearError, setTouched, touched: globalTouched } = useValidationStore();

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [validationMessage, setValidationMessage] = useState('');
  const [localTouched, setLocalTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Valor actual (soporta modo controlado o no controlado)
  const currentValue = value !== undefined ? value : internalValue;
  
  const isTouched = localTouched || globalTouched[fieldName];
  const hasValidationError = isTouched && validationMessage.length > 0;
  const isErrorState = hasValidationError || status === 'error';
  const currentStatus = isErrorState ? 'error' : status;

  // Determinar el tipo de input real (para manejar el toggle de contraseña)
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Ejecutar validaciones al cambiar el valor
  useEffect(() => {
    const validationResult = runValidations(currentValue, { 
      required, minLength, maxLength, textOnly, allowSpecialChars, allowedChars, errorMessage 
    });

    if (!validationResult.valid) { 
      setValidationMessage(validationResult.message); 
      setError(fieldName, [validationResult.message]); 
    } else { 
      setValidationMessage(''); 
      clearError(fieldName); 
    }
  }, [currentValue, required, minLength, maxLength, textOnly, allowSpecialChars, allowedChars, errorMessage, fieldName]);

  const handleChange = (event) => {
    let newValue = event.target.value;

    // Ya no filtramos caracteres aquí para permitir que el usuario escriba todo,
    // pero las validaciones se ejecutarán en el useEffect para mostrar errores.
    
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }
    
    if (value === undefined) setInternalValue(newValue);
    onChange?.(newValue, event);
  };

  const handleBlur = (event) => {
    setLocalTouched(true);
    setTouched(fieldName);
    onBlur?.(event);
  };

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div 
      className={cn(
        'ac-input', `ac-input--${size}`, `ac-input--${variant}`, 
        isErrorState && 'ac-status-error', status === 'warning' && 'ac-status-warning', className
      )} 
      style={{ 
        width: toCssSize(width), 
        '--ac-primary-color': color,
        ...style 
      }}
    >
      {showLabel && label && (
        <label className="ac-input-label" htmlFor={inputId}>
          {label} {required && <span className="ac-input-req">*</span>}
        </label>
      )}

      <div className={cn('ac-input-field', !!prefix && 'ac-has-prefix', (!!suffix || type === 'password') && 'ac-has-suffix')}>
        {prefix && <span className="ac-input-icon ac-prefix">{prefix}</span>}
        
        <input 
          ref={ref} id={inputId} name={name} type={inputType} className="ac-input-el" 
          value={currentValue} placeholder={showPlaceholder ? placeholder : undefined} 
          disabled={disabled} readOnly={readOnly} autoComplete={autoComplete} 
          onChange={handleChange} onBlur={handleBlur} onFocus={onFocus} 
          style={{ height: toCssSize(height) }} 
        />

        {type === 'password' ? (
          <button type="button" className="ac-input-icon ac-suffix ac-pwd-toggle" onClick={togglePassword} tabIndex="-1">
            {suffix ? suffix : (
              showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              )
            )}
          </button>
        ) : (
          suffix && <span className="ac-input-icon ac-suffix">{suffix}</span>
        )}
      </div>

      {(isErrorState || status === 'warning' || (showCounter ?? maxLength)) && (
        <div className="ac-input-footer">
          <div className="ac-input-msg">
            {isErrorState ? (validationMessage || errorMessage || "Error") : 
             status === 'warning' ? (errorMessage || "Advertencia") : null}
          </div>
          {(showCounter ?? maxLength) && (
            <div className={cn('ac-input-count', currentValue.length >= (maxLength || 0) && 'ac-count-limit')}>
              {currentValue.length}{maxLength && `/${maxLength}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';


