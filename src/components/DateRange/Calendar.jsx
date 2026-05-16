import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';

const MONTH_NAMES = {
  es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

const WEEKDAY_NAMES = {
  es: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
};

const isSameDay = (dateA, dateB) => {
  if (!dateA || !dateB) return false;
  return (
    dateA.getFullYear() === dateB.getFullYear() && 
    dateA.getMonth() === dateB.getMonth() && 
    dateA.getDate() === dateB.getDate()
  );
};

const isDateBetween = (targetDate, startDate, endDate) => {
  if (!targetDate || !startDate || !endDate) return false;
  const targetTime = targetDate.getTime(), startTime = startDate.getTime(), endTime = endDate.getTime();
  const minTime = Math.min(startTime, endTime), maxTime = Math.max(startTime, endTime);
  return targetTime >= minTime && targetTime <= maxTime;
};

const getStartOfDay = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const Calendar = (props) => {
  const { 
    currentMonth, selectedStart, selectedEnd, hoverDate, onDateClick, 
    onDateHover, onPrevMonth, onNextMonth, allowFutureDates, allowPastDates, 
    minDate, maxDate, dateColors, locale, rangeColor 
  } = props;
  
  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();
  const today = getStartOfDay(new Date());

  // Genera la cuadrícula de 42 días para el calendario
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1);
    const dayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; 
    const lastDayOfCurrentMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const lastDayOfPrevMonth = new Date(currentYear, currentMonthIndex, 0).getDate();
    const daysArray = [];

    for (let i = dayOfWeek - 1; i >= 0; i--) {
      daysArray.push({ date: new Date(currentYear, currentMonthIndex - 1, lastDayOfPrevMonth - i), isCurrentMonth: false });
    }
    for (let i = 1; i <= lastDayOfCurrentMonth; i++) {
      daysArray.push({ date: new Date(currentYear, currentMonthIndex, i), isCurrentMonth: true });
    }
    const remainingSlots = 42 - daysArray.length;
    for (let i = 1; i <= remainingSlots; i++) {
      daysArray.push({ date: new Date(currentYear, currentMonthIndex + 1, i), isCurrentMonth: false });
    }
    return daysArray;
  }, [currentYear, currentMonthIndex]);

  const isDateDisabled = (date) => {
    const dateTime = getStartOfDay(date).getTime();
    const todayTime = today.getTime();
    if (!allowFutureDates && dateTime > todayTime) return true;
    if (!allowPastDates && dateTime < todayTime) return true;
    if (minDate && dateTime < getStartOfDay(minDate).getTime()) return true;
    if (maxDate && dateTime > getStartOfDay(maxDate).getTime()) return true;
    return false;
  };

  const currentMonthName = (MONTH_NAMES[locale] || MONTH_NAMES.es)[currentMonthIndex];
  const weekdays = WEEKDAY_NAMES[locale] || WEEKDAY_NAMES.es;

  return (
    <div className="ac-calendar">
      <div className="ac-calendar-header">
        <button type="button" className="ac-calendar-nav" onClick={onPrevMonth}>‹</button>
        <span className="ac-calendar-title">{currentMonthName} {currentYear}</span>
        <button type="button" className="ac-calendar-nav" onClick={onNextMonth}>›</button>
      </div>
      <div className="ac-calendar-week">
        {weekdays.map(dayName => <span key={dayName}>{dayName}</span>)}
      </div>
      <div className="ac-calendar-grid">
        {calendarDays.map((day, index) => {
          const date = getStartOfDay(day.date);
          const isDisabled = isDateDisabled(date) || !day.isCurrentMonth;
          const isSelectedStart = selectedStart && isSameDay(date, selectedStart);
          const isSelectedEnd = selectedEnd && isSameDay(date, selectedEnd);
          const isInSelectedRange = selectedStart && selectedEnd && isDateBetween(date, selectedStart, selectedEnd);
          const isInHoverRange = selectedStart && !selectedEnd && hoverDate && isDateBetween(date, selectedStart, hoverDate);
          const isRangeMember = isInSelectedRange || isInHoverRange;
          const customColorConfig = dateColors?.find(config => isSameDay(config.date, date));

          const dayStyle = {};
          const activeColor = rangeColor || '#4f46e5';

          if (isSelectedStart || isSelectedEnd) {
            dayStyle.backgroundColor = activeColor;
            dayStyle.color = '#fff';
          } else if (isInSelectedRange) {
            dayStyle.backgroundColor = `${activeColor}20`;
            dayStyle.color = activeColor;
          } else if (customColorConfig) {
            dayStyle.backgroundColor = customColorConfig.backgroundColor;
            dayStyle.color = customColorConfig.textColor;
          }

          return (
            <button
              key={`day-${index}`} type="button" disabled={isDisabled}
              className={cn('ac-calendar-day', !day.isCurrentMonth && 'ac-other', isSameDay(date, today) && 'ac-today', isSelectedStart && 'ac-start', isSelectedEnd && 'ac-end', isRangeMember && 'ac-range', isDisabled && 'ac-disabled')}
              onClick={() => !isDisabled && onDateClick(date)}
              onMouseEnter={() => day.isCurrentMonth && !isDisabled && onDateHover(date)}
              onMouseLeave={() => onDateHover(null)}
              style={dayStyle}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

