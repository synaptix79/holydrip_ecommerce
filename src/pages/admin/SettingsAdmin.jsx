import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui/Button';
import { Save, Lock, Bell, Palette, Truck, User, Settings, Phone, Plus, X } from 'lucide-react';
import './Admin.css';

export const SettingsAdmin = () => {
  const { settings, updateSettings } = useData();
  const { isDark, toggleTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    storeName: 'Holy Drip',
    currency: 'Gs.',
    whatsappNumber: '595983568073',
    shippingCost: 25000,
    freeShippingThreshold: 250000,
    email: 'admin@holydrip.com',
    adminEmails: ['', ''],
    notifications: {
      newOrder: true,
      lowStock: true,
      newsletter: false
    }
  });

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...settings,
        adminEmails: settings.adminEmails || ['', ''],
        notifications: {
          ...prev.notifications,
          ...(settings.notifications || {})
        }
      }));
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Limpiar emails vacíos antes de guardar
      const cleanedData = {
        ...formData,
        adminEmails: formData.adminEmails.filter(e => e && e.trim())
      };
      await updateSettings(cleanedData);
      alert('Ajustes guardados con éxito.');
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    }
  };

  const handleAdminEmailChange = (index, value) => {
    const updated = [...formData.adminEmails];
    updated[index] = value;
    setFormData({ ...formData, adminEmails: updated });
  };

  return (
    <div className="admin-page">
      <div className="mb-8">
        <h1 className="text-3xl fw-semibold">Ajustes</h1>
        <p className="text-sm text-muted mt-1">Configura las preferencias de tu tienda y cuenta.</p>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', gap: '2rem' }}>
        
        {/* Generales */}
        <div className="dashboard-panel glass-panel">
          <div className="panel-header" style={{ padding: '1.25rem 1.5rem' }}>
            <h3 className="text-lg fw-medium flex items-center gap-2"><Settings size={18} /> Tienda (Generales)</h3>
          </div>
          <div className="panel-body" style={{ padding: '1.5rem' }}>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md-grid-cols-2 gap-4">
              <div>
                <label className="text-sm fw-medium mb-2 block">Nombre de la Tienda</label>
                <input 
                  type="text" 
                  value={formData.storeName} 
                  onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                  className="form-input w-full" 
                />
              </div>
              <div>
                <label className="text-sm fw-medium mb-2 block">Moneda Principal</label>
                <select 
                  value={formData.currency} 
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  className="form-input w-full"
                >
                  <option value="Gs.">Guaraní (Gs.)</option>
                  <option value="USD">Dólar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="ARS">Peso Argentino (ARS)</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="text-sm fw-medium mb-2 block flex items-center gap-2">
                  <Phone size={14} /> WhatsApp para Pedidos (con código de país)
                </label>
                <input 
                  type="text" 
                  value={formData.whatsappNumber} 
                  onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                  className="form-input w-full" 
                  placeholder="Ej: 595983568073"
                />
              </div>
              <div className="md-grid-cols-2" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                <Button variant="primary" type="submit"><Save size={18} /> Guardar Ajustes</Button>
              </div>
            </form>
          </div>
        </div>

        {/* Cuenta & Seguridad con Admins Extra */}
        <div className="dashboard-panel glass-panel">
          <div className="panel-header" style={{ padding: '1.25rem 1.5rem' }}>
            <h3 className="text-lg fw-medium flex items-center gap-2"><Lock size={18} /> Cuenta & Seguridad</h3>
          </div>
          <div className="panel-body" style={{ padding: '1.5rem' }}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm fw-medium mb-2 block">Admin Principal</label>
                <input 
                  type="email" 
                  value="synaptixenterprise@gmail.com"
                  className="form-input w-full" 
                  disabled
                  style={{ opacity: 0.6 }}
                />
                <p className="text-xs text-muted mt-1">Este correo siempre tiene acceso y no se puede quitar.</p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <label className="text-sm fw-medium mb-3 block flex items-center gap-2">
                  <User size={14} /> Administradores Adicionales (máximo 2)
                </label>
                <p className="text-xs text-muted mb-3">
                  Estos correos también podrán iniciar sesión y administrar la tienda.
                  Deben tener una cuenta de acceso creada en el sistema.
                </p>
                {[0, 1].map(idx => (
                  <div key={idx} className="flex gap-2 mb-3 items-center">
                    <input
                      type="email"
                      value={formData.adminEmails[idx] || ''}
                      onChange={(e) => handleAdminEmailChange(idx, e.target.value)}
                      className="form-input w-full"
                      placeholder={`Correo admin extra ${idx + 1} (opcional)`}
                    />
                    {formData.adminEmails[idx] && (
                      <button 
                        type="button"
                        className="action-btn danger"
                        onClick={() => handleAdminEmailChange(idx, '')}
                        title="Quitar"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="text-sm fw-medium mb-2 block">Email de Contacto</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="form-input w-full" 
                />
              </div>
              <div>
                <label className="text-sm fw-medium mb-2 block">Contraseña</label>
                <input 
                  type="password" 
                  placeholder="Configurado en el sistema central..."
                  className="form-input w-full" 
                  disabled
                />
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <Button variant="secondary" onClick={handleSubmit}><Save size={18} /> Guardar Seguridad</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Envíos */}
        <div className="dashboard-panel glass-panel">
          <div className="panel-header" style={{ padding: '1.25rem 1.5rem' }}>
            <h3 className="text-lg fw-medium flex items-center gap-2"><Truck size={18} /> Logística y Envíos</h3>
          </div>
          <div className="panel-body" style={{ padding: '1.5rem' }}>
            <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
              <div>
                <label className="text-sm fw-medium mb-2 block">Costo de Envío Base ({formData.currency})</label>
                <input 
                  type="number" 
                  value={formData.shippingCost} 
                  onChange={(e) => setFormData({...formData, shippingCost: e.target.value})}
                  className="form-input w-full" 
                />
              </div>
              <div>
                <label className="text-sm fw-medium mb-2 block">Envío Gratis a partir de ({formData.currency})</label>
                <input 
                  type="number" 
                  value={formData.freeShippingThreshold} 
                  onChange={(e) => setFormData({...formData, freeShippingThreshold: e.target.value})}
                  className="form-input w-full" 
                />
              </div>
              <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                <Button variant="secondary" onClick={handleSubmit}>Guardar Costos</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Apariencia y Notificaciones */}
        <div className="grid grid-cols-1 md-grid-cols-2 gap-8">
          
          {/* Apariencia */}
          <div className="dashboard-panel glass-panel">
            <div className="panel-header" style={{ padding: '1.25rem 1.5rem' }}>
              <h3 className="text-lg fw-medium flex items-center gap-2"><Palette size={18} /> Apariencia</h3>
            </div>
            <div className="panel-body" style={{ padding: '1.5rem' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="fw-medium">Tema Oscuro</p>
                  <p className="text-sm text-muted mt-1">Forzar modo oscuro en admin.</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  style={{
                    width: '44px', height: '26px', borderRadius: '13px',
                    backgroundColor: isDark ? 'var(--text-primary)' : 'var(--border-color)',
                    position: 'relative', cursor: 'pointer', border: 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--bg-primary)',
                    position: 'absolute', top: '3px', left: isDark ? '21px' : '3px', transition: 'left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </button>
              </div>
            </div>
          </div>

          {/* Alertas */}
          <div className="dashboard-panel glass-panel">
            <div className="panel-header" style={{ padding: '1.25rem 1.5rem' }}>
              <h3 className="text-lg fw-medium flex items-center gap-2"><Bell size={18} /> Alertas</h3>
            </div>
            <div className="panel-body" style={{ padding: '1.5rem' }}>
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.notifications.newOrder} onChange={() => setFormData({...formData, notifications: {...formData.notifications, newOrder: !formData.notifications.newOrder}})} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--text-primary)' }} />
                  <span className="text-sm">Alertas por nuevos pedidos</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.notifications.lowStock} onChange={() => setFormData({...formData, notifications: {...formData.notifications, lowStock: !formData.notifications.lowStock}})} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--text-primary)' }} />
                  <span className="text-sm">Avisos de stock bajo</span>
                </label>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};
