import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FiArrowLeft, FiCamera } from 'react-icons/fi';
import './BabyDetailPage.css';

// Reuse age calculation
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

const futureModules = [
  { id: 'sleep', title: 'Sono', emoji: '😴', description: 'Registre sonecas e noites' },
  { id: 'food', title: 'Alimentação', emoji: '🍼', description: 'Mamadas e introdução' },
  { id: 'conquistas', title: 'Conquistas', emoji: '🏆', description: 'Marcos de desenvolvimento' },
  { id: 'vaccines', title: 'Vacinas', emoji: '💉', description: 'Calendário em dia' },
  { id: 'activities', title: 'Atividades', emoji: '🎮', description: 'Marcos de desenvolvimento' }
];

export default function BabyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [baby, setBaby] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchBabyDetails() {
      try {
        const { data, error } = await supabase
          .from('children')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setBaby(data);
      } catch (err) {
        console.error("Error fetching baby details:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchBabyDetails();
    }
  }, [id]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !baby || !baby.user_id) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${baby.user_id}_${baby.id}_${Date.now()}.${fileExt}`;
    const filePath = `${baby.user_id}/${fileName}`;

    // Upload to children-photos bucket
    const { error: uploadError } = await supabase.storage
      .from('children-photos')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      alert('Erro ao enviar a imagem. Tente novamente.');
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('children-photos')
      .getPublicUrl(filePath);

    const photoUrl = urlData.publicUrl;

    // Update child record
    const { error: updateError } = await supabase
      .from('children')
      .update({ photo_url: photoUrl })
      .eq('id', baby.id);

    if (updateError) {
      console.error('Update error:', updateError);
      alert('Erro ao atualizar o perfil do bebê.');
    } else {
      setBaby(prev => ({ ...prev, photo_url: photoUrl }));
    }
    
    setUploading(false);
  };

  if (loading) {
    return <div className="baby-detail-loading"><div className="spinner" /></div>;
  }

  if (!baby) {
    return (
      <div className="baby-detail-page animate-fade-in text-center">
        <h2>Bebê não encontrado</h2>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>Voltar</button>
      </div>
    );
  }

  const ageText = calculateAge(baby.birth_date);

  return (
    <div className="baby-detail-page animate-fade-in">
      <button className="btn btn-ghost back-btn" onClick={() => navigate('/dashboard/baby')}>
        <FiArrowLeft /> Voltar para Meus Bebês
      </button>

      {/* Header Profile */}
      <div className="baby-profile-header">
        <div className="baby-profile-photo" onClick={() => fileInputRef.current?.click()}>
          {baby.photo_url ? (
            <img src={baby.photo_url} alt={baby.name} />
          ) : (
            <div className="baby-profile-placeholder">🧒</div>
          )}
          <div className={`baby-camera-overlay ${uploading ? 'uploading' : ''}`}>
            {uploading ? <div className="mini-spinner" /> : <FiCamera />}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="baby-avatar-input"
            onChange={handleAvatarUpload}
          />
        </div>
        <h1 className="baby-profile-name">{baby.name}</h1>
        <div className="baby-profile-age">{ageText}</div>
        <p className="baby-profile-birth">
          {new Date(baby.birth_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
        </p>
      </div>

      <div className="baby-modules-grid">
        {futureModules.map(mod => (
          <div key={mod.id} className="module-card soon">
            <div className="module-card-icon">{mod.emoji}</div>
            <h3>{mod.title}</h3>
            <p>{mod.description}</p>
            <div className="soon-badge"><span>✨</span> Em breve</div>
          </div>
        ))}
      </div>
    </div>
  );
}
