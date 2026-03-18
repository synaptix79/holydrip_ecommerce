import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { Plus, Edit3, Trash2, Search, X, Loader2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { compressImage } from '../../lib/imageCompressor';
import './Admin.css';

export const ProductsAdmin = () => {
  const { allProducts: productList, allCategories: categories, addProduct, removeProduct, updateProduct } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '', price: '', category: '', stock: '', description: '',
    images: [], sizes: ['S', 'M', 'L', 'XL'], colors: [],
    isFeatured: false, isNew: false, isVisible: true
  });
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
  const [newSize, setNewSize] = useState('');

  const resetForm = () => {
    setFormData({
      name: '', price: '', category: categories[0]?.id || '',
      stock: '', description: '', images: [],
      sizes: ['S', 'M', 'L', 'XL'], colors: [],
      isFeatured: false, isNew: false, isVisible: true
    });
    setIsEditing(false);
    setCurrentProductId(null);
    setUploadError('');
  };

  const handleOpenAddModal = () => { resetForm(); setIsModalOpen(true); };

  const handleOpenEditModal = (product) => {
    setFormData({
      name: product.name || '', price: product.price || '',
      category: product.category || '', stock: product.stock || '',
      description: product.description || '', images: product.images || [],
      sizes: product.sizes || [], colors: product.colors || [],
      isFeatured: product.isFeatured || false,
      isNew: product.isNew || false,
      isVisible: product.isVisible !== false
    });
    setIsEditing(true);
    setCurrentProductId(product.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro que deseas eliminar permanentemente este producto?')) {
      try { await removeProduct(id); } catch (err) { alert('Error: ' + err.message); }
    }
  };

  const handleToggleVisibility = async (product) => {
    try { await updateProduct(product.id, { isVisible: !product.isVisible }); }
    catch (err) { alert('Error: ' + err.message); }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    setUploadError('');
    const newImageUrls = [...formData.images];

    for (const file of files) {
      // Compress before upload
      const { blob, error: compressError } = await compressImage(file);
      if (compressError) {
        setUploadError(compressError);
        continue;
      }
      try {
        const storageRef = ref(storage, `products/${Date.now()}-${file.name.replace(/\.[^.]+$/, '')}.jpg`);
        const snapshot = await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
        const url = await getDownloadURL(snapshot.ref);
        newImageUrls.push(url);
      } catch (err) {
        setUploadError(`Error subiendo ${file.name}: ${err.message}`);
      }
    }

    setFormData(prev => ({ ...prev, images: newImageUrls }));
    setUploading(false);
  };

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleAddColor = () => {
    if (newColor.name) {
      setFormData(prev => ({ ...prev, colors: [...prev.colors, { ...newColor, id: Date.now().toString() }] }));
      setNewColor({ name: '', hex: '#000000' });
    }
  };
  const removeColor = (id) => setFormData(prev => ({ ...prev, colors: prev.colors.filter(c => c.id !== id) }));

  const handleAddSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData(prev => ({ ...prev, sizes: [...prev.sizes, newSize] }));
      setNewSize('');
    }
  };
  const removeSize = (size) => setFormData(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== size) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      alert('Completa los campos obligatorios: nombre, precio y categoría.');
      return;
    }
    const productData = { ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) || 0, updatedAt: Date.now() };
    try {
      if (isEditing) await updateProduct(currentProductId, productData);
      else await addProduct(productData);
      setIsModalOpen(false);
      resetForm();
      alert('Ajustes guardados con éxito.');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const filteredProducts = productList.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl fw-semibold">Productos</h1>
          <p className="text-sm text-muted mt-1">Administra tu catálogo, precios e inventario.</p>
        </div>
        <Button variant="primary" onClick={handleOpenAddModal}>
          <Plus size={18} /> Agregar Producto
        </Button>
      </div>

      <div className="dashboard-panel glass-panel">
        <div className="panel-header" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} className="text-muted" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Buscar productos..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="form-input" style={{ paddingLeft: '2.5rem', height: '2.5rem' }} />
          </div>
        </div>

        <div className="panel-body">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Img</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)' }}>
                        <img src={product.images?.[0] || ''} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </td>
                    <td className="fw-medium">
                      {product.name}
                      {product.isFeatured && <span className="text-xs ml-2" style={{ color: 'var(--text-primary)' }}>★</span>}
                      {product.isNew && <span className="text-xs ml-1" style={{ color: '#10b981' }}>New</span>}
                    </td>
                    <td className="capitalize">{product.category}</td>
                    <td>Gs. {Number(product.price).toLocaleString('es-PY')}</td>
                    <td>{product.stock ?? '-'}</td>
                    <td>
                      <span className={`badge ${product.isVisible !== false ? 'badge-success' : 'badge-danger'}`}
                        onClick={() => handleToggleVisibility(product)} style={{ cursor: 'pointer', userSelect: 'none' }}>
                        {product.isVisible !== false ? 'Visible' : 'Oculto'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button className="action-btn" title="Editar" onClick={() => handleOpenEditModal(product)}><Edit3 size={18} /></button>
                        <button className="action-btn danger" title="Eliminar" onClick={() => handleDelete(product.id)}><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr><td colSpan="7" className="text-center py-8 text-muted">No se encontraron productos.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Producto */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass-panel" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3 className="text-xl fw-semibold">{isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
              <button className="action-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">

              <div className="grid grid-cols-1 md-grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="text-sm fw-medium mb-2 block">Nombre *</label>
                  <input type="text" className="form-input w-full" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="text-sm fw-medium mb-2 block">Precio (Gs.) *</label>
                  <input type="number" step="1" className="form-input w-full" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md-grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="text-sm fw-medium mb-2 block">Categoría *</label>
                  <select className="form-input w-full" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option value="">Seleccionar...</option>
                    {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="text-sm fw-medium mb-2 block">Stock</label>
                  <input type="number" className="form-input w-full" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="text-sm fw-medium mb-2 block">Descripción</label>
                <textarea className="form-input w-full" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-6 mb-6">
                {[
                  { key: 'isVisible', label: 'Visible en Tienda' },
                  { key: 'isFeatured', label: 'Destacado (Home)' },
                  { key: 'isNew', label: 'Es Nuevo' }
                ].map(flag => (
                  <label key={flag.key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData[flag.key]} onChange={e => setFormData({ ...formData, [flag.key]: e.target.checked })} />
                    <span className="text-sm fw-medium">{flag.label}</span>
                  </label>
                ))}
              </div>

              {/* Tallas y Colores */}
              <div className="grid grid-cols-1 md-grid-cols-2 gap-8 mb-6">
                <div>
                  <label className="text-sm fw-medium mb-2 block">Tallas</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.sizes.map(size => (
                      <span key={size} className="badge badge-secondary flex items-center gap-1">
                        {size} <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeSize(size)} />
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" className="form-input" style={{ flex: 1 }} value={newSize} onChange={e => setNewSize(e.target.value)} placeholder="Ej: XXL" />
                    <Button variant="secondary" type="button" onClick={handleAddSize}><Plus size={16} /></Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm fw-medium mb-2 block">Colores</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.colors.map(color => (
                      <span key={color.id} className="badge badge-secondary flex items-center gap-1">
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color.hex, border: '1px solid var(--border-color)' }} />
                        {color.name} <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeColor(color.id)} />
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" className="form-input" style={{ flex: 1 }} value={newColor.name} onChange={e => setNewColor({ ...newColor, name: e.target.value })} placeholder="Nombre" />
                    <input type="color" className="form-input" style={{ width: '40px', padding: '0', height: '38px', cursor: 'pointer' }} value={newColor.hex} onChange={e => setNewColor({ ...newColor, hex: e.target.value })} />
                    <Button variant="secondary" type="button" onClick={handleAddColor}><Plus size={16} /></Button>
                  </div>
                </div>
              </div>

              {/* Imágenes con compresión */}
              <div className="form-group mb-6">
                <label className="text-sm fw-medium mb-2 block">Imágenes</label>
                <p className="text-xs text-muted mb-3">Las imágenes se comprimen automáticamente (Máx. entrada: 5MB / Máx. final: 1MB).</p>
                <div className="flex flex-wrap gap-3 mb-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => fileInputRef.current.click()} disabled={uploading}
                    className="flex items-center justify-center border-dashed border-2 rounded-md"
                    style={{ width: '80px', height: '80px', borderColor: 'var(--border-color)', background: 'rgba(0,0,0,0.02)', cursor: 'pointer' }}>
                    {uploading ? <Loader2 size={20} className="text-muted animate-spin" /> : <Plus size={24} className="text-muted" />}
                  </button>
                  <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
                </div>
                {uploading && <p className="text-xs text-muted">Comprimiendo y subiendo imágenes...</p>}
                {uploadError && <p className="text-xs" style={{ color: '#dc2626' }}>{uploadError}</p>}
              </div>

              <div className="modal-actions flex justify-end gap-3 mt-8">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button variant="primary" type="submit" disabled={uploading}>
                  {uploading ? 'Subiendo...' : isEditing ? 'Guardar Cambios' : 'Crear Producto'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
