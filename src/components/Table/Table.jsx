import React, { useState, useMemo } from 'react';
import { TableHeader } from './TableHeader';
import { TablePagination } from './TablePagination';
import { TableSearch } from './TableSearch';
import { cn, toCssSize } from '../../utils/cn';
import './Table.css';

export function Table(props) {
  const { 
    columns = [], data = [], width = '100%', height, pagination = true, pageSize: initialPageSize = 10, 
    pageSizeOptions = [5, 10, 20, 50], searchable = true, searchPlaceholder = 'Buscar...', 
    className, style, emptyMessage = 'No hay datos para mostrar', rowKey, 
    onRowClick, striped = true, hoverable = true, color = '#4f46e5' 
  } = props;

  const [searchQuery, setSearchQuery] = useState('');
  const [sortState, setSortState] = useState({ columnKey: null, direction: null });
  const [insertionOrder, setInsertionOrder] = useState('first'); // 'first' o 'last'
  const [filterState, setFilterState] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Procesamiento de datos: búsqueda, filtrado y ordenado
  const processedData = useMemo(() => {
    // Primero aplicamos el orden de inserción (primer agregado / último agregado)
    let result = insertionOrder === 'last' ? [...data].reverse() : [...data];

    // Búsqueda global
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(row => 
        columns.some(column => String(row[column.key] || '').toLowerCase().includes(lowerQuery))
      );
    }

    // Filtros por columna
    Object.entries(filterState).forEach(([columnKey, activeFilters]) => {
      if (activeFilters.length > 0) {
        result = result.filter(row => activeFilters.includes(String(row[columnKey] || '')));
      }
    });

    // Ordenado por columna (si está activo, sobreescribe el orden de inserción)
    if (sortState.columnKey && sortState.direction) {
      const activeColumn = columns.find(col => col.key === sortState.columnKey);
      if (activeColumn) {
        result.sort((rowA, rowB) => {
          const valueA = rowA[activeColumn.key], valueB = rowB[activeColumn.key];
          
          let comparison = 0;
          if (activeColumn.sortType === 'priority' && activeColumn.priorityOrder) {
            const indexA = activeColumn.priorityOrder.indexOf(valueA);
            const indexB = activeColumn.priorityOrder.indexOf(valueB);
            comparison = indexA - indexB;
          } else {
            comparison = String(valueA || '').localeCompare(String(valueB || ''), undefined, { 
              numeric: activeColumn.sortType === 'numeric' 
            });
          }
          
          return sortState.direction === 'desc' ? -comparison : comparison;
        });
      }
    }

    return result;
  }, [data, searchQuery, filterState, sortState, columns, insertionOrder]);

  const totalItems = processedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  const paginatedData = pagination 
    ? processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize) 
    : processedData;

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSort = (columnKey, specificDirection) => {
    setSortState(prev => {
      // Si se pasa una dirección específica, la usamos directamente
      if (specificDirection) {
        // Si ya está en esa dirección, quitamos el ordenado (toggle)
        if (prev.columnKey === columnKey && prev.direction === specificDirection) {
          return { columnKey: null, direction: null };
        }
        return { columnKey, direction: specificDirection };
      }

      // Lógica de toggle clásica si no hay dirección específica
      if (prev.columnKey === columnKey) {
        if (prev.direction === 'asc') return { columnKey, direction: 'desc' };
        return { columnKey: null, direction: null };
      }
      return { columnKey, direction: 'asc' };
    });
    setCurrentPage(1);
  };

  return (
    <div 
      className={cn('ac-table-wrap', className)} 
      style={{ 
        width: toCssSize(width), 
        '--ac-primary-color': color,
        ...style 
      }}
    >
      <div className="ac-table-actions">
        {searchable && (
          <TableSearch value={searchQuery} onChange={handleSearchChange} placeholder={searchPlaceholder} />
        )}
        
        {/* Espacio para herramientas adicionales si se requieren */}
        <div className="ac-table-tools">
          <select 
            className="ac-order-minimal"
            value={insertionOrder} 
            onChange={(e) => setInsertionOrder(e.target.value)}
            title="Orden de inserción"
          >
            <option value="first">Más antiguos primero</option>
            <option value="last">Más recientes primero</option>
          </select>
        </div>
      </div>

      <div className="ac-table-box" style={{ maxHeight: toCssSize(height) }}>
        <table className="ac-table">
          <TableHeader
            columns={columns} sortColumn={sortState.columnKey} sortDirection={sortState.direction}
            onSort={handleSort} filters={filterState} data={data}
            onFilterChange={(columnKey, selectedValues) => { 
              setFilterState(prev => ({ ...prev, [columnKey]: selectedValues })); 
              setCurrentPage(1); 
            }}
          />
          <tbody>
            {paginatedData.length === 0 ? (
              <tr><td colSpan={columns.length} className="ac-table-empty">{emptyMessage}</td></tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr 
                  key={rowKey ? rowKey(row, rowIndex) : rowIndex} 
                  className={cn(striped && 'ac-striped', hoverable && 'ac-hover', onRowClick && 'ac-clickable')} 
                  onClick={() => onRowClick?.(row, rowIndex)}
                >
                  {columns.map(column => (
                    <td key={column.key} style={{ textAlign: column.align || 'left' }}>
                      {column.render ? column.render(row[column.key], row, rowIndex) : String(row[column.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalItems > 0 && (
        <TablePagination
          currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} 
          pageSizeOptions={pageSizeOptions} totalItems={totalItems}
          onPageChange={setCurrentPage} onPageSizeChange={(newSize) => { setPageSize(newSize); setCurrentPage(1); }}
        />
      )}
    </div>
  );
}

Table.displayName = 'Table';

