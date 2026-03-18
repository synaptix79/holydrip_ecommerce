import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import './CartDrawer.css';

export const CartDrawer = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    subtotal 
  } = useCart();
  
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div 
        className={`cart-backdrop ${isCartOpen ? 'is-visible' : ''}`} 
        onClick={() => setIsCartOpen(false)}
      />

      <div className={`cart-drawer ${isCartOpen ? 'is-open' : ''}`}>
        
        <div className="cart-header">
          <h2 className="text-xl fw-semibold">Tu Carrito</h2>
          <button 
            className="cart-close-btn" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Cerrar carrito"
          >
            <X size={24} />
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={48} className="text-muted mb-4 mx-auto" strokeWidth={1} />
              <p className="text-muted">Tu carrito está vacío.</p>
              <Button 
                variant="secondary" 
                className="mt-6" 
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
              >
                Seguir Comprando
              </Button>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map((item, idx) => (
                <div key={`${item.id}-${item.size}-${item.color}-${idx}`} className="cart-item">
                  
                  <div className="cart-item-img-wrap">
                    <img src={item.images[0]} alt={item.name} className="cart-item-img" />
                  </div>
                  
                  <div className="cart-item-details">
                    <div className="cart-item-top">
                      <div>
                        <h4 className="text-sm fw-medium">{item.name}</h4>
                        <p className="text-xs text-muted mt-1">
                          {item.color && <span className="mr-2">Color: {item.colors?.find(c => c.id === item.color)?.name || item.color}</span>}
                          {item.size && <span>Talle: {item.size}</span>}
                        </p>
                      </div>
                      <button 
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        aria-label="Eliminar producto"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="cart-item-bottom">
                      <div className="cart-qty-control">
                        <button 
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="cart-qty-val text-sm">{item.quantity}</span>
                        <button 
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="fw-medium text-sm">Gs. {(item.price * item.quantity).toLocaleString('es-PY')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span className="text-muted">Subtotal</span>
              <span className="fw-semibold text-lg">Gs. {subtotal.toLocaleString('es-PY')}</span>
            </div>
            <p className="text-xs text-muted mb-4">El envío y los impuestos se calculan en el checkout.</p>
            <Button variant="primary" size="lg" fullWidth onClick={handleCheckout}>
              Proceder al Pago
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
