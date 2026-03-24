import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import './ProductCard.css';

export const ProductCard = ({ product, showQuickAdd = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { cart, addToCart, updateQuantity } = useCart();
  const { id, name, price, images, isNew } = product;

  // Use second image on hover if available, else fallback to first
  const displayImage = isHovered && images.length > 1 ? images[1] : images[0];

  const cartItem = cart.find(item => item.id === id);

  return (
    <Link 
      to={`/product/${product.slug || id}`} 
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-card-image-wrap">
        {isNew && <span className="product-badge">New</span>}
        <img 
          src={displayImage} 
          alt={name} 
          className={`product-card-img ${isHovered && images.length > 1 ? 'is-hover' : ''}`} 
          loading="lazy"
        />

        {showQuickAdd && (
          <div className="quick-add-container">
            {cartItem ? (
              <div className="quick-add-controls">
                <button 
                  aria-label="Disminuir cantidad" 
                  className="quick-add-icon-btn"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    updateQuantity(id, cartItem.size, cartItem.color, cartItem.quantity - 1); 
                  }}
                >
                  <Minus size={16} />
                </button>
                <span className="quick-add-qty">{cartItem.quantity}</span>
                <button 
                  aria-label="Aumentar cantidad" 
                  className="quick-add-icon-btn"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    updateQuantity(id, cartItem.size, cartItem.color, cartItem.quantity + 1); 
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button 
                className="quick-add-btn"
                aria-label="Añadir al carrito"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const defaultSize = product.sizes?.[0] || null;
                  const defaultColor = product.colors?.[0]?.id || null;
                  addToCart(product, 1, defaultSize, defaultColor, true);
                }}
              >
                <ShoppingCart size={18} />
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="product-card-info">
        <h3 className="text-sm fw-medium">{name}</h3>
        <p className="text-sm text-muted">Gs. {Number(price).toLocaleString('es-PY')}</p>
      </div>
    </Link>
  );
};
