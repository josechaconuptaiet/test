import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn, toCssSize } from '../../utils/cn';
import './Modal.css';

export const Modal = (props) => {
  const { 
    type = 'info', isOpen, onClose, title = 'Aviso', children, color, overlayColor = 'rgba(0, 0, 0, 0.5)', 
    showCloseButton = true, closeOnOverlay = true, closeOnEscape = true, 
    icon, footer, className, style, maxWidth = 500 
  } = props;
  
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const modalContainerRef = useRef(null);

  // Maneja la animación de cierre antes de desmontar
  const handleClose = () => { 
    setIsClosing(true); 
    setTimeout(() => { 
      setIsClosing(false); 
      onClose(); 
    }, 150); 
  };

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleKeyDown = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen && modalContainerRef.current) modalContainerRef.current.focus();
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted || !isOpen) return null;

  const renderIcon = () => {
    if (icon) return icon;
    const iconPaths = {
      success: <path d="M5 13l4 4L19 7" />,
      error: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
      info: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>
    };
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {iconPaths[type]}
      </svg>
    );
  };

  return createPortal(
    <div 
      className={cn('ac-modal-overlay', isClosing && 'ac-closing')} 
      style={{ background: overlayColor }} 
      onClick={closeOnOverlay ? handleClose : undefined}
    >
      <div 
        ref={modalContainerRef} 
        className={cn('ac-modal', isClosing && 'ac-closing', type !== 'custom' && 'ac-modal-center', className)} 
        style={{ maxWidth: toCssSize(maxWidth), ...style }} 
        onClick={e => e.stopPropagation()} 
        tabIndex={-1}
      >
        {showCloseButton && (
          <button className="ac-modal-close" onClick={handleClose}>✕</button>
        )}
        
        {type !== 'custom' && (
          <div className={cn('ac-modal-ico', `ac-ico-${type}`)}>
            <div style={{ color, background: color ? `${color}20` : undefined }}>
              {renderIcon()}
            </div>
          </div>
        )}
        
        {title && <h2 className="ac-modal-title">{title}</h2>}
        <div className="ac-modal-body">{children}</div>
        {footer && <div className="ac-modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

Modal.displayName = 'Modal';

