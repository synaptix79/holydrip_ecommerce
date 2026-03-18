import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { Plus, Edit3, Trash2, Search, X } from 'lucide-react';
import './Admin.css';

export const CategoriesAdmin = () => {
  const { allCategories: categoryList, addCategory, removeCategory, updateCategory } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [catName, setCatName] = useState('');

  const resetForm = () => {
    setCatName('');
    setIsEditing(false);
    setCurrentCategoryId(null);
  };

  const handleOpenAddModal = () => { resetForm(); setIsModalOpen(true); };

  const handleOpenEditModal = (cat) => {
    setCatName(cat.name);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      if (isEditing) {
        await updateCategory(currentCategoryId, { name: catName });
      } else {
        await addCategory({ name: catName });
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
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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
                  <th>Nombre</th>
                  <th>Slug (ID)</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map(cat => (
                  <tr key={cat.id}>
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
                  <tr><td colSpan="4" className="text-center py-8 text-muted">No se encontraron categorías.</td></tr>
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
              {!isEditing && (
                <div className="form-group mb-6">
                  <label className="text-sm fw-medium mb-2 block">Slug (auto-generado)</label>
                  <input type="text" value={previewSlug} className="form-input w-full" disabled style={{ opacity: 0.6 }} />
                  <p className="text-xs text-muted mt-1">Se genera automáticamente del nombre. Se usa como ID del documento y para filtrar en la URL.</p>
                </div>
              )}
              <div className="modal-actions flex justify-end gap-3 mt-6">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button variant="primary" type="submit">
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
