import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import './ProductDetail.css';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useData();
  
  const product = (products || []).find(p => p.id === id || p.slug === id);
  
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setActiveImage(0);
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0]?.id);
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <h2>Producto no encontrado</h2>
        <Button className="mt-4" onClick={() => navigate('/shop')}>Volver a la Tienda</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const nextImage = () => setActiveImage((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);

  return (
    <div className="product-detail-page">
      <div className="container">
        
        {/* Breadcrumbs */}
        <div className="breadcrumbs mb-8">
          <span className="text-muted cursor-pointer" onClick={() => navigate('/shop')}>Tienda</span>
          <span className="mx-2 text-muted">/</span>
          <span className="text-muted capitalize cursor-pointer" onClick={() => navigate(`/shop?category=${product.category}`)}>{product.category}</span>
          <span className="mx-2 text-muted">/</span>
          <span className="fw-medium">{product.name}</span>
        </div>

        <div className="product-detail-grid">
          
          <div className="product-gallery">
            <div className="main-image-wrap">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="main-image"
              />
              
              {product.images.length > 1 && (
                <div className="gallery-nav">
                  <button className="gallery-btn" onClick={prevImage} aria-label="Imagen anterior"><ChevronLeft size={20} /></button>
                  <button className="gallery-btn" onClick={nextImage} aria-label="Siguiente imagen"><ChevronRight size={20} /></button>
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="thumbnail-list">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    className={`thumbnail-btn ${activeImage === idx ? 'is-active' : ''}`}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img src={img} alt={`Miniatura ${idx + 1}`} className="thumbnail-img" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info-panel">
            {product.isNew && <span className="badge badge-new mb-4">Nuevo Ingreso</span>}
            <h1 className="text-4xl mb-2">{product.name}</h1>
            <p className="text-2xl text-muted mb-6">Gs. {Number(product.price).toLocaleString('es-PY')}</p>
            
            <p className="description text-base text-secondary mb-8">
              {product.description}
            </p>

            <div className="selectors-group">
              
              {product.colors && product.colors.length > 0 && (
                <div className="selector-block">
                  <div className="selector-header">
                    <span className="fw-medium">Color:</span>
                    <span className="text-muted ml-2">{product.colors.find(c => c.id === selectedColor)?.name}</span>
                  </div>
                  <div className="color-options">
                    {product.colors.map(color => (
                      <button
                        key={color.id}
                        className={`color-swatch-wrap ${selectedColor === color.id ? 'is-selected' : ''}`}
                        onClick={() => setSelectedColor(color.id)}
                        aria-label={`Seleccionar color ${color.name}`}
                      >
                        <span className="color-swatch" style={{ backgroundColor: color.hex }}></span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div className="selector-block">
                  <div className="selector-header">
                    <span className="fw-medium">Talle</span>
                    <button className="text-sm underline text-muted">Guía de Talles</button>
                  </div>
                  <div className="size-options">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        className={`size-btn ${selectedSize === size ? 'is-selected' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="selector-block">
                <span className="fw-medium mb-2 block">Cantidad</span>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                  <span className="qty-value">{quantity}</span>
                  <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
                </div>
              </div>

            </div>

            <div className="action-area mt-8">
              <Button 
                variant="primary" 
                size="lg" 
                fullWidth 
                onClick={handleAddToCart}
                disabled={
                  (product.sizes?.length > 0 && !selectedSize) || 
                  (product.colors?.length > 0 && !selectedColor)
                }
              >
                Agregar al Carrito — Gs. {(product.price * quantity).toLocaleString('es-PY')}
              </Button>
              
              <div className="shipping-info mt-6 text-sm text-secondary">
                <p>Envío rápido gratuito en compras superiores a Gs. 250.000.</p>
                <p>Devoluciones gratuitas dentro de los primeros 14 días.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
