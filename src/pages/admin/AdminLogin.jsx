import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export const AdminLogin = () => {
  const { login, isAuthorized, authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (authLoading) return null;
  if (isAuthorized) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      if (err.message === 'ACCESO DENEGADO' || err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('ACCESO DENEGADO');
      } else {
        setError('ACCESO DENEGADO');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '2rem'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/images/logo.png"
            alt="Holy Drip"
            style={{ height: '36px', marginBottom: '1.5rem', filter: 'var(--logo-filter, none)' }}
          />
          <h1 className="text-2xl fw-semibold">Panel Admin</h1>
          <p className="text-sm text-muted" style={{ marginTop: '0.5rem' }}>Acceso restringido</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <p style={{ color: '#dc2626', fontWeight: '700', fontSize: '1rem', letterSpacing: '0.05em' }}>
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="text-sm fw-medium" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@email.com"
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="text-sm fw-medium" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Contraseña
            </label>
            <input
              type="password"
              className="form-input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <Button variant="primary" size="lg" fullWidth type="submit" loading={loading}>
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
};
