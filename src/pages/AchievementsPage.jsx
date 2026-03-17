import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { MILESTONES_DATA, CATEGORIES } from '../data/milestonesData';
import { FiAward, FiFilter, FiCheckCircle, FiChevronRight, FiEdit2, FiX, FiRepeat } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import MilestoneModal from '../components/MilestoneModal';
import './AchievementsPage.css';
import './ActivitiesModule.css'; // Reusing styles from Activities for consistency

export default function AchievementsPage() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(childId || null);
  const [achievedMilestones, setAchievedMilestones] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, [user, childId]);

  useEffect(() => {
    if (childId) {
      setSelectedChildId(childId);
    } else if (children.length > 1) {
      setSelectedChildId(null);
    } else if (children.length === 1) {
      setSelectedChildId(children[0].id);
    }
  }, [childId, children.length]);

  useEffect(() => {
    if (selectedChildId) {
      fetchAchievedMilestones();
    }
  }, [selectedChildId]);

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setChildren(data || []);
      
      if (data && data.length > 0) {
        if (childId) {
          setSelectedChildId(childId);
        } else if (data.length === 1) {
          setSelectedChildId(data[0].id);
        } else {
          setSelectedChildId(null); // Force selection screen if > 1 and no ID in URL
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching children:', err);
      setLoading(false);
    }
  };

  const fetchAchievedMilestones = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('child_id', selectedChildId);

      if (error) throw error;
      
      const mapped = {};
      data?.forEach(m => {
        mapped[m.milestone_key] = m;
      });
      setAchievedMilestones(mapped);
    } catch (err) {
      console.error('Error fetching milestones:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalMilestones = MILESTONES_DATA.length;
  const countAchieved = achievedMilestones 
    ? Object.keys(achievedMilestones).filter(key => achievedMilestones[key]?.is_achieved).length 
    : 0;
  const progressPercent = (countAchieved / totalMilestones) * 100;

  const filteredMilestones = MILESTONES_DATA.filter(m => 
    selectedCategory === 'Todos' || m.category === selectedCategory
  );

  // Sorting: Achieved at the bottom, not achieved first
  const sortedMilestones = [...filteredMilestones].sort((a, b) => {
    const isAAchieved = achievedMilestones?.[a.key]?.is_achieved ? 1 : 0;
    const isBAchieved = achievedMilestones?.[b.key]?.is_achieved ? 1 : 0;
    return isAAchieved - isBAchieved;
  });

  const openMilestoneModal = (milestone) => {
    try {
      if (!milestone) return;
      const achievementData = achievedMilestones ? (achievedMilestones[milestone.key] || {}) : {};
      
      setActiveMilestone({
        ...milestone,
        ...achievementData
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error opening milestone modal:', err);
    }
  };

  const getSelectedChild = () => children.find(c => c.id === selectedChildId);

  if (children.length > 1 && !selectedChildId && !loading) {
    return (
      <div className="achievements-page baby-selection-screen animate-fade-in">
        <header className="page-header text-center">
          <h1>🏆 Conquistas</h1>
          <p>Selecione um bebê para ver os marcos de desenvolvimento</p>
        </header>
        
        <div className="baby-selection-grid">
          {children.map(child => (
            <div 
              key={child.id} 
              className={`baby-select-card ${child.gender === 'female' ? 'girl' : 'boy'}`}
              onClick={() => navigate(`/dashboard/conquistas/${child.id}`)}
            >
              <div className="baby-select-photo">
                {child.photo_url ? (
                  <img src={child.photo_url} alt={child.name} />
                ) : (
                  <div className="baby-photo-placeholder">
                    {child.gender === 'female' ? '👧' : '🧒'}
                  </div>
                )}
              </div>
              <h3>{child.name}</h3>
              <p>{child.gender === 'female' ? 'Menina' : 'Menino'}</p>
              <button className="btn-select">Ver Conquistas &rarr;</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (children.length === 0 && !loading) {
    return (
      <div className="achievements-page empty-state animate-fade-in">
        <header className="page-header">
          <h1>🏆 Conquistas</h1>
          <p>Cada marco é uma vitória que merece ser celebrada</p>
        </header>
        <div className="card empty-card">
          <span className="big-emoji">👶</span>
          <h3>Cadastre um bebê primeiro para registrar as conquistas</h3>
          <p>Você precisa ter pelo menos um filho cadastrado para acompanhar o desenvolvimento dele.</p>
          <a href="/dashboard/baby" className="btn btn-primary">Ir para Bebês →</a>
        </div>
      </div>
    );
  }

  return (
    <div className="achievements-page animate-fade-in">
      <header className="page-header">
        <div className="header-main">
          <h1>🏆 Conquistas {getSelectedChild()?.name ? `de ${getSelectedChild().name}` : ''}</h1>
          <p>Cada marco é uma vitória que merece ser celebrada</p>
        </div>
        {children.length > 1 && (
          <button className="btn btn-ghost switch-baby-btn" onClick={() => navigate('/dashboard/conquistas')}>
            <FiRepeat /> Trocar Bebê
          </button>
        )}
      </header>


      <section className="progress-section card">
        <div className="progress-info">
          <span className="progress-text"><strong>{countAchieved}</strong> de {totalMilestones} marcos registrados</span>
          <span className="celebration-text">Continue registrando cada momento especial 💗</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </section>

      <div className="category-dropdown-container">
        <button 
          className={`category-dropdown-btn ${isFilterOpen ? 'active' : ''}`}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <div className="selected-cat">
            <span className="cat-emoji">
               {selectedCategory === 'Todos' ? '🟣' : 
                selectedCategory === 'Social' ? '😊' :
                selectedCategory === 'Motor' ? '🤸' :
                selectedCategory === 'Fala' ? '💬' :
                selectedCategory === 'Cognitivo' ? '🧠' :
                selectedCategory === 'Alimentação' ? '🍎' : '🛁'}
            </span>
            <span>Filtrar por: <strong>{selectedCategory}</strong></span>
          </div>
          <FiChevronRight className={`arrow ${isFilterOpen ? 'down' : ''}`} />
        </button>

        {isFilterOpen && createPortal(
          <div className="mobile-menu-overlay open" onClick={() => setIsFilterOpen(false)}>
            <div className="mobile-menu-content" onClick={e => e.stopPropagation()}>
              <div className="mobile-menu-header">
                <h3>Filtrar por Categoria</h3>
                <button className="menu-close-btn" onClick={() => setIsFilterOpen(false)}>
                  <FiX />
                </button>
              </div>
              <div className="mobile-menu-grid">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`mobile-menu-item ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsFilterOpen(false);
                    }}
                  >
                    <span className="menu-emoji">
                      {cat === 'Todos' ? '🟣' : 
                       cat === 'Social' ? '😊' :
                       cat === 'Motor' ? '🤸' :
                       cat === 'Fala' ? '💬' :
                       cat === 'Cognitivo' ? '🧠' :
                       cat === 'Alimentação' ? '🍎' : '🛁'}
                    </span>
                    <span className="menu-label">{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>

      <div className="milestones-grid">
        {sortedMilestones.map(m => {
          const achievement = achievedMilestones[m.key];
          const isAchieved = achievement?.is_achieved;

          return (
            <div 
              key={m.key} 
              className={`milestone-card ${isAchieved ? 'achieved' : 'pending'}`}
              onClick={() => openMilestoneModal(m)}
            >
              <div className="milestone-content">
                <div className="milestone-header">
                  <span className="milestone-emoji">{m.icon} {isAchieved && <FiCheckCircle className="check-icon" />}</span>
                  <span className="category-badge">{m.category}</span>
                </div>
                <h3>{m.name}</h3>
                
                {isAchieved ? (
                  <div className="achievement-info">
                    <p className="achievement-date">Aconteceu em {new Date(achievement.milestone_date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    {achievement.notes && <p className="achievement-notes">{achievement.notes}</p>}
                    <button className="btn-edit"><FiEdit2 /></button>
                  </div>
                ) : (
                  <div className="pending-info">
                    <p>Ainda não aconteceu...</p>
                    <button className="btn-register">Registrar 📅</button>
                    {m.required && <span className="required-badge">Obrigatório ⭐</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <MilestoneModal
          milestone={activeMilestone}
          childId={selectedChildId}
          childName={getSelectedChild()?.name}
          childBirthDate={getSelectedChild()?.birth_date}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchAchievedMilestones}
        />
      )}
    </div>
  );
}
