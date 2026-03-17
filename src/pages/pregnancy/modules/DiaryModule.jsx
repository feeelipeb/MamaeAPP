import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';
import './DiaryModule.css';

const SYMPTOMS_LIST = [
  "🤢 Náusea", "😴 Cansaço extremo", "😵 Tontura", "🤕 Dor de cabeça",
  "😤 Azia", "🚽 Constipação", "💤 Insônia", "😢 Choro fácil",
  "🦶 Pés inchados", "💗 Coração acelerado", "🤸 Dor nas costas", "😰 Ansiedade"
];

export default function DiaryModule({ pregnancy, currentWeek }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [history, setHistory] = useState([]);

  // Form State
  const [entryId, setEntryId] = useState(null);
  const [emotionalNote, setEmotionalNote] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [cravings, setCravings] = useState('');
  const [aversions, setAversions] = useState('');
  const [feltMovement, setFeltMovement] = useState(false);
  const [movementDate, setMovementDate] = useState('');
  const [movementNote, setMovementNote] = useState('');

  useEffect(() => {
    fetchDiaryEntry();
    fetchHistory();
  }, [pregnancy.id, currentWeek]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('pregnancy_diary_entries')
        .select('*')
        .eq('pregnancy_id', pregnancy.id)
        .order('week_number', { ascending: false });
      
      if (!error && data) {
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDiaryEntry = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pregnancy_diary_entries')
        .select('*')
        .eq('pregnancy_id', pregnancy.id)
        .eq('week_number', currentWeek)
        .single();
      
      // If no row is returned, error is code 'PGRST116' (No rows found).
      if (data) {
        setEntryId(data.id);
        setEmotionalNote(data.emotional_note || '');
        setSelectedSymptoms(data.symptoms || []);
        setCravings(data.cravings || '');
        setAversions(data.aversions || '');
        
        if (data.first_movement_date) {
          setFeltMovement(true);
          setMovementDate(data.first_movement_date);
          setMovementNote(data.first_movement_note || '');
        }
      }
    } catch (err) {
      console.log("No existing entry found for this week, starting fresh.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (symp) => {
    setSelectedSymptoms(prev => 
      prev.includes(symp) 
      ? prev.filter(s => s !== symp)
      : [...prev, symp]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        pregnancy_id: pregnancy.id,
        user_id: user.id,
        week_number: currentWeek,
        emotional_note: emotionalNote,
        symptoms: selectedSymptoms,
        cravings,
        aversions,
        first_movement_date: feltMovement ? movementDate : null,
        first_movement_note: feltMovement ? movementNote : null
      };

      if (entryId) {
        // Update
        const { error } = await supabase
          .from('pregnancy_diary_entries')
          .update(payload)
          .eq('id', entryId);
        if (error) throw error;
      } else {
        // Insert
        const { data, error } = await supabase
          .from('pregnancy_diary_entries')
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        setEntryId(data.id);
      }

      showToast("Diário salvo! Que momento precioso 🌸");
      fetchHistory(); // refresh history to show current change if needed
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar diário.");
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="diary-module animate-fade-in">
      {toast && <div className="toast-notification animate-slide-in">{toast}</div>}
      
      <div className="internal-header">
        <h2>Semana {currentWeek} — Meu Diário 📝</h2>
        <p className="subtitle">{new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      <div className="diary-section">
        <label>Como estou me sentindo: 💬</label>
        <textarea
          className="input-field diary-textarea"
          placeholder="Conte como foi sua semana, seus medos, alegrias, pensamentos..."
          value={emotionalNote}
          onChange={(e) => setEmotionalNote(e.target.value)}
        />
      </div>

      <div className="diary-section">
        <label>O que você sentiu? 🌡️</label>
        <div className="symptoms-grid">
          {SYMPTOMS_LIST.map((symp, i) => {
            const isSelected = selectedSymptoms.includes(symp);
            return (
              <button
                key={i}
                type="button"
                className={`symptom-toggle ${isSelected ? 'active' : ''}`}
                onClick={() => toggleSymptom(symp)}
              >
                {symp}
              </button>
            );
          })}
        </div>
      </div>

      <div className="diary-section">
        <label>Desejos e aversões 🍓</label>
        <input 
          type="text" 
          className="input-field mb-2" 
          placeholder="Tô com desejo de..."
          value={cravings}
          onChange={(e) => setCravings(e.target.value)}
        />
        <input 
          type="text" 
          className="input-field" 
          placeholder="Não consigo mais ver..."
          value={aversions}
          onChange={(e) => setAversions(e.target.value)}
        />
      </div>

      {currentWeek >= 16 && (
        <div className="diary-section movement-section">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={feltMovement}
              onChange={(e) => setFeltMovement(e.target.checked)}
            />
            Já senti o bebê se mexer? 🥰
          </label>
          
          {feltMovement && (
            <div className="movement-details animate-fade-in">
              <input 
                type="date" 
                className="input-field mb-2"
                value={movementDate}
                onChange={(e) => setMovementDate(e.target.value)}
              />
              <textarea 
                className="input-field"
                placeholder="Como foi esse momento?"
                value={movementNote}
                onChange={(e) => setMovementNote(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      <button 
        className="btn btn-primary save-diary-btn" 
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Salvando...' : 'Salvar diário desta semana 💕'}
      </button>

      {history.filter(h => h.week_number !== currentWeek).length > 0 && (
        <div className="diary-history-section pt-6 mt-8 border-t border-gray-100">
          <h3 className="history-title">Diários Anteriores 📖</h3>
          <div className="history-list">
            {history
              .filter(h => h.week_number !== currentWeek)
              .map(entry => (
                <div key={entry.id} className="history-card">
                  <div className="history-week">Semana {entry.week_number}</div>
                  {entry.emotional_note && <p className="history-note">"{entry.emotional_note}"</p>}
                  
                  {entry.symptoms && entry.symptoms.length > 0 && (
                    <div className="history-symptoms">
                      {entry.symptoms.map((s, idx) => (
                        <span key={idx} className="symptom-tag">
                          {s.split(' ')[0]} {/* just emoji */}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
