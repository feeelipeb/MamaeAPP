import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { MENU_STAGES, RECIPES } from '../data/recipesData';
import { FiChevronRight, FiHeart } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import RecipeModal from '../components/RecipeModal';
import './MenuModule.css';

export default function MenuPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
   const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const handleFavoriteClick = (fav) => {
    const stageRecipes = RECIPES[fav.stage_slug];
    if (stageRecipes) {
      const recipe = stageRecipes.find(r => r.name === fav.recipe_name);
      const stage = MENU_STAGES.find(s => s.id === fav.stage_slug);
      if (recipe && stage) {
        setSelectedRecipe(recipe);
        setSelectedStage(stage);
      } else {
        // Fallback to navigation if recipe or stage not found for some reason
        navigate(`/dashboard/menu/${fav.stage_slug}`);
      }
    } else {
      navigate(`/dashboard/menu/${fav.stage_slug}`);
    }
  };

  return (
    <div className="menu-container animate-fade-in">
      <header className="menu-header">
        <h1>🍽️ Cardápio Infantil</h1>
        <p className="subtitle">Alimentação saudável em cada fase do bebê</p>
      </header>

      <section className="intro-card-section">
        <div className="intro-card">
          <p>
            Explore receitas organizadas por fase de desenvolvimento.
            Cada etapa foi pensada para a nutrição e segurança do seu bebê.
          </p>
        </div>
      </section>

      <section className="stages-section">
        <div className="stages-grid">
          {MENU_STAGES.map((stage) => (
            <div 
              key={stage.id} 
              className="stage-card" 
              style={{ borderLeftColor: stage.color }}
              onClick={() => navigate(`/dashboard/menu/${stage.id}`)}
            >
              <div className="stage-main">
                <span className="stage-emoji">{stage.emoji}</span>
                <div className="stage-info">
                  <h3>{stage.title}</h3>
                  <span className="age-badge">{stage.ageRange}</span>
                </div>
              </div>
              <div className="stage-footer">
                <span className="recipe-count">
                  {stage.recipeCount > 0 ? `${stage.recipeCount} receitas disponíveis` : 'Orientações exclusivas'}
                </span>
                <FiChevronRight className="arrow-icon" />
              </div>
            </div>
          ))}
        </div>
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
                <span>🍴</span>
                <strong>{fav.recipe_name}</strong>
              </div>
            ))}
          </div>
        </section>
      )}
      {selectedRecipe && selectedStage && createPortal(
        <RecipeModal 
          recipe={selectedRecipe} 
          stage={selectedStage} 
          onClose={() => setSelectedRecipe(null)}
          isFavoriteInitially={true}
          onToggleFavorite={fetchFavorites}
        />,
        document.body
      )}
    </div>
  );
}
