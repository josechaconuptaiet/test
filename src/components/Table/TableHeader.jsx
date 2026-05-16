import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export function TableHeader({ 
  columns, sortColumn, sortDirection, onSort, filters, onFilterChange, data 
}) {
  const [openFilterDropdown, setOpenFilterDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenFilterDropdown(null);
      }
    };
    if (openFilterDropdown) window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [openFilterDropdown]);

  const getFilterOptions = (column) => {
    if (column.filterOptions) return column.filterOptions;
    const uniqueValues = new Set(data.map(row => String(row[column.key] ?? '')));
    return Array.from(uniqueValues).filter(Boolean).sort();
  };

  const toggleFilter = (columnKey, optionValue) => {
    const currentActiveFilters = filters[columnKey] || [];
    const nextFilters = currentActiveFilters.includes(optionValue)
      ? currentActiveFilters.filter(item => item !== optionValue)
      : [...currentActiveFilters, optionValue];
    onFilterChange(columnKey, nextFilters);
  };

  return (
    <thead className="ac-table-header">
      <tr>
        {columns.map(column => {
          const isSorted = sortColumn === column.key;
          const activeFiltersCount = filters[column.key]?.length || 0;
          const isFilterOpen = openFilterDropdown === column.key;

          return (
            <th key={column.key} style={{ width: column.width, textAlign: column.align || 'left' }}>
              <div className="ac-th-content">
                <div 
                  className={cn('ac-th-label', isSorted && 'ac-active', column.sortable && 'ac-clickable')}
                  onClick={column.sortable ? () => onSort(column.key) : undefined}
                  onDoubleClick={column.sortable ? () => onSort(null) : undefined}
                  title={column.sortable ? "Click para ordenar, doble click para limpiar" : undefined}
                >
                  {column.headerRender ? column.headerRender(column) : column.header}
                </div>
                
                {column.sortable && (
                  <div className="ac-sort-shorthands">
                    <button 
                      type="button" 
                      className={cn('ac-sort-btn', isSorted && sortDirection === 'asc' && 'ac-active')}
                      onClick={() => onSort(column.key, 'asc')}
                      title="Orden ascendente"
                    >
                      ▲
                    </button>
                    <button 
                      type="button" 
                      className={cn('ac-sort-btn', isSorted && sortDirection === 'desc' && 'ac-active')}
                      onClick={() => onSort(column.key, 'desc')}
                      title="Orden descendente"
                    >
                      ▼
                    </button>
                  </div>
                )}
                
                {column.filterable && (
                  <div 
                    className="ac-filter-wrap" onClick={event => event.stopPropagation()} 
                    ref={isFilterOpen ? dropdownRef : null}
                  >
                    <button 
                      type="button" className={cn('ac-filter-btn', activeFiltersCount > 0 && 'ac-active')} 
                      onClick={() => setOpenFilterDropdown(isFilterOpen ? null : column.key)}
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M1 2h14l-5 6v5l-4 2V8L1 2z" />
                      </svg>
                    </button>
                    {isFilterOpen && (
                      <div className="ac-table-filter-dropdown">
                        {column.filterRender ? (
                          column.filterRender({
                            column,
                            activeFilters: filters[column.key] || [],
                            onFilterChange: (values) => onFilterChange(column.key, values),
                            close: () => setOpenFilterDropdown(null),
                            options: getFilterOptions(column)
                          })
                        ) : (
                          getFilterOptions(column).map(option => (
                            <div key={option} className="ac-table-filter-option" onClick={() => toggleFilter(column.key, option)}>
                              <input type="checkbox" checked={(filters[column.key] || []).includes(option)} readOnly />
                              <span>{option}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

