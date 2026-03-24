import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/ui/ProductCard';
import { bibleVerses } from '../data/bibleVerses';
import { useData } from '../context/DataContext';
import { SEOHead } from '../components/common/SEOHead';
import './Home.css';

export const Home = () => {
  const { products, categories } = useData();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [randomVerse, setRandomVerse] = useState('');

  const heroImages = [
    "/images/Remera%20Marron%20Claro%20H%20Frente.jpeg",
    "/images/Remera%20Negra.jpeg",
    "/images/Bolso%20y%20ropa.jpeg",
    "/images/Remera%20Blanca%20A.jpeg",
    "/images/Remera%20Beige.jpeg"
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * bibleVerses.length);
    setRandomVerse(bibleVerses[randomIndex]);

    const interval = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const featuredProducts = (products || []).filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = (products || []).filter(p => p.isNew).slice(0, 4);

  // Imagen fallback por categoría (por slug / id)
  const categoryFallbackImages = {
    'remeras': '/images/Remera%20Marron%20Claro%20H%20Frente.jpeg',
    'bolsos': '/images/Bolso%20y%20ropa.jpeg',
    'stickers': '/images/Remera%20Blanca%20A.jpeg'
  };

  return (
    <div className="home-page">
      <SEOHead title="Holy Drip" description="Holy Drip. Vestí con propósito. Ropa Cristiana Urbana y minimalista con estética moderna y versículos que inspiran." />
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          {heroImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Fondo de portada ${idx + 1}`}
              className={`hero-img ${idx === currentHeroIndex ? 'active' : ''}`}
            />
          ))}
          <div className="hero-overlay"></div>
        </div>

        <div className="container" style={{ height: '100%', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
          <div className="hero-verse-container">
            {randomVerse && (
              <div className="verse-block glass-panel">
                <p className="verse-text">{randomVerse.split(' — ')[1]}</p>
                <span className="verse-ref">{randomVerse.split(' — ')[0]}</span>
              </div>
            )}
          </div>
          <div className="hero-content">
            <h1 className="hero-title text-5xl">Vestí con<br />propósito.</h1>
            <p className="hero-subtitle text-lg">Indumentaria Premium diseñada para reflejar tu esencia y propósito</p>
            <div className="hero-actions">
              <Link to="/shop">
                <Button variant="primary" size="lg">Ver Colección</Button>
              </Link>
              <Button 
                variant="secondary" 
                className="glass-btn" 
                size="lg"
                onClick={() => {
                  const el = document.getElementById('new-arrivals');
                  if(el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Recién Llegado
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <h2 className="text-3xl">Vestí con proposito</h2>
            <Link to="/shop" className="text-sm fw-medium link-with-arrow">Ver Todo</Link>
          </div>

          <div className="product-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} showQuickAdd={false} />
            ))}
            {featuredProducts.length === 0 && (
              <p className="text-muted text-sm">Aún no hay productos destacados.</p>
            )}
          </div>
        </div>
      </section>

      {/* Categories Banner — solo categorías visibles desde Firestore */}
      {categories.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container">
            <div className="categories-grid">
              {categories.map((category) => {
                // Si la categoría tiene imagen guardada en Firestore, usarla. Si no, fallback por slug.
                const imgUrl = category.image || categoryFallbackImages[category.id] || '/images/Remera%20Blanca%20A.jpeg';
                return (
                  <Link to={`/shop?category=${category.id}`} key={category.id} className="category-card">
                    <img
                      src={imgUrl}
                      alt={category.name}
                      className="category-img"
                    />
                    <div className="category-content glass-panel">
                      <h3 className="fw-semibold">{category.name}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Brand Identity */}
      <section className="section-padding brand-section">
        <div className="container">
          <div className="brand-grid">
            <div className="brand-text">
              <h2 className="text-4xl">La Filosofía Holy Drip</h2>
              <p className="text-lg text-muted mt-4">
                Creemos que la ropa es una forma de expresar lo que llevás por dentro. Por eso todo lo que creamos está diseñado con un propósito; reflejar tu esencia, tu fe y tu identidad, combinando materiales de primera línea, confección impecable y una estética minimalista que perdura temporada tras temporada.
              </p>
              <Link to="/nosotros" className="mt-8 inline-block">
                <Button variant="ghost">Descubre Nuestra Historia</Button>
              </Link>
            </div>
            <div className="brand-image-wrap">
              <img
                src="/images/Remera%20Blanca%20A.jpeg"
                alt="Identidad de la marca Holy Drip"
                className="brand-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section id="new-arrivals" className="section-padding">
        <div className="container">
          <div className="section-header">
            <h2 className="text-3xl">Lanzamientos Recientes</h2>
          </div>
          <div className="product-grid">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} showQuickAdd={false} />
            ))}
            {newArrivals.length === 0 && (
              <p className="text-muted text-sm">Aún no hay lanzamientos recientes.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
