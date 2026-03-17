import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { FiX, FiCheckCircle, FiHeart, FiBookOpen, FiActivity } from 'react-icons/fi';

export default function RecipeModal({ recipe, stage, onClose, isFavoriteInitially, onToggleFavorite }) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitially);
  const [loading, setLoading] = useState(false);

  const handleToggleFavorite = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('saved_recipes')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_name', recipe.name);
        
        if (error) throw error;
        setIsFavorite(false);
      } else {
        const { error } = await supabase
          .from('saved_recipes')
          .upsert({
            user_id: user.id,
            recipe_name: recipe.name,
            stage_slug: stage.id,
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

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content recipe-modal animate-fade-in" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FiX /></button>
        
        <div className="recipe-modal-header">
          <span className="recipe-benefit-tag">{recipe.benefit}</span>
          <h2>{recipe.name}</h2>
          <span className="age-badge">{stage.ageRange}</span>
        </div>

        <div className="recipe-modal-content">
          <section>
            <h3><FiCheckCircle /> Ingredientes</h3>
            <ul>
              {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          </section>

          <section>
            <h3><FiBookOpen /> Passo a Passo</h3>
            <ol>
              {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </section>

          <button 
            className={`modal-fav-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleToggleFavorite}
            disabled={loading}
          >
            <FiHeart fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? 'Remover dos Favoritos' : 'Favoritar Receita'}
          </button>

          <div className="disclaimer-card">
            <div className="disclaimer-icon"><FiActivity /></div>
            <div className="disclaimer-content">
              <h4>⚕️ Lembrete importante</h4>
              <p>
                Esta receita é uma sugestão informativa. 
                Consulte sempre o pediatra do seu bebê antes de introduzir novos alimentos. 
                Cada criança tem seu ritmo único.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
