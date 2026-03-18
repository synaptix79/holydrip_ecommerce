import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ui/ProductCard';
import { Select } from '../components/ui/Select';
import { useData } from '../context/DataContext';
import { SlidersHorizontal } from 'lucide-react';
import './Catalog.css';

export const Catalog = () => {
  const { products, categories } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = searchParams.get('sort') || 'newest';

  // Agregar opción "Toda la Colección" + categorías visibles desde Firestore
  const categoryOptions = [
    { value: 'all', label: 'Toda la Colección' },
    ...categories.map(c => ({ value: c.id, label: c.name }))
  ];
  
  const sortOptions = [
    { value: 'newest', label: 'Más Nuevos' },
    { value: 'price_asc', label: 'Precio: Menor a Mayor' },
    { value: 'price_desc', label: 'Precio: Mayor a Menor' },
  ];

  const handleCategoryChange = (val) => {
    setSearchParams(prev => { prev.set('category', val); return prev; });
  };

  const handleSortChange = (val) => {
    setSearchParams(prev => { prev.set('sort', val); return prev; });
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by category (el id del doc en Firestore ES el slug)
    if (categoryParam !== 'all') {
      result = result.filter(p => p.category === categoryParam);
    }

    // Sort
    switch (sortParam) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
    }

    return result;
  }, [categoryParam, sortParam, products]); // ← products incluido como dependencia

  return (
    <div className="catalog-page">
      <div className="container">
        
        {/* Page Header */}
        <header className="catalog-header">
          <h1 className="text-4xl text-center md:text-left">
            {categoryParam === 'all' ? 'Toda la Colección' : 
              categories.find(c => c.id === categoryParam)?.name || 'Colección'}
          </h1>
          <p className="text-muted mt-2 text-center md:text-left">
            {filteredAndSortedProducts.length} Resultados
          </p>
        </header>

        {/* Toolbar */}
        <div className="catalog-toolbar">
          <button 
            className="mobile-filter-btn md-hidden"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <SlidersHorizontal size={18} />
            Filtros
          </button>

          <div className={`catalog-filters ${isFiltersOpen ? 'is-open' : ''}`}>
            <div className="filter-widget">
              <span className="text-sm fw-medium text-muted mb-2 block">Categoría</span>
              <Select 
                options={categoryOptions} 
                value={categoryParam} 
                onChange={handleCategoryChange} 
              />
            </div>
          </div>
          
          <div className="catalog-sort">
            <span className="text-sm fw-medium text-muted desktop-only mr-2">Ordenar por</span>
            <Select 
              options={sortOptions} 
              value={sortParam} 
              onChange={handleSortChange}
              className="sort-select"
            />
          </div>
        </div>

        {/* Product Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="catalog-grid">
            {filteredAndSortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3 className="text-2xl text-muted">No se encontraron productos.</h3>
          </div>
        )}
        
      </div>
    </div>
  );
};
