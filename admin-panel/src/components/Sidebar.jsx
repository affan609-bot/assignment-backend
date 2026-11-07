import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <h2>ProStore Admin</h2>
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>
      <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')}>Products</NavLink>
      <NavLink to="/products/new" className={({ isActive }) => (isActive ? 'active' : '')}>Add Product</NavLink>
      <NavLink to="/uploads" className={({ isActive }) => (isActive ? 'active' : '')}>Uploads</NavLink>
      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 13, marginBottom: 8 }}>{admin?.name}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>{admin?.email}</div>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}
