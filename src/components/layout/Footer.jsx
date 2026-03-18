import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './Footer.css';

export const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-brand">
            <button className="footer-logo mb-4 inline-block" aria-label="Volver arriba" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src="/images/logo.png" alt="Holy Drip Logo" style={{ height: '40px' }} />
            </button>
            <p className="text-muted max-w-sm mt-4">
              Básicos premium diseñados para la vida diaria.
            </p>
          </div>
          
          <div className="footer-links-group">
            <h4 className="text-sm fw-semibold">Colección</h4>
            <Link to="/shop?category=all" className="footer-link">Todo el Catálogo</Link>
            <Link to="/shop?category=remeras" className="footer-link">Remeras</Link>
            <Link to="/shop?category=bolsos" className="footer-link">Bolsos</Link>
          </div>

          <div className="footer-links-group">
            <h4 className="text-sm fw-semibold">Soporte</h4>
            <a href="#" className="footer-link">Preguntas Frecuentes</a>
            <a href="#" className="footer-link">Envíos y Devoluciones</a>
            <a href="#" className="footer-link">Contacto</a>
            <a href="#" className="footer-link">Guía de Talles</a>
          </div>

          <div className="footer-links-group">
            <h4 className="text-sm fw-semibold">Legal</h4>
            <a href="#" className="footer-link">Términos del Servicio</a>
            <a href="#" className="footer-link">Política de Privacidad</a>
          </div>
          
        </div>
        
        <div className="footer-bottom">
          <p className="text-xs text-muted">© {new Date().getFullYear()} Holy Drip. Todos los derechos reservados.</p>
          <p className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>Powered by Synaptix</p>
        </div>
      </div>
    </footer>
  );
};
