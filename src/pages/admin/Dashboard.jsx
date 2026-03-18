import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Package, ShoppingCart, Tag, ArrowUpRight, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Dashboard = () => {
  const { allProducts, allCategories: categories, orders, getVisitCount } = useData();
  const [visitFilter, setVisitFilter] = useState('month');
  const [visitCount, setVisitCount] = useState(0);
  const [orderFilter, setOrderFilter] = useState('month');

  useEffect(() => {
    getVisitCount(visitFilter).then(setVisitCount);
  }, [visitFilter]);

  const filterItemsByPeriod = (items, period) => {
    if (period === 'all') return items;
    const now = new Date();
    let threshold = new Date(now);
    if (period === 'week') threshold.setDate(now.getDate() - 7);
    else threshold.setDate(1); // month
    threshold.setHours(0, 0, 0, 0);

    return items.filter(item => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= threshold;
    });
  };

  const filteredOrders = filterItemsByPeriod(orders, orderFilter);

  const FilterButtons = ({ current, onChange, showAll = true }) => (
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange('week'); }}
        style={{
          fontSize: '0.65rem', padding: '2px 8px', borderRadius: '99px', border: '1px solid var(--border-color)',
          background: current === 'week' ? 'var(--text-primary)' : 'transparent',
          color: current === 'week' ? 'var(--bg-primary)' : 'var(--text-secondary)',
          cursor: 'pointer'
        }}
      >7 días</button>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange('month'); }}
        style={{
          fontSize: '0.65rem', padding: '2px 8px', borderRadius: '99px', border: '1px solid var(--border-color)',
          background: current === 'month' ? 'var(--text-primary)' : 'transparent',
          color: current === 'month' ? 'var(--bg-primary)' : 'var(--text-secondary)',
          cursor: 'pointer'
        }}
      >Mes</button>
      {showAll && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange('all'); }}
          style={{
            fontSize: '0.65rem', padding: '2px 8px', borderRadius: '99px', border: '1px solid var(--border-color)',
            background: current === 'all' ? 'var(--text-primary)' : 'transparent',
            color: current === 'all' ? 'var(--bg-primary)' : 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >Todos</button>
      )}
    </div>
  );

  const metrics = [
    {
      label: 'Visitas a la Tienda',
      value: visitCount.toString(),
      icon: <Store size={24} />,
      extra: <FilterButtons current={visitFilter} onChange={setVisitFilter} />
    },
    {
      label: 'Pedidos',
      value: filteredOrders.length.toString(),
      icon: <ShoppingCart size={24} />,
      path: '/admin/orders',
      extra: (
        <>
          <FilterButtons current={orderFilter} onChange={setOrderFilter} />
          <div className="text-xs text-muted mt-2">{filteredOrders.filter(o => o.status === 'en_espera').length} en espera</div>
        </>
      )
    },
    {
      label: 'Productos',
      value: allProducts.length.toString(),
      icon: <Package size={24} />,
      path: '/admin/products',
      extra: <div className="text-xs text-muted mt-1">{allProducts.filter(p => p.isVisible !== false).length} visibles</div>
    },
    {
      label: 'Categorías',
      value: categories.length.toString(),
      icon: <Tag size={24} />,
      path: '/admin/categories',
      extra: <div className="text-xs text-muted mt-1">{categories.filter(c => c.isVisible !== false).length} visibles</div>
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'vendido':
        return <span className="badge badge-success" style={{ width: 'fit-content' }}>Vendido</span>;
      case 'no_vendido':
        return <span className="badge" style={{ width: 'fit-content', backgroundColor: 'rgba(220,38,38,0.1)', color: '#dc2626' }}>No vendido</span>;
      default:
        return <span className="badge" style={{ width: 'fit-content', backgroundColor: 'rgba(255,149,0,0.1)', color: '#ff9500' }}>En espera</span>;
    }
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="admin-page">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl fw-semibold">Resumen General</h1>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {metrics.map((metric, idx) => {
          const CardContent = (
            <>
              <div className="metric-header">
                <span className="text-sm fw-medium text-muted">{metric.label}</span>
                <span className="metric-icon">{metric.icon}</span>
              </div>
              <div className="metric-body">
                <div className="text-3xl fw-bold">{metric.value}</div>
                {metric.extra}
              </div>
            </>
          );

          if (metric.path) {
            return (
              <Link key={idx} to={metric.path} className="metric-card glass-panel has-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                {CardContent}
              </Link>
            );
          }

          return (
            <div key={idx} className="metric-card glass-panel">
              {CardContent}
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid mt-8">
        {/* Recent Orders — real */}
        <div className="dashboard-panel glass-panel">
          <div className="panel-header">
            <h3 className="text-lg fw-semibold">Pedidos Recientes</h3>
            <Link to="/admin/orders" className="text-sm text-muted flex items-center hover-text-primary" style={{ textDecoration: 'none' }}>
              Ver Todos <ArrowUpRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="panel-body">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-muted">
                      Aún no hay pedidos registrados.
                    </td>
                  </tr>
                )}
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td className="fw-medium text-primary" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      #{order.id.slice(-6).toUpperCase()}
                    </td>
                    <td>{order.customerName || 'Sin nombre'}</td>
                    <td className="text-muted">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-PY') : '-'}
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td className="text-right fw-semibold">Gs. {Number(order.total).toLocaleString('es-PY')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
