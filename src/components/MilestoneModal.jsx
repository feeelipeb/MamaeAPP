import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { FiX, FiCamera, FiCheck } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import './MilestoneModal.css';

export default function MilestoneModal({ milestone, childId, childName, childBirthDate, onClose, onSuccess }) {
  const { user } = useAuth();
  const [date, setDate] = useState(milestone?.milestone_date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(milestone?.notes || '');
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(milestone?.photo_url || null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoUrl(URL.createObjectURL(file));
    }
  };

  const calculateAgeOnDate = (birthDate, eventDate) => {
    const start = new Date(birthDate);
    const end = new Date(eventDate);
    
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const parts = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);
    if (days > 0) parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`);

    return parts.length > 0 ? `(com ${parts.join(', ')})` : '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let uploadedPhotoUrl = photoUrl;

      // 1. Upload photo if changed
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${user.id}/${childId}/${milestone.key}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('milestones-photos')
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('milestones-photos')
          .getPublicUrl(fileName);
        
        uploadedPhotoUrl = publicUrl;
      }

      // 2. Upsert milestone
      const { error: milestoneError } = await supabase
        .from('milestones')
        .upsert({
          user_id: user.id,
          child_id: childId,
          milestone_key: milestone.key,
          milestone_name: milestone.name,
          milestone_date: date,
          notes: notes,
          photo_url: uploadedPhotoUrl,
          is_achieved: true,
          is_required: milestone.required ?? true
        }, { onConflict: 'child_id, milestone_key' });

      if (milestoneError) throw milestoneError;

      // 3. Create/Update calendar event
      const { error: calendarError } = await supabase
        .from('calendar_events')
        .insert({
          user_id: user.id,
          child_id: childId,
          title: `🏆 ${milestone.name} — ${childName}`,
          event_date: date,
          type: 'milestone',
          color: '#D8B4FE'
        });

      if (calendarError) console.error('Error creating calendar event:', calendarError);

      // Celebration!
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F9C6CE', '#D8B4FE', '#FFF3E0']
      });

      // Wait for animation
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);

    } catch (err) {
      console.error('Error saving milestone:', err);
      alert('Erro ao salvar conquista: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container card animate-slide-up" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FiX /></button>
        
        <header className="modal-header">
          <span className="modal-trophy">🏆</span>
          <h2>{milestone?.is_achieved ? 'Editar Conquista' : 'Registrar Conquista'}</h2>
          <p className="milestone-name-title">{milestone.name}</p>
        </header>

        <form onSubmit={handleSave} className="milestone-form">
          <div className="form-group">
            <label>Data em que aconteceu *</label>
            <input 
              type="date" 
              required 
              value={date} 
              onChange={e => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
            {childBirthDate && date && (
              <span className="age-calculation">{calculateAgeOnDate(childBirthDate, date)}</span>
            )}
          </div>

          <div className="form-group photo-upload-group">
            <label>Foto do momento (opcional)</label>
            <div className="photo-preview-container" onClick={() => fileInputRef.current.click()}>
              {photoUrl ? (
                <img src={photoUrl} alt="Preview" className="photo-preview" />
              ) : (
                <div className="photo-placeholder">
                  <FiCamera size={32} />
                  <span>Toque para adicionar</span>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoChange} 
                accept="image/*" 
                hidden 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Observação da mãe (opcional)</label>
            <textarea 
              value={notes} 
              onChange={e => setNotes(e.target.value)}
              placeholder="Conte como foi esse momento... 💗"
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary btn-save" disabled={saving}>
              {saving ? 'Registrando...' : 'Registrar conquista 🏆'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
