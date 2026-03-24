import React from 'react';
import './Footer.css';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p className="text-xs text-muted m-0">
            © {new Date().getFullYear()}{' '}
            <span 
              onClick={scrollToTop} 
              className="footer-brand-link" 
              role="button" 
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') scrollToTop(); }}
              aria-label="Volver arriba"
            >
              Holy Drip
            </span>
            . Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted m-0">Powered by Synaptix</p>
        </div>
      </div>
    </footer>
  );
};
