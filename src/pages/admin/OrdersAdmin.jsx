import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, CheckCircle, Clock, XCircle } from 'lucide-react';
import './Admin.css';

export const OrdersAdmin = () => {
  const { orders, updateOrderStatus } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'vendido':
        return (
          <span className="badge badge-success flex items-center gap-1" style={{ width: 'fit-content' }}>
            <CheckCircle size={12} /> Vendido
          </span>
        );
      case 'no_vendido':
        return (
          <span className="badge flex items-center gap-1" style={{ width: 'fit-content', backgroundColor: 'rgba(220,38,38,0.1)', color: '#dc2626' }}>
            <XCircle size={12} /> No vendido
          </span>
        );
      default:
        return (
          <span className="badge flex items-center gap-1" style={{ width: 'fit-content', backgroundColor: 'rgba(255,149,0,0.1)', color: '#ff9500' }}>
            <Clock size={12} /> En espera
          </span>
        );
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      alert('Error al actualizar estado: ' + err.message);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-page">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl fw-semibold">Pedidos</h1>
          <p className="text-sm text-muted mt-1">Gestiona los pedidos de tus clientes y sus estados.</p>
        </div>
      </div>

      <div className="dashboard-panel glass-panel">
        <div className="panel-header" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} className="text-muted" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar por ID, nombre o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem', height: '2.5rem' }}
            />
          </div>
          <select
            className="form-input"
            style={{ height: '2.5rem', width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="en_espera">En espera</option>
            <option value="vendido">Vendido</option>
            <option value="no_vendido">No vendido</option>
          </select>
        </div>

        <div className="panel-body">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Teléfono</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th className="text-right">Cambiar Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td className="fw-medium" style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                      #{order.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="text-muted">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-PY') : '-'}
                    </td>
                    <td className="fw-medium">{order.customerName || 'Desconocido'}</td>
                    <td className="text-muted">{order.customerPhone || '-'}</td>
                    <td className="text-sm text-muted">
                      {Array.isArray(order.items) ? `${order.items.length} artículo${order.items.length !== 1 ? 's' : ''}` : '-'}
                    </td>
                    <td className="fw-semibold">Gs. {Number(order.total || 0).toLocaleString('es-PY')}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td className="text-right">
                      <select
                        className="form-input"
                        style={{ height: '2rem', width: 'auto', fontSize: '0.75rem', padding: '0 0.5rem' }}
                        value={order.status || 'en_espera'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="en_espera">En espera</option>
                        <option value="vendido">Vendido</option>
                        <option value="no_vendido">No vendido</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-muted">
                      {searchQuery || statusFilter !== 'all'
                        ? 'No se encontraron pedidos con ese filtro.'
                        : 'Aún no hay pedidos registrados. Se guardarán automáticamente cuando un cliente confirme por WhatsApp.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
