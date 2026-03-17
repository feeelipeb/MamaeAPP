import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { MENU_STAGES, RECIPES } from '../data/recipesData';
import { FiChevronLeft, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import RecipeModal from '../components/RecipeModal';

export default function MenuStagePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const stage = MENU_STAGES.find(s => s.id === slug);
  const recipes = RECIPES[slug] || [];
  
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favoriteNames, setFavoriteNames] = useState(new Set());

  useEffect(() => {
    if (user) {
      fetchUserFavorites();
    }
  }, [user, slug]);

  const fetchUserFavorites = async () => {
    try {
      const { data } = await supabase
        .from('saved_recipes')
        .select('recipe_name')
        .eq('user_id', user.id)
        .eq('stage_slug', slug);
      
      if (data) {
        setFavoriteNames(new Set(data.map(f => f.recipe_name)));
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  if (!stage) {
    return <div className="page-shell"><h1>Etapa não encontrada</h1></div>;
  }

  return (
    <div className="stage-detail-container animate-fade-in">
      <button className="back-btn" onClick={() => navigate('/dashboard/menu')}>
        <FiChevronLeft /> Voltar para o Cardápio
      </button>

      <section className="stage-intro-card" style={{ backgroundColor: `${stage.color}33` }}>
        <span className="age-badge">{stage.ageRange}</span>
        <h1>{stage.emoji} {stage.title}</h1>
        <p className="stage-desc">{stage.description}</p>
        
        <div className="tips-container">
          {stage.tips.map((tip, i) => (
            <span key={i} className="chip">{tip}</span>
          ))}
        </div>
      </section>

      {stage.alert && (
        <div className="alert-blw">
          <FiAlertTriangle />
          <p>{stage.alert}</p>
        </div>
      )}

      {slug === 'amamentacao' ? (
        <div className="disclaimer-card" style={{ marginTop: 0 }}>
          <div className="disclaimer-content">
            <p>⚕️ Consulte sempre o pediatra antes de introduzir qualquer alimento.</p>
          </div>
        </div>
      ) : (
        <div className="recipes-list">
          {recipes.map((recipe, i) => (
            <div 
              key={i} 
              className="recipe-item-card"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="recipe-item-main">
                <h4>{recipe.name}</h4>
                <span className="recipe-benefit-tag">{recipe.benefit}</span>
              </div>
              <FiArrowRight />
            </div>
          ))}
        </div>
      )}

      {selectedRecipe && createPortal(
        <RecipeModal 
          recipe={selectedRecipe} 
          stage={stage} 
          onClose={() => setSelectedRecipe(null)}
          isFavoriteInitially={favoriteNames.has(selectedRecipe.name)}
          onToggleFavorite={fetchUserFavorites}
        />,
        document.body
      )}
    </div>
  );
}
