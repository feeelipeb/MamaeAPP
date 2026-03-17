import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { FiPlus, FiX, FiCamera } from 'react-icons/fi';
import './BabyPage.css';

/** Util to calculate age */
function calculateAge(birthDate) {
  if (!birthDate) return '';
  const birth = new Date(birthDate);
  const now = new Date();
  
  const diffTime = Math.abs(now - birth);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
  }
  
  let months = (now.getFullYear() - birth.getFullYear()) * 12;
  months -= birth.getMonth();
  months += now.getMonth();
  
  if (now.getDate() < birth.getDate()) {
    months--;
  }
  
  if (months < 12) {
    return `${months} mês${months !== 1 ? 'es' : ''}`;
  }
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  let result = `${years} ano${years > 1 ? 's' : ''}`;
  if (remainingMonths > 0) {
    result += ` e ${remainingMonths} mês${remainingMonths > 1 ? 'es' : ''}`;
  }
  
  return result;
}

export default function BabyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const initialBirthDate = location.state?.initialBirthDate || '';

  const [babies, setBabies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(!!initialBirthDate);
  const [toastMessage, setToastMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    birthDate: initialBirthDate,
    gender: '',
    weight: '',
    photoFile: null,
    photoPreview: null
  });
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch babies
  useEffect(() => {
    if (!user) return;
    fetchBabies();
  }, [user]);

  const fetchBabies = async () => {
    setLoading(true);
    
    // Fetch children
    const { data: childrenData, error: childrenError } = await supabase
      .from('children')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (childrenError) {
      console.error('Error fetching children:', childrenError);
      setLoading(false);
      return;
    }

    if (!childrenData || childrenData.length === 0) {
      setBabies([]);
      setLoading(false);
      return;
    }

    // Fetch birth weights for these children
    const childIds = childrenData.map(c => c.id);
    const { data: healthData, error: healthError } = await supabase
      .from('health_records')
      .select('child_id, value')
      .in('child_id', childIds)
      .eq('record_type', 'birth_weight');

    if (healthError) {
      console.error('Error fetching health records:', healthError);
    }

    // Merge data
    const mergedBabies = childrenData.map(child => {
      const weightRecord = healthData?.find(h => h.child_id === child.id);
      return {
        ...child,
        birth_weight: weightRecord ? weightRecord.value : null
      };
    });

    setBabies(mergedBabies);
    setLoading(false);
  };

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

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      birthDate: '',
      gender: '',
      weight: '',
      photoFile: null,
      photoPreview: null
    });
    if (location.state?.initialBirthDate) {
      window.history.replaceState({}, document.title);
    }
  };

  const handleSaveBaby = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate || !formData.gender || !formData.weight) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSubmitting(true);

    try {
      let photoUrl = null;

      // 1. Upload photo if exists
      if (formData.photoFile) {
        const fileExt = formData.photoFile.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('children-photos')
          .upload(filePath, formData.photoFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('children-photos')
          .getPublicUrl(filePath);
        
        photoUrl = urlData.publicUrl;
      }

      // 1.5 Auto-heal profile se necessário
      const { data: profileCheck } = await supabase
        .from('users_profiles')
        .select('id')
        .eq('id', user.id)
        .single();
        
      if (!profileCheck) {
        const email = user.email || '';
        const name = user.user_metadata?.name || email.split('@')[0] || 'Mamãe';
        await supabase.from('users_profiles').insert({
          id: user.id,
          name: name,
          email: email,
        });
      }

      // 2. Insert into children
      const { data: newChild, error: insertError } = await supabase
        .from('children')
        .insert({
          user_id: user.id,
          name: formData.name,
          birth_date: formData.birthDate,
          gender: formData.gender,
          photo_url: photoUrl
        })
        .select()
        .single();

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        throw new Error(`Erro no banco de dados ao salvar bebê: ${insertError.message}`);
      }

      // 3. Insert birth weight into health_records
      const { error: healthError } = await supabase
        .from('health_records')
        .insert({
          child_id: newChild.id,
          record_type: 'birth_weight',
          value: parseFloat(formData.weight),
          recorded_at: formData.birthDate
        });

      if (healthError) {
        console.error("Supabase health record error:", healthError);
        throw new Error(`Erro ao salvar histórico de peso: ${healthError.message}`);
      }

      // Success!
      showToast('Bebê cadastrado com sucesso! 🎉');
      
      // Update local state without re-fetching everything
      setBabies(prev => [...prev, { ...newChild, birth_weight: formData.weight }]);
      closeAndResetModal();

    } catch (error) {
      console.error("Error saving baby process:", error);
      alert(error.message || "Ocorreu um erro ao salvar o bebê. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  if (loading) {
    return (
      <div className="baby-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="baby-page animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification animate-slide-in">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <header className="baby-header">
        <h1>Meus Bebês 👶</h1>
        <button className="btn btn-primary add-baby-btn" onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Adicionar Bebê
        </button>
      </header>

      {/* Main Content */}
      <div className="baby-content">
        {babies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🍼</div>
            <h2>Ainda não há bebês cadastrados</h2>
            <p>Clique em "+ Adicionar Bebê" para criar sua família!</p>
          </div>
        ) : (
          <div className="baby-list">
            {babies.map((baby) => (
              <div key={baby.id} className="baby-list-card">
                <div className="baby-card-photo">
                  {baby.photo_url ? (
                    <img src={baby.photo_url} alt={baby.name} />
                  ) : (
                    <div className="baby-avatar-placeholder">🧒</div>
                  )}
                </div>
                
                <div className="baby-card-info">
                  <h3 className="baby-name">{baby.name}</h3>
                  <div className="baby-age">
                    {calculateAge(baby.birth_date)}
                  </div>
                  <div className="baby-details">
                    <p>Nasceu em {new Date(baby.birth_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                    {baby.birth_weight && (
                      <p>Nasceu com {baby.birth_weight} kg</p>
                    )}
                  </div>
                </div>

                <div className="baby-card-action">
                  <button 
                    className="btn btn-ghost details-btn"
                    onClick={() => navigate(`/dashboard/baby/${baby.id}`)}
                  >
                    Ver detalhes &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Baby Modal via Portal */}
      {isModalOpen && createPortal(
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in">
            <button className="modal-close" onClick={closeAndResetModal}>
              <FiX />
            </button>
            
            <h2 className="modal-title">Cadastrar Bebê</h2>
            
            <form onSubmit={handleSaveBaby} className="baby-form">
              {/* Photo Upload */}
              <div className="form-group photo-group">
                <div className="photo-upload-wrapper" onClick={handlePhotoClick}>
                  {formData.photoPreview ? (
                    <img src={formData.photoPreview} alt="Preview" className="photo-preview" />
                  ) : (
                    <div className="photo-upload-placeholder">
                      <FiCamera />
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
                <p className="photo-hint">Adicionar foto (opcional)</p>
              </div>

              {/* Name */}
              <div className="form-group">
                <label>Nome do bebê *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Como vai se chamar? 🥰"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                {/* Birth Date */}
                <div className="form-group half">
                  <label>Data de nascimento *</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    required
                  />
                </div>

                {/* Birth Weight */}
                <div className="form-group half">
                  <label>Peso ao nascer (kg) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    className="input-field" 
                    placeholder="Ex: 3.2"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="form-group">
                <label>Sexo *</label>
                <div className="gender-selector">
                  <button 
                    type="button" 
                    className={`gender-card boy ${formData.gender === 'male' ? 'active' : ''}`}
                    onClick={() => handleGenderSelect('male')}
                  >
                    <span className="gender-emoji">💙</span>
                    Menino
                  </button>
                  <button 
                    type="button" 
                    className={`gender-card girl ${formData.gender === 'female' ? 'active' : ''}`}
                    onClick={() => handleGenderSelect('female')}
                  >
                    <span className="gender-emoji">💗</span>
                    Menina
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={closeAndResetModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Salvar bebê 💕'}
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
