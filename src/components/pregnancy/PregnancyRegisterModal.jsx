import { createPortal } from 'react-dom';
import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { FiX, FiCamera } from 'react-icons/fi';
import './PregnancyRegisterModal.css';

export default function PregnancyRegisterModal({ onClose, onSuccess }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    discoveryDate: '',
    conceptionDate: '',
    dueDate: '',
    photoFile: null,
    photoPreview: null
  });
  const [submitting, setSubmitting] = useState(false);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photoFile: file,
        photoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const calculateDueDate = (conceptionStr) => {
    if (!conceptionStr) return;
    const conception = new Date(conceptionStr);
    // Standard calculation: add 266 days (38 weeks from conception)
    const due = new Date(conception.getTime() + (266 * 24 * 60 * 60 * 1000));
    return due.toISOString().split('T')[0];
  };

  const handleConceptionChange = (e) => {
    const val = e.target.value;
    const autoDue = calculateDueDate(val);
    setFormData(prev => ({ ...prev, conceptionDate: val, dueDate: autoDue || prev.dueDate }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.conceptionDate) {
      alert("Por favor, preencha a data de concepção.");
      return;
    }

    setSubmitting(true);

    try {
      let photoUrl = null;

      // 1. Upload foto (se existir)
      if (formData.photoFile) {
        const fileExt = formData.photoFile.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pregnancy-photos')
          .upload(filePath, formData.photoFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('pregnancy-photos')
          .getPublicUrl(filePath);
        
        photoUrl = urlData.publicUrl;
      }

      // 2. Insert gravidez no DB
      const year = new Date(formData.conceptionDate).getFullYear();
      
      const { error: insertError } = await supabase
        .from('pregnancies')
        .insert({
          user_id: user.id,
          conception_date: formData.conceptionDate,
          discovery_date: formData.discoveryDate || null,
          due_date: formData.dueDate || null,
          test_photo_url: photoUrl,
          status: 'active',
          year_label: `Gravidez - ${year}`,
          // current_week is not needed to set statically here, it'll be calculated dynamically
          current_week: 0
        });

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        throw new Error(`Erro ao registrar gravidez: ${insertError.message}`);
      }

      // 3. Sucesso central
      onSuccess(); // The parent will show the toast and update

    } catch (error) {
      console.error("Erro no processo de salvamento:", error);
      alert(error.message || "Ocorreu um erro ao registrar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="modal-backdrop">
      <div className="modal-content pregnancy-modal animate-fade-in">
        <button className="modal-close" onClick={onClose}>
          <FiX />
        </button>
        
        <h2 className="modal-title">Registrar Gravidez</h2>
        <p className="modal-subtitle">Que alegria! Vamos guardar cada detalhe.</p>
        
        <form onSubmit={handleSubmit} className="pregnancy-form">
          {/* Photo Upload */}
          <div className="form-group photo-group">
            <div className="photo-upload-wrapper pregnancy" onClick={handlePhotoClick}>
              {formData.photoPreview ? (
                <img src={formData.photoPreview} alt="Preview" className="photo-preview" />
              ) : (
                <div className="photo-upload-placeholder">
                  ➕ 📸
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden-input" 
              />
            </div>
            <p className="photo-hint">Foto do teste (opcional)</p>
          </div>

          <div className="form-row">
            {/* Discovery Date */}
            <div className="form-group">
              <label>Data da descoberta (Opcional)</label>
              <input 
                type="date" 
                className="input-field" 
                value={formData.discoveryDate}
                onChange={(e) => setFormData({...formData, discoveryDate: e.target.value})}
              />
            </div>
          </div>

          <div className="form-row">
            {/* Conception Date */}
            <div className="form-group half">
              <label>Data de concepção (aprox.) *</label>
              <input 
                type="date" 
                className="input-field" 
                value={formData.conceptionDate}
                onChange={handleConceptionChange}
                required
              />
            </div>

            {/* Due Date */}
            <div className="form-group half">
              <label>Parto previsto (Opcional)</label>
              <input 
                type="date" 
                className="input-field" 
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Registrar minha gestação 💕'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
