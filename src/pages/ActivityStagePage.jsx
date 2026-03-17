import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { ACTIVITY_STAGES, ACTIVITIES, CATEGORIES } from '../data/activitiesData';
import { FiChevronLeft, FiArrowRight, FiChevronRight, FiX } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import ActivityModal from '../components/ActivityModal';

export default function ActivityStagePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const stage = ACTIVITY_STAGES.find(s => s.id === slug);
  const allActivities = ACTIVITIES[slug] || [];
  
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [favoriteNames, setFavoriteNames] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserFavorites();
    }
  }, [user, slug]);

  const fetchUserFavorites = async () => {
    try {
      const { data } = await supabase
        .from('saved_activities')
        .select('activity_name')
        .eq('user_id', user.id)
        .eq('age_range_slug', slug);
      
      if (data) {
        setFavoriteNames(new Set(data.map(f => f.activity_name)));
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const filteredActivities = allActivities.filter(activity => {
    if (activeCategory === 'Todas') return true;
    return activity.category === activeCategory;
  });

  const activeCategoryData = CATEGORIES.find(c => c.id === activeCategory);

  if (!stage) {
    return <div className="page-shell"><h1>Faixa etária não encontrada</h1></div>;
  }

  return (
    <div className="activity-stage-container animate-fade-in">
      <button className="back-btn" onClick={() => navigate('/dashboard/atividades')}>
        <FiChevronLeft /> Voltar para Atividades
      </button>

      <section className="activity-intro-card" style={{ backgroundColor: `${stage.color}33` }}>
        <span className="age-badge">{stage.ageRange}</span>
        <h1>{stage.emoji} {stage.title}</h1>
        <p className="activity-desc">{stage.description}</p>
        
        <div className="stage-badges">
          {stage.categories.map((c, i) => (
            <span key={i} className="chip">
              {CATEGORIES.find(cat => cat.id === c)?.emoji} {c}
            </span>
          ))}
        </div>
      </section>

      <div className="category-dropdown-container">
        <button 
          className={`category-dropdown-btn ${isFilterOpen ? 'active' : ''}`}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <div className="selected-cat">
            <span className="cat-emoji">{activeCategoryData?.emoji}</span>
            <span>Filtrar por: <strong>{activeCategoryData?.name}</strong></span>
          </div>
          <FiChevronRight className={`arrow ${isFilterOpen ? 'down' : ''}`} />
        </button>

        {/* Categories Bottom Sheet / Dropdown */}
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
                    key={cat.id}
                    className={`mobile-menu-item ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setIsFilterOpen(false);
                    }}
                  >
                    <span className="menu-emoji">{cat.emoji}</span>
                    <span className="menu-label">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>

      <div className="activities-list">
        {filteredActivities.map((activity, index) => (
          <div 
            key={index} 
            className="activity-item-card animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => setSelectedActivity(activity)}
          >
            <div className="activity-item-main">
              <h4>{activity.name}</h4>
              <div className="activity-meta">
                <span className="cat-tag" style={{ 
                  backgroundColor: getCategoryColor(activity.category) + '15',
                  color: getCategoryColor(activity.category)
                }}>
                  {activity.category}
                </span>
                <span className="duration-tag">⏱️ {activity.duration}</span>
              </div>
            </div>
            <FiChevronRight className="arrow-icon" />
          </div>
        ))}
        {filteredActivities.length === 0 && (
          <p className="text-center mt-3" style={{ opacity: 0.6 }}>
            Nenhuma atividade nesta categoria no momento.
          </p>
        )}
      </div>

      {selectedActivity && createPortal(
        <ActivityModal 
          activity={selectedActivity} 
          stage={stage} 
          onClose={() => setSelectedActivity(null)}
          isFavoriteInitially={favoriteNames.has(selectedActivity.name)}
          onToggleFavorite={fetchUserFavorites}
        />,
        document.body
      )}
    </div>
  );
}
