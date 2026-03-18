import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

export const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { id, name, price, images, isNew } = product;

  // Use second image on hover if available, else fallback to first
  const displayImage = isHovered && images.length > 1 ? images[1] : images[0];

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
      </div>
      
      <div className="product-card-info">
        <h3 className="text-sm fw-medium">{name}</h3>
        <p className="text-sm text-muted">Gs. {Number(price).toLocaleString('es-PY')}</p>
      </div>
    </Link>
  );
};
