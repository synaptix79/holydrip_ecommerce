import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, CheckCircle, Clock, XCircle, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import './Admin.css';

export const OrdersAdmin = () => {
  const { orders, updateOrderStatus } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

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
    
    let matchesDate = true;
    if (dateFilter !== 'all' && o.createdAt) {
      const orderDate = new Date(o.createdAt);
      const now = new Date();
      if (dateFilter === 'week') {
        const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        matchesDate = orderDate >= oneWeekAgo;
      } else if (dateFilter === 'month') {
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        matchesDate = orderDate >= oneMonthAgo;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const exportToExcel = () => {
    const getStatusLabel = (s) => {
      if (s === 'vendido') return 'Vendido';
      if (s === 'no_vendido') return 'No vendido';
      return 'En espera';
    };

    const exportData = filteredOrders.map(o => {
      const itemsString = Array.isArray(o.items) 
        ? o.items.map(i => `${i.quantity}x ${i.name} ${i.size ? '('+i.size+') ' : ''}${i.color || ''}`.trim()).join(' | ') 
        : '';

      return {
        'ID Pedido': o.id.slice(-6).toUpperCase(),
        'Fecha': o.createdAt ? new Date(o.createdAt).toLocaleString('es-PY') : '',
        'Cliente': o.customerName || 'Desconocido',
        'Teléfono': o.customerPhone || '',
        'RUC': o.customerRUC || '',
        'Artículos': itemsString,
        'Total (Gs)': o.total || 0,
        'Estado': getStatusLabel(o.status)
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos");
    XLSX.writeFile(workbook, `Pedidos_HolyDrip_${new Date().toLocaleDateString('es-PY').replace(/\//g, '-')}.xlsx`);
  };

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
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              className="form-input"
              style={{ height: '2.5rem', width: 'auto' }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">Todas las fechas</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
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
            <button
              onClick={exportToExcel}
              className="action-btn"
              style={{ height: '2.5rem', padding: '0 1rem', display: 'flex', gap: '0.5rem', width: 'auto', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
              title="Exportar a Excel"
            >
              <Download size={16} /> Exportar
            </button>
          </div>
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
                  <th>RUC</th>
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
                    <td className="text-muted">{order.customerRUC || '-'}</td>
                    <td className="text-xs text-muted" style={{ maxWidth: '240px', whiteSpace: 'normal', lineHeight: '1.4' }}>
                      {Array.isArray(order.items) 
                        ? order.items.map((i, idx) => <span key={idx} style={{display:'block'}}>&bull; {i.quantity}x {i.name} <span style={{opacity:0.7}}>({i.size ? i.size + ' ' : ''}{i.color || ''})</span></span>)
                        : '-'}
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
                    <td colSpan="9" className="text-center py-8 text-muted">
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
