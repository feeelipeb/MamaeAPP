import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';
import { FiPlus, FiX, FiPaperclip, FiTrash2 } from 'react-icons/fi';
import './PrenatalAppointmentsModule.css';

export default function PrenatalAppointmentsModule({ pregnancy }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState('Consulta de pré-natal');
  const [date, setDate] = useState('');
  const [doctor, setDoctor] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAppointments();
  }, [pregnancy.id]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('prenatal_appointments')
        .select('*')
        .eq('pregnancy_id', pregnancy.id)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setType('Consulta de pré-natal');
    setDate('');
    setDoctor('');
    setNotes('');
    setFile(null);
  };

  const handleSaveAppointment = async (e) => {
    e.preventDefault();
    if (!date) return;

    setSubmitting(true);
    try {
      let fileUrl = null;

      // Upload file if exists
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${pregnancy.id}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('prenatal-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('prenatal-files')
          .getPublicUrl(filePath);
        
        fileUrl = urlData.publicUrl;
      }

      // Insert record
      const { data, error } = await supabase
        .from('prenatal_appointments')
        .insert({
          pregnancy_id: pregnancy.id,
          user_id: user.id,
          appointment_date: date,
          appointment_type: type,
          doctor_name: doctor,
          notes,
          file_url: fileUrl
        })
        .select()
        .single();
        
      if (error) throw error;

      // Update state directly or refetch
      setAppointments(prev => [data, ...prev].sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)));
      closeAndResetModal();
      
    } catch (err) {
      console.error("Error saving appointment:", err);
      alert("Erro ao salvar consulta. O bucket 'prenatal-files' foi criado?");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este registro?")) return;
    try {
      const { error } = await supabase.from('prenatal_appointments').delete().eq('id', id);
      if (error) throw error;
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir.");
    }
  };

  const getIconForType = (typeKey) => {
    if (typeKey.includes('Consulta')) return '🩺';
    if (typeKey.includes('Ultrassom')) return '🔊';
    if (typeKey.includes('Exame')) return '🧪';
    return '📋';
  };

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="prenatal-module animate-fade-in">
      <div className="internal-header flex-header">
        <h2>Consultas e Exames 🏥</h2>
        <button className="btn btn-primary add-appointment-btn" onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Adicionar
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-large">🩺</div>
          <h3>Nenhuma consulta registrada ainda</h3>
          <p>Registre suas consultas e exames para não perder nenhum detalhe</p>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map(appt => (
            <div key={appt.id} className="appointment-card">
              <div className="appt-icon">{getIconForType(appt.appointment_type)}</div>
              
              <div className="appt-content">
                <div className="appt-header">
                  <h3 className="appt-type">{appt.appointment_type}</h3>
                  <span className="appt-date">
                    {new Date(appt.appointment_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </span>
                </div>
                
                {appt.doctor_name && <p className="appt-doctor">👨‍⚕️ {appt.doctor_name}</p>}
                
                {appt.notes && (
                  <p className="appt-notes">{appt.notes}</p>
                )}
                
                {appt.file_url && (
                  <a href={appt.file_url} target="_blank" rel="noopener noreferrer" className="appt-file-link">
                    <FiPaperclip /> Ver anexo
                  </a>
                )}
              </div>

              <button className="btn-icon delete-appt-btn" onClick={() => handleDelete(appt.id)} title="Excluir">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && createPortal(
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in prenatal-modal">
            <button className="modal-close" onClick={closeAndResetModal}>
              <FiX />
            </button>
            
            <h2 className="modal-title">Nova Consulta/Exame</h2>
            
            <form onSubmit={handleSaveAppointment} className="appt-form">
              <div className="form-group">
                <label>Tipo *</label>
                <select 
                  className="input-field" 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option>Consulta de pré-natal</option>
                  <option>Ultrassom</option>
                  <option>Exame de sangue</option>
                  <option>Outro</option>
                </select>
              </div>

              <div className="form-group">
                <label>Data *</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nome do médico/clínica</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ex: Dra. Juliana Silva"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Observações</label>
                <textarea 
                  className="input-field" 
                  placeholder="Dúvidas, pressões arteriais, peso medido lá..."
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Anexo (Exame/Receita)</label>
                <input 
                  type="file" 
                  className="input-field file-input" 
                  accept="image/*,.pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={closeAndResetModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Salvar registro'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
