import { useState } from 'react';
import PregnancyRegisterModal from './PregnancyRegisterModal';
import './PregnancyEmptyState.css';

export default function PregnancyEmptyState({ completedPregnancies, onPregnancyCreated, onSelectPastPregnancy }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="pregnancy-empty-state">
      <div className="empty-state-content">
        <div className="illustration-wrapper">
          <div className="pregnant-illustration">🤰</div>
        </div>
        
        <h2>Que notícia incrível te espera? 🌸</h2>
        <p>Registre sua gestação e acompanhe cada semana dessa jornada.</p>
        
        <button 
          className="btn btn-primary start-pregnancy-btn"
          onClick={() => setIsModalOpen(true)}
        >
          💗 Estou grávida!
        </button>
      </div>

      {completedPregnancies && completedPregnancies.length > 0 && (
        <div className="past-pregnancies-section">
          <h3>Gestações anteriores</h3>
          <div className="past-pregnancies-list">
            {completedPregnancies.map(p => (
              <div 
                key={p.id} 
                className="past-pregnancy-card"
                onClick={() => onSelectPastPregnancy && onSelectPastPregnancy(p)}
                style={{ cursor: 'pointer' }}
              >
                <span className="year-label">{p.year_label}</span>
                <div className="past-dates">
                  <small>Concepção: {new Date(p.conception_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</small>
                  <small>Parto previsto: {new Date(p.due_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <PregnancyRegisterModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            onPregnancyCreated();
          }}
        />
      )}
    </div>
  );
}
