import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { Plus, Edit3, Trash2, Search, X, Loader2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { compressImage } from '../../lib/imageCompressor';
import './Admin.css';

export const CategoriesAdmin = () => {
  const { allCategories: categoryList, addCategory, removeCategory, updateCategory } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setCatName('');
    setCatImage('');
    setIsEditing(false);
    setCurrentCategoryId(null);
    setUploadError('');
  };

  const handleOpenAddModal = () => { resetForm(); setIsModalOpen(true); };

  const handleOpenEditModal = (cat) => {
    setCatName(cat.name);
    setCatImage(cat.image || '');
    setIsEditing(true);
    setCurrentCategoryId(cat.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro que deseas eliminar esta categoría?')) {
      try { await removeCategory(id); }
      catch (err) { alert('Error: ' + err.message); }
    }
  };

  const handleToggleVisibility = async (cat) => {
    try { await updateCategory(cat.id, { isVisible: !(cat.isVisible !== false) }); }
    catch (err) { alert('Error: ' + err.message); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    
    const { blob, error: compressError } = await compressImage(file);
    if (compressError) {
      setUploadError(compressError);
      setUploading(false);
      return;
    }
    
    try {
      const storageRef = ref(storage, `categories/${Date.now()}-${file.name.replace(/\\.[^.]+$/, '')}.jpg`);
      const snapshot = await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
      const url = await getDownloadURL(snapshot.ref);
      setCatImage(url);
    } catch (err) {
      setUploadError(`Error subiendo ${file.name}: ${err.message}`);
    }
    setUploading(false);
  };

  const removeImage = () => {
    setCatImage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      if (isEditing) {
        await updateCategory(currentCategoryId, { name: catName, image: catImage });
      } else {
        await addCategory({ name: catName, image: catImage });
      }
      setIsModalOpen(false);
      resetForm();
      alert('Ajustes guardados con éxito.');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const previewSlug = catName
    .toLowerCase()
    .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const filteredCategories = categoryList.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl fw-semibold">Categorías</h1>
          <p className="text-sm text-muted mt-1">Organiza tu catálogo por colecciones y categorías.</p>
        </div>
        <Button variant="primary" onClick={handleOpenAddModal}>
          <Plus size={18} /> Nueva Categoría
        </Button>
      </div>

      <div className="dashboard-panel glass-panel">
        <div className="panel-header" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} className="text-muted" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar categorías..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem', height: '2.5rem' }}
            />
          </div>
        </div>

        <div className="panel-body">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Img</th>
                  <th>Nombre</th>
                  <th>Slug (ID)</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map(cat => (
                  <tr key={cat.id}>
                    <td>
                      <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)' }}>
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '10px' }}>-</div>
                        )}
                      </div>
                    </td>
                    <td className="fw-medium">{cat.name}</td>
                    <td><code style={{ fontSize: '0.8rem' }}>{cat.slug || cat.id}</code></td>
                    <td>
                      <span
                        className={`badge ${cat.isVisible !== false ? 'badge-success' : 'badge-danger'}`}
                        onClick={() => handleToggleVisibility(cat)}
                        style={{ cursor: 'pointer' }}
                      >
                        {cat.isVisible !== false ? 'Visible' : 'Oculto'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button className="action-btn" title="Editar" onClick={() => handleOpenEditModal(cat)}><Edit3 size={18} /></button>
                        <button className="action-btn danger" title="Eliminar" onClick={() => handleDelete(cat.id)}><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCategories.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-8 text-muted">No se encontraron categorías.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass-panel" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="text-xl fw-semibold">{isEditing ? 'Editar Categoría' : 'Crear Categoría'}</h3>
              <button className="action-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group mb-4">
                <label className="text-sm fw-medium mb-2 block">Nombre de la Categoría</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="form-input w-full"
                  placeholder="Ej: Accesorios"
                  required
                  autoFocus
                />
              </div>
              
              <div className="form-group mb-4">
                <label className="text-sm fw-medium mb-2 block">Imagen Representativa</label>
                <div className="flex gap-4 items-center">
                  <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {catImage ? (
                      <>
                        <img src={catImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button type="button" onClick={removeImage} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                       <span className="text-muted text-xs">Sin imagen</span>
                    )}
                  </div>
                  <div>
                    <button type="button" onClick={() => fileInputRef.current.click()} disabled={uploading} className="border-dashed border-2 rounded-md flex items-center justify-center gap-2 text-sm text-muted" style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: 'transparent' }}>
                      {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                      {uploading ? 'Subiendo...' : 'Subir'}
                    </button>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
                  </div>
                </div>
                {uploadError && <p className="text-xs mt-2" style={{ color: '#dc2626' }}>{uploadError}</p>}
              </div>

              {!isEditing && (
                <div className="form-group mb-6">
                  <label className="text-sm fw-medium mb-2 block">Slug (auto-generado)</label>
                  <input type="text" value={previewSlug} className="form-input w-full" disabled style={{ opacity: 0.6 }} />
                  <p className="text-xs text-muted mt-1">Se genera automáticamente del nombre.</p>
                </div>
              )}
              <div className="modal-actions flex justify-end gap-3 mt-6">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button variant="primary" type="submit" disabled={uploading}>
                  {isEditing ? 'Actualizar' : 'Guardar Categoría'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
