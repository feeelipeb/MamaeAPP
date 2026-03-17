import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiTrash2 } from 'react-icons/fi';
import './WeightTrackerModule.css';

export default function WeightTrackerModule({ pregnancy }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [weight, setWeight] = useState('');
  const [recordedAt, setRecordedAt] = useState(new Date().toISOString().split('T')[0]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchWeightHistory();
  }, [pregnancy.id]);

  const fetchWeightHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('record_type', 'pregnancy_weight')
        .eq('user_id', user.id)
        .is('child_id', null)
        .order('recorded_at', { ascending: true });

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error("Error fetching weights", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateWeekFromDate = (dateStr) => {
    const conception = new Date(pregnancy.conception_date);
    const recordDate = new Date(dateStr);
    const diffTime = recordDate - conception;
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)));
  };

  const handleSaveWeight = async (e) => {
    e.preventDefault();
    if (!weight) return;
    
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('health_records')
        .insert({
          record_type: 'pregnancy_weight',
          value: parseFloat(weight),
          recorded_at: recordedAt,
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setHistory(prev => [...prev, data]);
      setWeight('');
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar peso. Certifique-se de aplicar o SQL de correção na tabela health_records.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir este registro?")) return;
    try {
      const { error } = await supabase.from('health_records').delete().eq('id', id);
      if (error) throw error;
      setHistory(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir.");
    }
  };

  // Prepare chart data
  const chartData = history.map(record => ({
    name: `Sem. ${calculateWeekFromDate(record.recorded_at)}`,
    weight: record.value,
    date: record.recorded_at
  })).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="weight-tracker-module animate-fade-in">
      <div className="internal-header">
        <h2>Meu Peso ⚖️</h2>
      </div>

      <div className="content-card">
        <form onSubmit={handleSaveWeight} className="weight-form">
          <div className="form-group half">
            <label>Peso atual (kg)</label>
            <input 
              type="number" 
              step="0.1" 
              className="input-field" 
              placeholder="Ex: 65.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>
          <div className="form-group half">
            <label>Data da pesagem</label>
            <input 
              type="date" 
              className="input-field" 
              value={recordedAt}
              onChange={(e) => setRecordedAt(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Registrando...' : 'Registrar peso'}
          </button>
        </form>
      </div>

      <div className="content-card chart-card">
        <h3>Evolução do peso 📈</h3>
        {chartData.length > 0 ? (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#888'}} />
                <YAxis domain={['auto', 'auto']} tick={{fontSize: 12, fill: '#888'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} kg`, 'Peso']}
                  labelFormatter={(label) => `${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#D8B4FE" 
                  strokeWidth={4} 
                  dot={{ r: 5, fill: '#F9C6CE', stroke: '#fff', strokeWidth: 2 }} 
                  activeDot={{ r: 7 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="empty-text">Registre seu peso para visualizar o gráfico de evolução.</p>
        )}
      </div>

      <div className="content-card info-card">
        <div className="info-icon">ℹ️</div>
        <p>O ganho de peso saudável varia entre 11kg e 16kg ao longo da gestação. Converse sempre com seu médico.</p>
      </div>

      <div className="history-list">
        <h3>Histórico</h3>
        {history.length > 0 ? (
          history.slice().reverse().map(record => (
            <div key={record.id} className="history-item">
              <div>
                <span className="history-date">
                  {new Date(record.recorded_at).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </span>
                <span className="history-weight">{record.value} kg</span>
              </div>
              <button className="btn-icon delete-btn" onClick={() => handleDelete(record.id)}>
                <FiTrash2 />
              </button>
            </div>
          ))
        ) : (
          <p className="empty-text">Nenhum registro ainda.</p>
        )}
      </div>
    </div>
  );
}
