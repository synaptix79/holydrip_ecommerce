import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import './About.css';

export const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <img src="/images/Remera%20Negra.jpeg" alt="Holy Drip Lifestyle" className="about-hero-img" />
          <div className="about-overlay"></div>
        </div>
        <div className="container about-hero-content text-center">
          <h1 className="text-5xl fw-bold text-white mb-6" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Vestí con propósito
          </h1>
        </div>
      </section>

      {/* Main Copy Section */}
      <section className="section-padding bg-primary">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p className="text-xl fw-bold text-primary mb-8" style={{ fontSize: '1.4rem', lineHeight: '1.8' }}>
            "Creemos que la ropa es una forma de expresar lo que llevás por dentro. Por eso todo lo que creamos está diseñado con un propósito; reflejar tu esencia, tu fe y tu identidad, combinando materiales de primera línea, confección impecable y una estética minimalista que perdura temporada tras temporada."
          </p>
          <p className="text-xl text-muted mb-6 mt-8">
            Holy Drip es una tienda donde creamos prendas y accesorios que inspiran, fortalecen y recuerdan quiénes somos en Cristo.
          </p>
          <p className="text-lg text-muted mb-6">
            Cada prenda es una forma de llevar tu identidad a lo cotidiano — en la universidad, en el trabajo, en la calle.
          </p>
          <p className="text-xl text-primary fw-semibold mt-10">
            Holy Drip es más que una marca. Transformamos la ropa en expresión.
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
