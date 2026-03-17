import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { FiChevronLeft, FiCamera, FiX, FiActivity, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { createPortal } from 'react-dom';
import './PastPregnancySummaryDashboard.css';

export default function PastPregnancySummaryDashboard({ pregnancy, onBack }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Data
  const [weightData, setWeightData] = useState([]);
  const [cravingsList, setCravingsList] = useState([]);
  const [aversionsList, setAversionsList] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [symptomsCount, setSymptomsCount] = useState({});

  // Slideshow State
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (pregnancy) {
      fetchAllData();
    }
  }, [pregnancy]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Diary Entries
      const { data: diaryData, error: diaryError } = await supabase
        .from('pregnancy_diary_entries')
        .select('*')
        .eq('pregnancy_id', pregnancy.id)
        .order('week_number', { ascending: true });

      if (diaryError) throw diaryError;

      const cravings = [];
      const aversions = [];
      const extractedPhotos = [];
      const symptomsAgg = {};

      // Add test photo as first photo if it exists
      if (pregnancy.test_photo_url) {
        extractedPhotos.push({
          url: pregnancy.test_photo_url,
          label: 'Teste de Gravidez 💗',
          date: pregnancy.created_at
        });
      }

      if (diaryData) {
        diaryData.forEach(entry => {
          if (entry.cravings && entry.cravings.trim() !== '') {
            cravings.push({ week: entry.week_number, text: entry.cravings });
          }
          if (entry.aversions && entry.aversions.trim() !== '') {
            aversions.push({ week: entry.week_number, text: entry.aversions });
          }
          if (entry.belly_photo_url) {
            extractedPhotos.push({
              url: entry.belly_photo_url,
              label: `Semana ${entry.week_number}`,
              date: entry.updated_at || entry.created_at
            });
          }
          if (entry.symptoms) {
            entry.symptoms.forEach(s => {
              const baseSymptom = s.split(' ')[0]; // just get emoji
              symptomsAgg[baseSymptom] = (symptomsAgg[baseSymptom] || 0) + 1;
            });
          }
        });
      }

      setCravingsList(cravings);
      setAversionsList(aversions);
      setPhotos(extractedPhotos);
      setSymptomsCount(symptomsAgg);

      // 2. Fetch Weight Data
      // Filtering health_records for this pregnancy's timeframe
      const conceptionStr = new Date(pregnancy.conception_date).toISOString().split('T')[0];
      // Approximation for end of pregnancy (+1 year just to be safe if no due date)
      const endStr = pregnancy.due_date ? new Date(pregnancy.due_date).toISOString() : new Date(new Date(pregnancy.conception_date).getTime() + (365 * 24 * 60 * 60 * 1000)).toISOString();

      const { data: healthData, error: healthError } = await supabase
        .from('health_records')
        .select('value, recorded_at')
        .eq('user_id', user.id)
        .is('child_id', null)
        .eq('record_type', 'pregnancy_weight')
        .gte('recorded_at', conceptionStr)
        .lte('recorded_at', endStr)
        .order('recorded_at', { ascending: true });

      if (!healthError && healthData) {
        const chartData = healthData.map(record => {
          // Calculate week
          const recordDate = new Date(record.recorded_at);
          const concepthDate = new Date(pregnancy.conception_date);
          const diffMs = recordDate - concepthDate;
          const week = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
          
          return {
            date: record.recorded_at.split('T')[0],
            week: week > 0 ? week : 0,
            weight: parseFloat(record.value)
          };
        });
        
        // Remove duplicates per week if any
        const uniqueChartData = [];
        const seenWeeks = new Set();
        chartData.forEach(item => {
          if (!seenWeeks.has(item.week)) {
            seenWeeks.add(item.week);
            uniqueChartData.push(item);
          }
        });

        // Sort by week ascending
        uniqueChartData.sort((a, b) => a.week - b.week);
        setWeightData(uniqueChartData);
      }

    } catch (err) {
      console.error("Error fetching past pregnancy data:", err);
    } finally {
      setLoading(false);
    }
  };

  const openSlideshow = (index = 0) => {
    setCurrentSlideIndex(index);
    setIsSlideshowOpen(true);
  };

  const nextSlide = () => {
    setCurrentSlideIndex(prev => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlideIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="past-pregnancy-summary animate-fade-in">
        <button className="btn-back-modules" onClick={onBack}>
          <FiChevronLeft /> Voltar
        </button>
        <div className="spinner-container"><div className="spinner"></div></div>
      </div>
    );
  }

  // Find top symptoms
  const topSymptoms = Object.entries(symptomsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="past-pregnancy-summary animate-fade-in">
      <button className="btn-back-modules" onClick={onBack}>
        <FiChevronLeft /> Voltar para o Menu
      </button>

      <div className="hero-card summary-hero">
        <div className="hero-emoji">🤰</div>
        <h2 className="hero-title">{pregnancy.year_label}</h2>
        <p className="hero-subtitle">
          Um resumo cheio de amor dessa jornada incrível.
        </p>
      </div>

      <div className="summary-grid">
        {/* Slideshow Card */}
        <div className="summary-card photos-card">
          <div className="card-header">
            <h3><FiCamera /> Memórias da Barriga</h3>
          </div>
          {photos.length > 0 ? (
            <div className="photos-preview" onClick={() => openSlideshow(0)}>
              <div className="photo-stack">
                <img src={photos[0].url} alt="Cover" className="photo-preview-img" />
                <div className="photo-count-overlay">
                  +{photos.length - 1} fotos
                </div>
              </div>
              <p>Clique para ver a evolução</p>
            </div>
          ) : (
            <p className="empty-text">Nenhuma foto registrada na época.</p>
          )}
        </div>

        {/* Symptoms & Cravings */}
        <div className="summary-card details-card">
          <div className="card-header">
            <h3><FiThumbsUp /> Desejos & <FiThumbsDown /> Aversões</h3>
          </div>
          <div className="cravings-list mb-4">
            {cravingsList.length > 0 ? (
              <div className="tags-container">
                {cravingsList.map((c, i) => (
                  <span key={i} className="craving-tag">🍓 {c.text} (Sem. {c.week})</span>
                ))}
              </div>
            ) : <p className="empty-text text-sm">Nenhum desejo registrado.</p>}
          </div>
          <div className="aversions-list">
            {aversionsList.length > 0 ? (
              <div className="tags-container">
                {aversionsList.map((a, i) => (
                  <span key={i} className="aversion-tag">🤢 {a.text} (Sem. {a.week})</span>
                ))}
              </div>
            ) : <p className="empty-text text-sm">Nenhuma aversão registrada.</p>}
          </div>
          
          {topSymptoms.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2 text-gray-600">Sintomas mais comuns:</h4>
              <div className="flex gap-2">
                {topSymptoms.map(([emoji, count]) => (
                  <span key={emoji} className="symptom-count-tag" title={`${count} vezes`}>
                    {emoji} <small>x{count}</small>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Weight Chart */}
        <div className="summary-card col-span-full">
          <div className="card-header">
            <h3><FiActivity /> Evolução do Peso</h3>
          </div>
          {weightData.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="week" 
                    tickFormatter={(week) => `S${week}`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                  />
                  <YAxis 
                    domain={['dataMin - 2', 'dataMax + 2']}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                    labelFormatter={(week) => `Semana ${week}`}
                    formatter={(val) => [`${val} kg`, 'Peso']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="var(--pink-dark)" 
                    strokeWidth={4}
                    dot={{ fill: 'var(--lilac-dark)', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="empty-text text-center mt-4 text-gray-500">Nenhum peso foi registrado nesta gestação.</p>
          )}
        </div>
      </div>

      {/* Slideshow Portal */}
      {isSlideshowOpen && createPortal(
        <div className="slideshow-overlay animate-fade-in" onClick={() => setIsSlideshowOpen(false)}>
          <button className="slideshow-close-btn"><FiX /></button>
          <div className="slideshow-content" onClick={e => e.stopPropagation()}>
            <img 
              src={photos[currentSlideIndex].url} 
              alt={photos[currentSlideIndex].label} 
              className="slideshow-main-img" 
            />
            <div className="slideshow-footer">
              <h3>{photos[currentSlideIndex].label}</h3>
              <p>{new Date(photos[currentSlideIndex].date).toLocaleDateString('pt-BR')}</p>
              
              <div className="slideshow-controls">
                <button className="nav-btn" onClick={prevSlide}>&larr; Anterior</button>
                <div className="slideshow-dots">
                  {photos.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`dot ${idx === currentSlideIndex ? 'active' : ''}`}
                      onClick={() => setCurrentSlideIndex(idx)}
                    />
                  ))}
                </div>
                <button className="nav-btn" onClick={nextSlide}>Próxima &rarr;</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
