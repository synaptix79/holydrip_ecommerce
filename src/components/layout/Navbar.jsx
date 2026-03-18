import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { totalItems, toggleCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determinar si pasamos de 20px (para estilos como border o sombra)
      setIsScrolled(currentScrollY > 20);
      
      // Lógica de ocultar/mostrar Navbar al scrollear
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        // Scrolleando hacia ABAJO: ocultamos el navbar (si menú mobile está cerrado)
        if (!isMobileMenuOpen) setIsHidden(true);
      } else {
        // Scrolleando hacia ARRIBA o en el tope: mostramos el navbar
        setIsHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobileMenuOpen]);

  return (
    <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''} ${isHidden ? 'navbar-hidden' : ''}`}>
      <div className="navbar-container">
        
        <div className="navbar-logo-container">
          <Link to="/" className="navbar-logo text-white" aria-label="Ir al inicio" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'none' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/images/logo.png" alt="Holy Drip Logo" style={{ height: '32px', filter: isDark ? 'invert(1)' : 'none' }} />
          </Link>
        </div>
        
        <nav className="navbar-links desktop-only">
          <Link to="/shop" className="nav-link">Tienda</Link>
          <Link to="/shop?category=remeras" className="nav-link">Remeras</Link>
          <Link to="/shop?category=bolsos" className="nav-link">Bolsos</Link>
          <Link to="/shop?category=stickers" className="nav-link">Stickers</Link>
          <Link to="/nosotros" className="nav-link">Nosotros</Link>
        </nav>

        <div className="navbar-actions border-left-mobile">
          <button className="navbar-icon-btn" onClick={toggleTheme} aria-label="Cambiar tema">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="navbar-icon-btn cart-btn" onClick={toggleCart} aria-label="Carrito">
            <ShoppingBag size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
          
          <button 
            className="navbar-icon-btn mobile-only menu-btn-right" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'is-open' : ''}`}>
        <div className="mobile-menu-inner">
          <Link to="/shop" className="mobile-nav-link text-xl">Tienda</Link>
          <Link to="/shop?category=remeras" className="mobile-nav-link text-xl">Remeras</Link>
          <Link to="/shop?category=bolsos" className="mobile-nav-link text-xl">Bolsos</Link>
          <Link to="/shop?category=stickers" className="mobile-nav-link text-xl">Stickers</Link>
          <Link to="/nosotros" className="mobile-nav-link text-xl">Nosotros</Link>
        </div>
      </div>
    </header>
  );
};
