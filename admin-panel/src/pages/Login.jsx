import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: 'Store Admin', email: 'admin@example.com', password: 'Admin@12345' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await signup(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>{mode === 'login' ? 'Admin Login' : 'Create Admin'}</h1>
        <p>Products Listing & File Uploading System</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label>Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? <span className="spinner" /> : (mode === 'login' ? 'Login' : 'Signup')}
          </button>
        </form>
        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 13 }}>
          {mode === 'login' ? (
            <span>Need an admin account? <a href="#" onClick={(e) => { e.preventDefault(); setMode('signup'); }}>Signup</a></span>
          ) : (
            <span>Already have account? <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); }}>Login</a></span>
          )}
        </div>
      </div>
    </div>
  );
}
