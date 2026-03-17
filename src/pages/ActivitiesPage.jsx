import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { ACTIVITY_STAGES, CATEGORIES, ACTIVITIES } from '../data/activitiesData';
import { FiChevronRight, FiHeart, FiX } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import ActivityModal from '../components/ActivityModal';
import './ActivitiesModule.css';

export default function ActivitiesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_activities')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const handleFavoriteClick = (fav) => {
    const stageActivities = ACTIVITIES[fav.age_range_slug];
    if (stageActivities) {
      const activity = stageActivities.find(a => a.name === fav.activity_name);
      const stage = ACTIVITY_STAGES.find(s => s.id === fav.age_range_slug);
      if (activity && stage) {
        setSelectedActivity(activity);
        setSelectedStage(stage);
      }
    }
  };

  return (
    <div className="activities-container animate-fade-in">
      <header className="activities-header">
        <h1>🎮 Atividades</h1>
        <p className="subtitle">Brincadeiras e estímulos para cada fase do desenvolvimento</p>
      </header>

      <section className="intro-card-section">
        <div className="intro-card">
          <p>
            Cada brincadeira é uma oportunidade de aprendizado. Explore
            atividades organizadas por faixa etária e área de desenvolvimento
            do seu bebê.
          </p>
        </div>
      </section>

      <section className="stages-grid">
        {ACTIVITY_STAGES.map((stage) => (
          <div 
            key={stage.id} 
            className="stage-activity-card" 
            style={{ borderLeftColor: stage.color }}
            onClick={() => navigate(`/dashboard/atividades/${stage.id}`)}
          >
            <div className="stage-activity-main">
              <span className="stage-emoji">{stage.emoji}</span>
              <div className="stage-info">
                <h3>{stage.title}</h3>
                <div className="stage-badges">
                  {stage.categories.map((c, i) => (
                    <span key={i} className="tiny-badge">
                      {CATEGORIES.find(cat => cat.id === c)?.emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="stage-footer">
              <span className="activity-count">
                {stage.recipeCount} atividades disponíveis
              </span>
              <FiChevronRight className="arrow-icon" />
            </div>
          </div>
        ))}
      </section>

      {favorites.length > 0 && (
        <section className="favorites-section">
          <h2><FiHeart /> Minhas Favoritas</h2>
          <div className="favorites-scroll">
            {favorites.map((fav) => (
              <div 
                key={fav.id} 
                className="fav-card"
                onClick={() => handleFavoriteClick(fav)}
              >
                <div className="fav-card-emoji">
                  {CATEGORIES.find(c => c.id === fav.category)?.emoji || '🎮'}
                </div>
                <strong>{fav.activity_name}</strong>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedActivity && selectedStage && createPortal(
        <ActivityModal 
          activity={selectedActivity} 
          stage={selectedStage} 
          onClose={() => setSelectedActivity(null)}
          isFavoriteInitially={true}
          onToggleFavorite={fetchFavorites}
        />,
        document.body
      )}
    </div>
  );
}
