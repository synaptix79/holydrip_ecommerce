import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEOHead = ({ 
  title, 
  description, 
  image = '/images/logo.png', // Default image
  url = 'https://holydripofficial.com',
  type = 'website'
}) => {
  const siteTitle = title ? `${title} | Holy Drip` : 'Holy Drip | Ropa Cristiana de Diseño';
  const siteDescription = description || 'Holy Drip. Vestí con propósito. Ropa Cristiana Urbana y minimalista con estética moderna y versículos que inspiran. Envíos a todo el país.';

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />

      {/* Open Graph tags (Facebook, LinkedIn, etc.) */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Holy Drip" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Search Engine indexing */}
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};
