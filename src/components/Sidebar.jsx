import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FiHome, FiLogOut
} from 'react-icons/fi';
import './Sidebar.css';

const modules = [
  { path: '/dashboard', label: 'Início', icon: <FiHome />, emoji: '🏠', exact: true },
  { path: '/dashboard/baby', label: 'Bebê', emoji: '👶' },
  { path: '/dashboard/menu', label: 'Cardápio Infantil', emoji: '🍽️' },
  { path: '/dashboard/pregnancy', label: 'Gravidez', emoji: '🤰' },
  { path: '/dashboard/calendar', label: 'Calendário', emoji: '📅' },
  { path: '/dashboard/memories', label: 'Lembranças', emoji: '📖' },
  { path: '/dashboard/conquistas', label: 'Conquistas', emoji: '🏆' },
  { path: '/dashboard/atividades', label: 'Atividades', emoji: '🎮' },
  { path: '/dashboard/stories', label: 'Histórias', emoji: '🌙' },
  { path: '/dashboard/profile', label: 'Meu Perfil', emoji: '👩' },
];

// Build v1.0.1 - Module update
export { modules };

export default function Sidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="MamãeApp Logo" className="logo-img" />
        </div>
      </div>

      <nav className="sidebar-nav">
        {modules.map((mod) => (
          <NavLink
            key={mod.path}
            to={mod.path}
            end={mod.exact}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <span className="sidebar-link-emoji">{mod.emoji}</span>
            <span className="sidebar-link-label">{mod.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <FiLogOut />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
