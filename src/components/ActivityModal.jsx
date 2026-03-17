import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { FiX, FiCheckCircle, FiHeart, FiClock, FiEye, FiGift } from 'react-icons/fi';
import { CATEGORIES } from '../data/activitiesData';

export default function ActivityModal({ activity, stage, onClose, isFavoriteInitially, onToggleFavorite }) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitially);
  const [loading, setLoading] = useState(false);

  const handleToggleFavorite = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('saved_activities')
          .delete()
          .eq('user_id', user.id)
          .eq('activity_name', activity.name);
        
        if (error) throw error;
        setIsFavorite(false);
      } else {
        const { error } = await supabase
          .from('saved_activities')
          .upsert({
            user_id: user.id,
            activity_name: activity.name,
            age_range_slug: stage.id,
            category: activity.category,
            is_favorite: true
          });
        
        if (error) throw error;
        setIsFavorite(true);
      }
      if (onToggleFavorite) onToggleFavorite();
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setLoading(false);
    }
  };

  const catEmoji = CATEGORIES.find(c => c.id === activity.category)?.emoji || '🎮';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content activity-modal animate-fade-in" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FiX /></button>
        
        <div className="activity-modal-header">
          <span className="cat-tag">{catEmoji} {activity.category}</span>
          <h2>{activity.name}</h2>
          <div className="activity-meta">
            <span className="age-badge">{stage.ageRange}</span>
            <span className="duration-tag"><FiClock /> {activity.duration}</span>
          </div>
        </div>

        <div className="activity-modal-content">
          <section>
            <h3><FiGift /> O que você vai precisar 🧸</h3>
            <p>{activity.materials || 'Nenhum material especial necessário.'}</p>
          </section>

          <section>
            <h3><FiCheckCircle /> Como fazer 👣</h3>
            <p>{activity.description}</p>
          </section>

          <section>
            <h3><FiGift /> Por que é importante 💡</h3>
            <p>{activity.benefit}</p>
          </section>

          <button 
            className={`modal-fav-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleToggleFavorite}
            disabled={loading}
          >
            <FiHeart fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? 'Remover dos Favoritos' : 'Favoritar Atividade'}
          </button>

          <div className="disclaimer-activity">
            <div className="disclaimer-icon"><FiEye /></div>
            <div className="disclaimer-content">
              <h4>👀 Supervisão sempre</h4>
              <p>
                Todas as atividades devem ser realizadas com supervisão de um adulto responsável. 
                Adapte conforme o desenvolvimento e as necessidades individuais da criança.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
