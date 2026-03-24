import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { MessageSquare, CreditCard, User, Phone } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import './Checkout.css';

export const Checkout = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { settings, addOrder } = useData();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerRUC, setCustomerRUC] = useState('');

  const parseGs = (val, defaultVal) => {
    if (val === undefined || val === null || val === '') return defaultVal;
    const cleaned = String(val).replace(/\D/g, '');
    const num = Number(cleaned);
    return cleaned === '' ? defaultVal : num;
  };

  const shippingThreshold = parseGs(settings?.freeShippingThreshold, 250000);
  const shippingCost = parseGs(settings?.shippingCost, 25000);
  const shipping = subtotal >= shippingThreshold ? 0 : shippingCost;
  const total = subtotal + shipping;
  const currency = settings?.currency || 'Gs.';
  const whatsappNumber = settings?.whatsappNumber || '595983568073';

  const handleWhatsAppCheckout = async () => {
    if (!customerName.trim()) {
      alert('Por favor ingresá tu nombre.');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Por favor ingresá tu número de teléfono.');
      return;
    }

    setIsSubmitting(true);

    // Build order data
    const orderData = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim() || null,
      customerRUC: customerRUC.trim() || null,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        size: item.size || null,
        color: item.colors?.find(c => c.id === item.color)?.name || item.color || null,
        quantity: item.quantity,
        price: item.price,
        image: item.images?.[0] || null
      })),
      total,
      currency,
      status: 'en_espera',
      createdAt: Date.now()
    };

    // 1. Save order to Firestore first - MANDATORY
    let orderId = null;
    try {
      orderId = await addOrder(orderData);
    } catch (err) {
      console.error('Error guardando pedido:', err);
      alert('Hubo un problema al procesar tu pedido en el sistema. Por favor intenta de nuevo.');
      setIsSubmitting(false);
      return;
    }

    // 2. Build WhatsApp message
    let message = `*NUEVO PEDIDO - HOLY DRIP*\n\n`;
    message += `*Cliente:* ${customerName.trim()}\n`;
    message += `*Teléfono:* ${customerPhone.trim()}\n`;
    if (customerAddress.trim()) {
      message += `*Dirección:* ${customerAddress.trim()}\n`;
    }
    if (customerRUC.trim()) {
      message += `*RUC:* ${customerRUC.trim()}\n`;
    }
    message += `*ID:* #${orderId.slice(-6).toUpperCase()}\n`;
    message += `\n*Detalle del pedido:*\n\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Talle: ${item.size}\n`;
      message += `   Color: ${item.colors?.find(c => c.id === item.color)?.name || item.color}\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio: ${currency} ${Number(item.price).toLocaleString('es-PY')}\n\n`;
    });

    message += `*Envío:* ${shipping === 0 ? 'Gratis' : `${currency} ${Number(shipping).toLocaleString('es-PY')}`}\n`;
    message += `*TOTAL: ${currency} ${Number(total).toLocaleString('es-PY')}*\n\n`;
    message += `*Alias de transferencia:* 986480460 - Numero de Telefono\n\n`;
    message += `_Espero su confirmación de stock para realizar el pago._`;

    // 3. Open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

    // 4. Clear cart and redirect
    setTimeout(() => {
      clearCart();
      setIsSubmitting(false);
      navigate('/');
    }, 1000);
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', textAlign: 'center' }}>
        <h2 className="text-2xl mb-4">Tu carrito está vacío</h2>
        <Button onClick={() => navigate('/shop')}>Volver a la Tienda</Button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <SEOHead title="Checkout | Finalizar Compra" description="Finalizá tu compra de forma segura y coordiná el envío de tus prendas Holy Drip." />
      <div className="container">
        <h1 className="text-3xl mb-8">Confirmar Pedido</h1>

        <div className="checkout-grid">

          <div className="checkout-form-section">
            <div className="glass-panel checkout-panel">
              {/* Customer data */}
              <h3 className="text-xl fw-medium mb-4 flex items-center gap-2">
                <User size={18} /> Tus Datos
              </h3>
              <div className="form-group mb-4">
                <label className="text-sm fw-medium mb-2 block">Nombre completo *</label>
                <input
                  type="text"
                  className="form-input w-full"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Juan Pérez"
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label className="text-sm fw-medium mb-2 block flex items-center gap-1"><Phone size={13}/> Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  className="form-input w-full"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="Ej: 0981 123456"
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label className="text-sm fw-medium mb-2 block">Dirección de entrega (opcional)</label>
                <input
                  type="text"
                  className="form-input w-full"
                  value={customerAddress}
                  onChange={e => setCustomerAddress(e.target.value)}
                  placeholder="Ciudad, barrio, calle..."
                />
              </div>
              <div className="form-group mb-8">
                <label className="text-sm fw-medium mb-2 block">RUC/CI para Facturación (opcional)</label>
                <input
                  type="text"
                  className="form-input w-full"
                  value={customerRUC}
                  onChange={e => setCustomerRUC(e.target.value)}
                  placeholder="Ej: 80012345-6 / 4567890"
                />
              </div>

              {/* Payment info */}
              <div className="form-group mb-6">
                <h3 className="text-lg fw-medium mb-3 flex items-center gap-2">
                  <CreditCard size={18} /> Información de Pago
                </h3>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', width: '100%', boxSizing: 'border-box' }}>
                  <p className="text-sm fw-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Alias para transferencia:</p>
                  <p className="text-xl fw-bold" style={{ letterSpacing: '0.02em', wordBreak: 'break-word', overflowWrap: 'break-word' }}>986480460 - Numero de Telefono</p>
                  <p className="text-xs text-muted mt-2">Enviá el comprobante por WhatsApp luego de coordinar.</p>
                </div>
              </div>

              <ul className="text-sm text-muted mb-8" style={{ paddingLeft: '1.2rem', lineHeight: '1.8' }}>
                <li>Hacé clic en el botón de abajo para enviarnos tu pedido.</li>
                <li>Te confirmaremos el stock disponible inmediatamente.</li>
                <li>Realizás el pago al alias <b>986480460 - Numero de Telefono</b> y nos enviás el comprobante.</li>
              </ul>

              <Button
                onClick={handleWhatsAppCheckout}
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
                style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', height: 'auto', minHeight: '60px', fontSize: '1rem', whiteSpace: 'normal', wordBreak: 'break-word', padding: '0.75rem', lineHeight: '1.4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <MessageSquare size={20} style={{ marginRight: '8px', flexShrink: 0 }} />
                <span style={{ flex: 1 }}>Confirmar Pedido por WhatsApp</span>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary-section">
            <div className="summary-panel glass-panel">
              <h3 className="text-lg fw-medium mb-6">Resumen del Pedido</h3>

              <div className="summary-items mb-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="summary-item">
                    <div className="summary-item-img-wrap">
                      <span className="summary-item-qty">{item.quantity}</span>
                      <img src={item.images[0]} alt={item.name} className="summary-item-img" />
                    </div>
                    <div className="summary-item-info">
                      <h4 className="text-sm fw-medium">{item.name}</h4>
                      <p className="text-xs text-muted">
                        {item.size} / {item.colors?.find(c => c.id === item.color)?.name || item.color}
                      </p>
                    </div>
                    <div className="summary-item-price text-sm fw-medium">
                      {currency} {(item.price * item.quantity).toLocaleString('es-PY')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span className="text-muted">Subtotal</span>
                  <span>{currency} {subtotal.toLocaleString('es-PY')}</span>
                </div>
                <div className="summary-row">
                  <span className="text-muted">Envío</span>
                  <span>{shipping === 0 ? 'Gratis' : `${currency} ${Number(shipping).toLocaleString('es-PY')}`}</span>
                </div>
                <div className="summary-row total-row mt-4 pt-4 border-t border-color">
                  <span className="text-lg fw-semibold">Total</span>
                  <span className="text-xl fw-semibold">{currency} {total.toLocaleString('es-PY')}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
