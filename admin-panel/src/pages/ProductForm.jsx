import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' });
  const [images, setImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        const p = data.data;
        setForm({ name: p.name, description: p.description || '', price: p.price, category: p.category, stock: p.stock });
        setImages(p.images || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const save = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock || 0),
      };
      let productId = id;
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
      } else {
        const { data } = await api.post('/products', payload);
        productId = data.data._id;
      }
      // Upload new images if any
      if (newFiles.length) {
        const fd = new FormData();
        newFiles.forEach((f) => fd.append('images', f));
        await api.post(`/products/${productId}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const deleteImage = async (filename) => {
    if (!confirm('Delete this image?')) return;
    try {
      const { data } = await api.delete(`/products/${id}/images/${filename}`);
      setImages(data.data.images || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  if (loading) return <div className="empty">Loading...</div>;

  return (
    <>
      <h1 className="page-title">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={save}>
          <div className="form-group"><label>Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group"><label>Description</label>
            <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-2">
            <div className="form-group"><label>Price</label>
              <input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="form-group"><label>Stock</label>
              <input className="input" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>
          <div className="form-group"><label>Category</label>
            <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          </div>

          {isEdit && images.length > 0 && (
            <div className="form-group">
              <label>Current Images</label>
              <div className="preview-grid">
                {images.map((img) => (
                  <div key={img.filename} style={{ position: 'relative' }}>
                    <img src={img.url} alt="" />
                    <button type="button" className="btn btn-danger btn-sm" style={{ position: 'absolute', top: 4, right: 4 }} onClick={() => deleteImage(img.filename)}>x</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Upload Images</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setNewFiles(Array.from(e.target.files))} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? <span className="spinner" /> : (isEdit ? 'Update' : 'Create')}</button>
            <button className="btn btn-ghost" type="button" onClick={() => navigate('/products')}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}
