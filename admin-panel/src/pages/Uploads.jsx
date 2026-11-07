import { useEffect, useState, useRef } from 'react';
import api from '../api/axios.js';

export default function Uploads() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/uploads');
      setFiles(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load uploads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const uploadSingle = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    await api.post('/uploads/single', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  };

  const uploadMultiple = async (fileList) => {
    const fd = new FormData();
    Array.from(fileList).forEach((f) => fd.append('images', f));
    await api.post('/uploads/multiple', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  };

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError('');
    try {
      if (fileList.length === 1) await uploadSingle(fileList[0]);
      else await uploadMultiple(fileList);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this file?')) return;
    try {
      await api.delete(`/uploads/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const formatSize = (b) => (b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB');

  return (
    <>
      <h1 className="page-title">Upload Management</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="dropzone" onClick={() => fileInput.current?.click()}>
          {uploading ? <span className="spinner" style={{ borderTopColor: '#3b82f6' }} /> : 'Click to upload single or multiple images (JPG, PNG, WEBP)'}
        </div>
        <input ref={fileInput} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFiles(e.target.files)} />
      </div>
      {loading ? <div className="empty">Loading...</div> : files.length === 0 ? <div className="empty">No uploads yet.</div> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead><tr><th>Preview</th><th>Original Name</th><th>Type</th><th>Size</th><th>Actions</th></tr></thead>
            <tbody>
              {files.map((f) => (
                <tr key={f._id}>
                  <td><img src={f.url} alt={f.originalName} /></td>
                  <td>{f.originalName}</td>
                  <td>{f.mimetype}</td>
                  <td>{formatSize(f.size)}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => remove(f._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
