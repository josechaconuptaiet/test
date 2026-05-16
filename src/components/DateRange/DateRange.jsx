import React, { useState, useRef, useEffect, useId } from 'react';
import { Calendar } from './Calendar';
import { cn, toCssSize } from '../../utils/cn';
import { useValidationStore } from '../../store/validationStore';
import './DateRange.css';

const defaultFormatDate = (date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const DateRange = React.forwardRef((props, ref) => {
  const { 
    value, defaultValue, onChange, allowFutureDates = true, allowPastDates = true, 
    minDate, maxDate, dateColors, highlightRanges, rangeColor, locale = 'es', 
    label, showLabel = true, placeholder = 'Seleccionar rango', disabled, width = '100%', 
    className, style, required, formatDate = defaultFormatDate, id, name, height, color = '#6366f1' 
  } = props;

  const activeRangeColor = color || rangeColor || '#6366f1';

  const dateRangeId = id || useId();
  const fieldName = name || dateRangeId;
  const { setError, clearError, setTouched, touched: globalTouched } = useValidationStore();

  const [isOpen, setIsOpen] = useState(false);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState(null);
  const [internalValue, setInternalValue] = useState(defaultValue || { start: null, end: null });
  const [localTouched, setLocalTouched] = useState(false);

  const containerRef = useRef(null);
  const currentValue = value !== undefined ? value : internalValue;

  const isTouched = localTouched || globalTouched[fieldName];
  const hasError = isTouched && required && (!currentValue.start || !currentValue.end);

  useEffect(() => {
    if (hasError) {
      setError(fieldName, ['Rango de fechas requerido']);
    } else {
      clearError(fieldName);
    }
  }, [currentValue, hasError, fieldName]);

  const handleDateClick = (selectedDate) => {
    let nextRange;
    if (!currentValue.start || (currentValue.start && currentValue.end)) {
      nextRange = { start: selectedDate, end: null };
    } else {
      if (selectedDate < currentValue.start) {
        nextRange = { start: selectedDate, end: currentValue.start };
      } else {
        nextRange = { start: currentValue.start, end: selectedDate };
      }
    }
    if (value === undefined) setInternalValue(nextRange);
    onChange?.(nextRange);
    if (nextRange.start && nextRange.end) setTimeout(() => setIsOpen(false), 200);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setLocalTouched(true);
        setTouched(fieldName);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, fieldName]);

  let displayText = '';
  if (currentValue.start) {
    displayText = currentValue.end 
      ? `${formatDate(currentValue.start)} — ${formatDate(currentValue.end)}` 
      : formatDate(currentValue.start);
  }

  const handlePrevMonth = () => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1));

  return (
    <div 
      ref={containerRef} 
      className={cn('ac-daterange', className, hasError && 'ac-status-error')} 
      style={{ 
        width: toCssSize(width), 
        '--ac-primary-color': activeRangeColor,
        ...style 
      }}
    >
      {showLabel && label && (
        <label className="ac-daterange-label" htmlFor={dateRangeId}>
          {label} {required && <span className="ac-daterange-req">*</span>}
        </label>
      )}

      <button 
        ref={ref} id={dateRangeId} type="button" disabled={disabled} 
        className={cn('ac-daterange-trigger', isOpen && 'ac-open')} 
        onClick={() => { if (!disabled) { setIsOpen(!isOpen); if (isOpen) { setLocalTouched(true); setTouched(fieldName); } } }}
        style={{ height: toCssSize(height) }}
      >
        <span className={cn('ac-daterange-value', !displayText && 'ac-placeholder')}>{displayText || placeholder}</span>
        <svg className="ac-calendar-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="14" height="14" rx="2" /><path d="M3 8h14M7 2v4M13 2v4" />
        </svg>
      </button>

      {isOpen && (
        <div className="ac-daterange-dropdown">
          <Calendar
            currentMonth={currentCalendarMonth} selectedStart={currentValue.start} 
            selectedEnd={currentValue.end} hoverDate={hoverDate} 
            onDateClick={handleDateClick} onDateHover={setHoverDate}
            onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth}
            allowFutureDates={allowFutureDates} allowPastDates={allowPastDates} 
            minDate={minDate} maxDate={maxDate} dateColors={dateColors} 
            rangeColor={activeRangeColor} locale={locale}
          />
          {currentValue.start && (
            <div className="ac-daterange-footer">
              <span>{currentValue.end ? 'Rango completo' : 'Selecciona fin'}</span>
              <button 
                type="button" className="ac-clear-link" 
                onClick={() => { const emptyRange = { start: null, end: null }; if (value === undefined) setInternalValue(emptyRange); onChange?.(emptyRange); }}
              >
                Limpiar
              </button>
            </div>
          )}
        </div>
      )}
      
      {hasError && (
        <div className="ac-inpux-footer">
          <div className="ac-inpux-msg">Rango de fechas requerido</div>
        </div>
      )}
    </div>
  );
});

DateRange.displayName = 'DateRange';


