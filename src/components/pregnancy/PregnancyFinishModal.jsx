import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { FiX } from 'react-icons/fi';
import './PregnancyFinishModal.css';

export default function PregnancyFinishModal({ pregnancy, onClose, onFinish }) {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const markPregnancyStatus = async (status) => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('pregnancies')
        .update({ status: status })
        .eq('id', pregnancy.id);
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error(`Error updating pregnancy to ${status}:`, err);
      alert("Erro ao atualizar o status da gestação.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterBaby = async () => {
    if (!birthDate) {
      alert("Por favor, informe a data de nascimento do bebê.");
      return;
    }

    const success = await markPregnancyStatus('completed');
    if (success) {
      onFinish(); // To trigger list refresh in background
      onClose();
      // Redirect to Baby module with predefined birth date
      navigate('/dashboard/baby', { state: { initialBirthDate: birthDate } });
    }
  };

  const handleCancelPregnancy = async () => {
    if (window.confirm("Você tem certeza? Isso vai encerrar a gestação sem registrar um bebê.")) {
      const success = await markPregnancyStatus('cancelled');
      if (success) {
        onFinish();
        onClose();
      }
    }
  };

  return createPortal(
    <div className="modal-backdrop">
      <div className="modal-content finish-pregnancy-modal animate-fade-in">
        <button className="modal-close" onClick={onClose}>
          <FiX />
        </button>
        
        <h2 className="modal-title">Parabéns pela nova vida! 🎉💖</h2>
        <p className="modal-subtitle">
          Que momento especial! Para continuarmos acompanhando o desenvolvimento, 
          qual a data de nascimento do(a) seu(sua) filho(a)?
        </p>

        <div className="finish-form">
          <div className="form-group">
            <label>Data de nascimento do bebê</label>
            <input 
              type="date" 
              className="input-field" 
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          <div className="modal-actions-column">
            <button 
              className="btn btn-primary btn-large finish-main-btn" 
              onClick={handleRegisterBaby}
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : 'Cadastrar novo bebê 👶'}
            </button>
            
            <button 
              className="btn btn-ghost cancel-loss-btn" 
              onClick={handleCancelPregnancy}
              disabled={submitting}
            >
              Cancelar/Encerrar gestação
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
