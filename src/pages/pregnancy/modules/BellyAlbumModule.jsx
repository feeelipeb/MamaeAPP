import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';
import { FiCamera, FiX, FiPlus } from 'react-icons/fi';
import './BellyAlbumModule.css';

export default function BellyAlbumModule({ pregnancy, currentWeek }) {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // For fullscreen view

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAlbum();
  }, [pregnancy.id]);

  const fetchAlbum = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pregnancy_diary_entries')
        .select('id, week_number, belly_photo_url, updated_at, created_at')
        .eq('pregnancy_id', pregnancy.id)
        .not('belly_photo_url', 'is', null)
        .order('week_number', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (err) {
      console.error("Error fetching belly photos", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Create bucket 'belly-photos' path
      const fileExt = file.name.split('.').pop();
      const fileName = `${pregnancy.id}_week${currentWeek}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('belly-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('belly-photos')
        .getPublicUrl(filePath);
      
      const photoUrl = urlData.publicUrl;

      // Upsert into pregnancy_diary_entries
      // Check if entry for currentWeek exists
      const { data: existing } = await supabase
        .from('pregnancy_diary_entries')
        .select('id')
        .eq('pregnancy_id', pregnancy.id)
        .eq('week_number', currentWeek)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('pregnancy_diary_entries')
          .update({ belly_photo_url: photoUrl })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('pregnancy_diary_entries')
          .insert({
            pregnancy_id: pregnancy.id,
            user_id: user.id,
            week_number: currentWeek,
            belly_photo_url: photoUrl
          });
        if (error) throw error;
      }

      await fetchAlbum();
      alert("Foto salva com sucesso! 📸");

    } catch (err) {
      console.error("Upload error", err);
      // alert("Erro ao salvar foto. O bucket 'belly-photos' já foi criado no Supabase?");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="belly-album-module animate-fade-in">
      <div className="internal-header album-header">
        <h2>Álbum da Barriga 📸</h2>
      </div>

      {photos.length === 0 ? (
        <div className="empty-album-state">
          <div className="empty-camera-icon">📷</div>
          <h3>Registre a evolução da sua barriga semana a semana</h3>
          <p>Você vai se emocionar ao rever essas fotos!</p>
          
          <button 
            className="btn btn-primary btn-large upload-btn main-upload"
            onClick={handlePhotoClick}
            disabled={uploading}
          >
            {uploading ? 'Enviando...' : `📸 Adicionar foto da semana ${currentWeek}`}
          </button>
        </div>
      ) : (
        <>
          <div className="timeline-container">
            {photos.map(record => (
              <div key={record.id} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-week">Semana {record.week_number}</span>
                    <span className="timeline-date">
                      {new Date(record.updated_at || record.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div 
                    className="photo-card"
                    onClick={() => setSelectedPhoto(record)}
                  >
                    <img src={record.belly_photo_url} alt={`Semana ${record.week_number}`} className="belly-img" loading="lazy" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="fab-upload-btn"
            onClick={handlePhotoClick}
            disabled={uploading}
            title="Nova foto"
          >
            <FiPlus />
          </button>
        </>
      )}

      {/* Hidden File Input */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={uploadPhoto} 
        className="hidden-input"
        style={{ display: 'none' }}
      />

      {/* Fullscreen Viewer Modal */}
      {selectedPhoto && createPortal(
        <div className="fullscreen-viewer animate-fade-in" onClick={() => setSelectedPhoto(null)}>
          <button className="close-viewer-btn"><FiX /></button>
          <div className="viewer-content" onClick={e => e.stopPropagation()}>
            <img src={selectedPhoto.belly_photo_url} alt={`Semana ${selectedPhoto.week_number}`} className="viewer-img" />
            <div className="viewer-footer">
              <h3>Semana {selectedPhoto.week_number}</h3>
              <p>{new Date(selectedPhoto.updated_at || selectedPhoto.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
