import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Tag, Settings, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import '../layout/Navbar.css'; // Reusing exact navbar styles
import './AdminLayout.css';
import '../../pages/admin/Admin.css';
export const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const location = useLocation();

  const closeMenu = () => setIsMobileMenuOpen(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Productos', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Pedidos', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Categorías', path: '/admin/categories', icon: <Tag size={20} /> },
    { name: 'Ajustes', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="admin-container">
      
      {/* Top Navigation Bar (Identical to Public Navbar) */}
      <header className="navbar navbar-scrolled" style={{ position: 'sticky' }}>
        <div className="navbar-container" style={{ maxWidth: '1400px' }}>
          
          <div className="navbar-logo-container">
            <button className="navbar-logo text-white" aria-label="Volver arriba" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src="/images/logo.png" alt="Holy Drip Logo" style={{ height: '32px', filter: isDark ? 'invert(1)' : 'none' }} />
            </button>
            <span className="desktop-only text-xs text-muted fw-semibold ml-4 border border-color px-2 rounded-full" style={{ padding: '0.1rem 0.5rem', borderRadius: '99px', border: '1px solid var(--border-color)', marginLeft: '1rem', color: 'var(--text-secondary)' }}>ADMIN</span>
          </div>

          <nav className="navbar-links desktop-only">
            {navItems.map(item => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={`nav-link`}
                  style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="navbar-actions border-left-mobile">
             <button className="navbar-icon-btn" onClick={toggleTheme} aria-label="Cambiar tema">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="admin-avatar desktop-only" style={{ marginLeft: '1rem', width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}>
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <button 
              onClick={logout}
              className="navbar-icon-btn desktop-only text-muted"
              title="Cerrar Sesión"
              style={{ marginLeft: '0.25rem' }}
            >
              <LogOut size={20} />
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
            {navItems.map(item => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className="mobile-nav-link text-xl"
                  style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              )
            })}
             <button 
                onClick={() => { closeMenu(); logout(); }} 
                className="mobile-nav-link text-xl text-muted"
                style={{ width: 'auto', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', font: 'inherit' }}
              >
                Cerrar Sesión
              </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="admin-main-content" style={{ minHeight: 'calc(100vh - var(--nav-height))' }}>
        <div className="admin-content-inner">
          <Outlet />
        </div>
      </main>

    </div>
  );
};
