import React from 'react';

export const TablePagination = (props) => {
  const { 
    currentPage, totalPages, pageSize, pageSizeOptions, totalItems, 
    onPageChange, onPageSizeChange 
  } = props;
  
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Genera los números de página con elipsis (...) para navegación
  const generatePageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push('...');
      const rangeStart = Math.max(2, currentPage - 2);
      const rangeEnd = Math.min(totalPages - 1, currentPage + 2);
      for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="ac-pagination">
      <div className="ac-page-info">
        <span className="ac-page-count"><strong>{startItem}-{endItem}</strong> de <strong>{totalItems}</strong></span>
        <div className="ac-page-size">
          <select value={pageSize} onChange={event => onPageSizeChange(Number(event.target.value))}>
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size} / pág</option>
            ))}
          </select>
        </div>
      </div>

      <div className="ac-page-btns">
        <button className="ac-page-btn" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>‹</button>
        
        {generatePageNumbers().map((page, index) => {
          if (page === '...') return <span key={`sep-${index}`} className="ac-page-sep">...</span>;
          return (
            <button 
              key={`page-${page}`} 
              className={`ac-page-btn ${currentPage === page ? 'ac-active' : ''}`} 
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}
        
        <button className="ac-page-btn" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
      </div>
    </div>
  );
};

