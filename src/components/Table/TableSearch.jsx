import React from 'react';

/**
 * Buscador de la tabla con botón para limpiar.
 */
export const TableSearch = ({ value, onChange, placeholder }) => {
  return (
    <div className="ac-table-search-box">
      <svg className="ac-search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      
      <input 
        type="text" 
        placeholder={placeholder} 
        value={value} 
        onChange={(event) => onChange(event.target.value)} 
      />

      {value && (
        <button className="ac-search-clear" onClick={() => onChange('')} title="Limpiar búsqueda">
          ✕
        </button>
      )}
    </div>
  );
};

