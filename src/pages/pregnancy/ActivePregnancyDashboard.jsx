import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FiChevronLeft, FiCalendar, FiBook, FiActivity, FiImage, FiFileText, FiList } from 'react-icons/fi';
import './ActivePregnancyDashboard.css';

// Placeholder imports for modules
import CurrentWeekModule from './modules/CurrentWeekModule';
import DiaryModule from './modules/DiaryModule';
import WeightTrackerModule from './modules/WeightTrackerModule';
import BellyAlbumModule from './modules/BellyAlbumModule';
import PrenatalAppointmentsModule from './modules/PrenatalAppointmentsModule';
import BirthPlanModule from './modules/BirthPlanModule';
import PregnancyFinishModal from '../../components/pregnancy/PregnancyFinishModal';

export default function ActivePregnancyDashboard({ pregnancy, onPregnancyUpdate }) {
  const [activeModule, setActiveModule] = useState(null); // null = menu view
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [calculatedWeek, setCalculatedWeek] = useState(0);
  const [trimester, setTrimester] = useState({ num: 1, label: "1º Trimestre", colorClass: "tri-1" });

  useEffect(() => {
    if (pregnancy?.conception_date) {
      calculatePregnancyProgress(pregnancy.conception_date);
    }
  }, [pregnancy]);

  const calculatePregnancyProgress = (conceptionDateStr) => {
    const conception = new Date(conceptionDateStr);
    const now = new Date();
    
    // Difference in milliseconds
    const diffTime = Math.abs(now - conception);
    // Convert to weeks
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    // Cap at 40 weeks, ensure at least 0
    let currentWeek = Math.max(0, Math.min(40, diffWeeks));

    // Calculate Trimester
    let tri = { num: 1, label: "1º Trimestre", colorClass: "tri-1" };
    if (currentWeek >= 14 && currentWeek <= 26) {
      tri = { num: 2, label: "2º Trimestre", colorClass: "tri-2" };
    } else if (currentWeek >= 27) {
      tri = { num: 3, label: "3º Trimestre", colorClass: "tri-3" };
    }

    setCalculatedWeek(currentWeek);
    setTrimester(tri);
  };

  const handleFinishPregnancy = () => {
    setIsFinishModalOpen(true);
  };

  // Render Submodule view if one is selected
  if (activeModule) {
    return (
      <div className="active-pregnancy-dashboard sub-view animate-fade-in">
        <button 
          className="btn-back-modules" 
          onClick={() => setActiveModule(null)}
        >
          ‹ Voltar para o Menu
        </button>
        
        <div className="submodule-container">
          {activeModule === 'current_week' && <CurrentWeekModule pregnancy={pregnancy} currentWeek={calculatedWeek} />}
          {activeModule === 'diary' && <DiaryModule pregnancy={pregnancy} currentWeek={calculatedWeek} />}
          {activeModule === 'weight' && <WeightTrackerModule pregnancy={pregnancy} />}
          {activeModule === 'album' && <BellyAlbumModule pregnancy={pregnancy} currentWeek={calculatedWeek} />}
          {activeModule === 'appointments' && <PrenatalAppointmentsModule pregnancy={pregnancy} />}
          {activeModule === 'birth_plan' && <BirthPlanModule pregnancy={pregnancy} />}
        </div>
      </div>
    );
  }

  // Render Main Dashboard Grid
  return (
    <div className="active-pregnancy-dashboard main-view animate-fade-in">
      
      {/* Header Container */}
      <div className="pregnancy-header">
        <div className="header-topline">
          <h1>Minha Gestação 🤰</h1>
          <button className="btn-finish-pregnancy" onClick={handleFinishPregnancy}>
            Terminar Gestação
          </button>
        </div>
        
        <div className={`trimester-badge ${trimester.colorClass}`}>
          {trimester.label}
        </div>
        
        <div className="week-display">
          <h2>Semana {calculatedWeek} <span className="of-40">de 40</span></h2>
          <div className="progress-bar-bg">
            <div 
              className={`progress-bar-fill ${trimester.colorClass}`} 
              style={{ width: `${(calculatedWeek / 40) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Grid Menu */}
      <h3 className="menu-title">Acompanhamento</h3>
      <div className="pregnancy-modules-grid">
        <div className="module-card tri-1" onClick={() => setActiveModule('current_week')}>
          <div className="module-icon">📅</div>
          <span>Semana Atual</span>
        </div>
        
        <div className="module-card tri-2" onClick={() => setActiveModule('diary')}>
          <div className="module-icon">📝</div>
          <span>Meu Diário</span>
        </div>
        
        <div className="module-card tri-1" onClick={() => setActiveModule('weight')}>
          <div className="module-icon">⚖️</div>
          <span>Meu Peso</span>
        </div>
        
        <div className="module-card tri-3" onClick={() => setActiveModule('album')}>
          <div className="module-icon">📸</div>
          <span>Álbum da Barriga</span>
        </div>
        
        <div className="module-card tri-2" onClick={() => setActiveModule('appointments')}>
          <div className="module-icon">🏥</div>
          <span>Consultas e Exames</span>
        </div>
        
        <div className="module-card tri-3" onClick={() => setActiveModule('birth_plan')}>
          <div className="module-icon">📋</div>
          <span>Plano de Parto</span>
        </div>
      </div>
      
      {isFinishModalOpen && (
        <PregnancyFinishModal
          pregnancy={pregnancy}
          onClose={() => setIsFinishModalOpen(false)}
          onFinish={onPregnancyUpdate}
        />
      )}
    </div>
  );
}
