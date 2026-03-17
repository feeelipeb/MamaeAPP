import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { FiSearch, FiChevronRight, FiX, FiArrowRight } from 'react-icons/fi';
import { RECIPES } from '../data/recipesData';
import { ACTIVITIES } from '../data/activitiesData';
import { MILESTONES_DATA } from '../data/milestonesData';
import './DashboardPage.css';

const highlightModules = [
  { path: '/dashboard/baby', label: 'Bebê', emoji: '👶', color: '#60A5FA' },
  { path: '/dashboard/pregnancy', label: 'Gestação', emoji: '🤰', color: '#A78BFA' },
  { path: '/dashboard/atividades', label: 'Atividades', emoji: '🎮', color: '#FBBF24' },
];

const allModules = [
  { id: '01', path: '/dashboard/baby', label: 'Bebê', emoji: '👶', description: 'Acompanhamento de desenvolvimento', status: 'Ver agora' },
  { id: '02', path: '/dashboard/menu', label: 'Cardápio Infantil', emoji: '🍽️', description: 'Refeições e nutrição', status: 'Sugestões' },
  { id: '03', path: '/dashboard/pregnancy', label: 'Diário de Gestação', emoji: '🤰', description: 'Semana a semana', status: 'Acompanhar' },
  { id: '04', path: '/dashboard/calendar', label: 'Calendário', emoji: '📅', description: 'Tudo em um só lugar', status: 'Agenda' },
  { id: '05', path: '/dashboard/memories', label: 'Lembranças', emoji: '📖', description: 'Momentos especiais', status: 'Registrar' },
  { id: '06', path: '/dashboard/conquistas', label: 'Conquistas', emoji: '🏆', description: 'Marcos e momentos únicos', status: '8/38' },
  { id: '07', path: '/dashboard/atividades', label: 'Atividades', emoji: '🎮', description: 'Desenvolvimento da criança', status: 'Novas' },
  { id: '08', path: '/dashboard/stories', label: 'Histórias para Dormir', emoji: '🌙', description: 'Contos e cantigas', status: 'Ouvir' },
];

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [achievementsCount, setAchievementsCount] = useState(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchAchievementsCount();
    }
  }, [user]);

  // Lock body scroll when search is active
  useEffect(() => {
    if (isSearchFocused || searchTerm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchFocused, searchTerm]);

  const fetchAchievementsCount = async () => {
    try {
      // 1. Get user's children ids
      const { data: children, error: childrenError } = await supabase
        .from('children')
        .select('id')
        .eq('user_id', user.id);

      if (childrenError) throw childrenError;

      if (!children || children.length === 0) {
        setAchievementsCount(0);
        return;
      }

      const childrenIds = children.map(c => c.id);

      // 2. Count achieved milestones for those children
      const { count, error } = await supabase
        .from('milestones')
        .select('*', { count: 'exact', head: true })
        .in('child_id', childrenIds)
        .eq('is_achieved', true);

      if (error) throw error;
      setAchievementsCount(count || 0);
    } catch (err) {
      console.error('Error fetching achievements count:', err);
      setAchievementsCount(0);
    }
  };

  const focusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      setIsSearchFocused(true);
    }
  };

  // Consolidating all searchable data
  const searchData = useMemo(() => {
    const data = [];
    
    // Modules
    allModules.forEach(m => data.push({ ...m, type: 'Módulo', searchKey: m.label + m.description }));
    
    // Recipes
    Object.entries(RECIPES).forEach(([slug, list]) => {
      list.forEach(r => data.push({ 
        label: r.name, 
        description: `Receita para ${slug}`, 
        path: `/dashboard/menu/${slug}`,
        emoji: '🍽️',
        type: 'Receita',
        searchKey: r.name + r.benefit
      }));
    });

    // Activities
    Object.entries(ACTIVITIES).forEach(([slug, list]) => {
      list.forEach(a => data.push({ 
        label: a.name, 
        description: `Atividade (${slug})`, 
        path: `/dashboard/atividades/${slug}`,
        emoji: '🎮',
        type: 'Atividade',
        searchKey: a.name + a.description
      }));
    });

    // Milestones
    MILESTONES_DATA.forEach(m => data.push({ 
      label: m.name, 
      description: m.description, 
      path: '/dashboard/conquistas',
      emoji: m.icon || '🏆',
      type: 'Conquista',
      searchKey: m.name + m.description
    }));

    return data;
  }, []);

  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return searchData
      .filter(item => item.searchKey.toLowerCase().includes(term))
      .slice(0, 8); // Limit results for performance/UI
  }, [searchTerm, searchData]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const firstName = profile?.name?.split(' ')[0] || user?.user_metadata?.name?.split(' ')[0] || '';

  return (
    <div className="dashboard-redesign scroll-container">
      <header className="vibrant-header">
        <div className="header-top">
          <button className="menu-btn" onClick={focusSearch}><FiSearch /></button>
          <img src={`${import.meta.env.BASE_URL}logo2.png`} alt="Logo" className="logo-center" />
          <Link to="/dashboard/profile" className="profile-btn">
            <div className="avatar-placeholder">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Perfil" 
                  style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} 
                />
              ) : (
                firstName.charAt(0) || 'U'
              )}
            </div>
          </Link>
        </div>

        <div className="search-bar-decorative active-search">
          <FiSearch className="search-icon" />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="O que você busca hoje?" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
          />
          {(searchTerm || isSearchFocused) && (
            <FiX 
              className="clear-search" 
              onClick={(e) => {
                e.stopPropagation();
                setSearchTerm('');
                setIsSearchFocused(false);
              }} 
            />
          )}
        </div>

        {(searchTerm || isSearchFocused) && (
          <div className="search-results-overlay animate-fade-in">
            <div className="results-container">
              {searchTerm ? (
                filteredResults.length > 0 ? (
                  filteredResults.map((res, i) => (
                    <Link 
                      key={i} 
                      to={res.path} 
                      className="search-result-item"
                      onClick={() => { setSearchTerm(''); setIsSearchFocused(false); }}
                    >
                      <span className="res-emoji">{res.emoji}</span>
                      <div className="res-info">
                        <span className="res-type">{res.type}</span>
                        <span className="res-label">{res.label}</span>
                      </div>
                      <FiArrowRight className="res-arrow" />
                    </Link>
                  ))
                ) : (
                  <div className="no-results">
                    <p>Nenhum resultado encontrado para "{searchTerm}"</p>
                  </div>
                )
              ) : (
                <div className="search-suggestions">
                  <p className="suggestion-title">Sugestões para você</p>
                  <div className="suggestion-grid">
                    <button onClick={() => { setSearchTerm('Receita'); setIsSearchFocused(true); }} className="suggestion-tag">🍽️ Receitas</button>
                    <button onClick={() => { setSearchTerm('Atividade'); setIsSearchFocused(true); }} className="suggestion-tag">🎮 Atividades</button>
                    <button onClick={() => { setSearchTerm('Conquista'); setIsSearchFocused(true); }} className="suggestion-tag">🏆 Conquistas</button>
                    <button onClick={() => { setSearchTerm('Bebê'); setIsSearchFocused(true); }} className="suggestion-tag">👶 Bebê</button>
                  </div>
                </div>
              )}
            </div>
            <button className="close-search-btn" onClick={() => setIsSearchFocused(false)}>
              Fechar Pesquisa
            </button>
          </div>
        )}

        <div className="header-greeting">
          <h2>{greeting()}, {firstName}!</h2>
          <p>O que vamos explorar agora?</p>
        </div>

        <div className="module-highlights">
          {highlightModules.map((mod) => (
            <Link key={mod.path} to={mod.path} className="highlight-item">
              <div className="circle-icon" style={{ backgroundColor: mod.color }}>
                <span className="emoji">{mod.emoji}</span>
              </div>
              <span className="label">{mod.label}</span>
            </Link>
          ))}
        </div>
      </header>

      <div className="content-sheet">
        <div className="sheet-container">
          <div className="sheet-header">
            <h3>Meus Módulos</h3>
            <FiChevronRight className="arrow-more" />
          </div>

          <div className="modules-list-vertical">
            {allModules.map((mod, index) => {
              // Dynamic status for Achievements
              const displayStatus = mod.id === '06' && achievementsCount !== null 
                ? `${achievementsCount}/${MILESTONES_DATA.length}` 
                : mod.status;

              return (
                <Link
                  key={mod.path}
                  to={mod.path}
                  className="list-module-item animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="item-number">{mod.id}</div>
                  <div className="item-icon-container">
                    <span className="item-emoji">{mod.emoji}</span>
                  </div>
                  <div className="item-content">
                    <h4>{mod.label}</h4>
                    <p>{mod.description}</p>
                  </div>
                  <div className="item-status">
                    <span className="status-badge">{displayStatus}</span>
                    <div className="play-button-small">
                      <div className="play-icon"></div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
