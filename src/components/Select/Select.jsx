import React, { forwardRef, useState, useRef, useEffect, useId, useMemo } from 'react';
import { cn, toCssSize } from '../../utils/cn';
import { useValidationStore } from '../../store/validationStore';
import './Select.css';

export const Select = forwardRef((props, ref) => {
  const { 
    options = [], value, defaultValue, onChange, searchable, multiple, 
    placeholder = 'Seleccionar...', width = '100%', height, maxDropdownHeight, 
    disabled, name, label, showLabel = true, className, style, 
    noResultsText = 'Sin resultados', searchPlaceholder = 'Buscar...', 
    required, onBlur, id, clearable, color = '#6366f1' 
  } = props;

  const selectId = id || useId();
  const fieldName = name || selectId;
  const { setError, clearError, setTouched, touched: globalTouched } = useValidationStore();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [internalValue, setInternalValue] = useState(defaultValue || (multiple ? [] : ''));
  const [localTouched, setLocalTouched] = useState(false);

  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const currentValue = value !== undefined ? value : internalValue;
  const isTouched = localTouched || globalTouched[fieldName];
  
  let hasError = false;
  if (isTouched && required) {
    if (multiple) {
      const valueArray = currentValue || [];
      if (valueArray.length === 0) hasError = true;
    } else {
      if (!currentValue) hasError = true;
    }
  }

  useEffect(() => {
    if (hasError) {
      setError(fieldName, ['Este campo es obligatorio']);
    } else {
      clearError(fieldName);
    }
  }, [currentValue, hasError, fieldName]);

  // Filtrado de opciones por búsqueda
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(option => option.label.toLowerCase().includes(query));
  }, [options, searchQuery]);

  const isOptionSelected = (optionValue) => {
    if (multiple) return Array.isArray(currentValue) && currentValue.includes(optionValue);
    return currentValue === optionValue;
  };

  const handleSelect = (optionValue) => {
    let nextValue;
    
    if (multiple) {
      // Lógica de selección múltiple (toggle)
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      if (currentArray.includes(optionValue)) {
        nextValue = currentArray.filter(item => item !== optionValue);
      } else {
        nextValue = [...currentArray, optionValue];
      }
    } else {
      nextValue = optionValue;
      setIsOpen(false);
      setSearchQuery('');
    }

    if (value === undefined) setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setLocalTouched(true);
        setTouched(fieldName);
        onBlur?.();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, fieldName]);

  // Auto-focus al abrir buscador
  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen, searchable]);

  const selectedOption = options.find(option => option.value === currentValue);
  const displayLabel = multiple ? null : (selectedOption ? selectedOption.label : null);

  return (
    <div 
      ref={containerRef} 
      className={cn('ac-select', className, hasError && 'ac-status-error')} 
      style={{ 
        width: toCssSize(width), 
        '--ac-primary-color': color,
        ...style 
      }}
    >
      {showLabel && label && (
        <label className="ac-select-label" htmlFor={selectId}>
          {label} {required && <span className="ac-select-req">*</span>}
        </label>
      )}

      <button 
        ref={ref} id={selectId} type="button" disabled={disabled} 
        className={cn('ac-select-trigger', isOpen && 'ac-open')} 
        onClick={() => !disabled && setIsOpen(!isOpen)} 
        style={{ height: toCssSize(height) }}
      >
        <div className="ac-select-content">
          {multiple && Array.isArray(currentValue) && currentValue.length > 0 ? (
            <div className="ac-select-tags">
              {currentValue.map(val => {
                const option = options.find(opt => opt.value === val);
                if (!option) return null;
                return (
                  <span key={val} className="ac-select-tag">
                    {option.label} 
                    <i onClick={(e) => { e.stopPropagation(); handleSelect(val); }}>✕</i>
                  </span>
                );
              })}
            </div>
          ) : (
            <span className={cn('ac-select-value', !displayLabel && 'ac-placeholder')}>
              {displayLabel || placeholder}
            </span>
          )}
        </div>

        <div className="ac-select-actions">
          {clearable && (multiple ? (currentValue || []).length > 0 : currentValue) && (
            <i className="ac-select-clear" onClick={(e) => { e.stopPropagation(); handleSelect(multiple ? [] : ''); }}>✕</i>
          )}
          <svg className={cn('ac-chevron', isOpen && 'ac-open')} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="ac-select-dropdown" style={{ maxHeight: toCssSize(maxDropdownHeight) }}>
          {searchable && (
            <div className="ac-select-search-box">
              <input 
                ref={searchInputRef} type="text" placeholder={searchPlaceholder} 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                onClick={(e) => e.stopPropagation()} 
              />
            </div>
          )}
          <ul className="ac-select-options">
            {filteredOptions.length === 0 ? (
              <li className="ac-select-no-data">{noResultsText}</li>
            ) : (
              filteredOptions.map(option => (
                <li 
                  key={option.value} 
                  className={cn('ac-select-opt', isOptionSelected(option.value) && 'ac-selected', option.disabled && 'ac-disabled')} 
                  onClick={() => !option.disabled && handleSelect(option.value)}
                >
                  {multiple && <span className="ac-select-check" />}
                  {option.icon && <span className="ac-opt-icon">{option.icon}</span>}
                  {option.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
      
      {hasError && (
        <div className="ac-inpux-footer">
          <div className="ac-inpux-msg">Este campo es obligatorio</div>
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';


