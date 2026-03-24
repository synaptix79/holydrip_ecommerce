import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { SEOHead } from '../components/common/SEOHead';
import './About.css';

export const About = () => {
  return (
    <div className="about-page">
      <SEOHead title="Nosotros" description="En Holy Drip creemos que la ropa es una forma de expresar lo que llevás por dentro. Conocé más sobre nuestra visión." />
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <img src="/images/Remera%20Negra.jpeg" alt="Holy Drip Lifestyle" className="about-hero-img" />
          <div className="about-overlay"></div>
        </div>
        <div className="container about-hero-content text-center">
          <a
            href="https://open.spotify.com/user/31r77qjepkzognla5o6pgbt2ceeu?si=yZDvJO1XSGy3ndEEcC7kRA"
            target="_blank"
            rel="noopener noreferrer"
            className="spotify-btn"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.261 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.54-1.02.72-1.56.42z"/>
            </svg>
            Holy Drip Playlist
          </a>
          <h1 className="text-5xl fw-bold text-white mb-6" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Vestí con propósito
          </h1>
        </div>
      </section>

      {/* Main Copy Section */}
      <section className="section-padding bg-primary">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p className="text-xl fw-bold text-primary mb-8" style={{ fontSize: '1.4rem', lineHeight: '1.8' }}>
            "En Holy Drip creemos que la ropa es una forma de expresar lo que llevás por dentro."
          </p>
          <p className="text-xl text-muted mb-6 mt-8" style={{ lineHeight: '1.7' }}>
            Por eso creamos prendas y accesorios con propósito: para reflejar tu fe, tu identidad y tu esencia con una estética minimalista, materiales de calidad y confección cuidada.
          </p>
          <p className="text-lg text-muted mb-6">
            Cada diseño lleva versículos y frases que inspiran y fortalecen. Es una forma de llevar la Palabra a lo cotidiano — en la universidad, en el trabajo, en la calle.
          </p>
          <p className="text-xl text-primary fw-semibold mt-10">
            Holy Drip es más que una marca. Transformamos la ropa en testimonio. 🫂✝️
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding about-cta" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container text-center">
          <h2 className="text-4xl fw-bold mb-6">Elevá tu estilo diario</h2>
          <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
            Explora nuestra colección y conectá tu guardarropa con tu esencia.
          </p>
          <Link to="/shop">
            <Button variant="primary" size="lg">Ver Catálogo</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
