import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiChevronLeft, FiChevronRight, FiPlus, FiX, 
  FiCalendar, FiClock, FiTag, FiTrash2,
  FiStar, FiCheckCircle, FiCamera, FiActivity, FiAward
} from 'react-icons/fi';
import { createPortal } from 'react-dom';
import './CalendarPage.css';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [dayEvents, setDayEvents] = useState([]);
  
  // New Event Form
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    type: 'custom' // 'custom', 'medical', 'personal', 'routine'
  });

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, currentDate.getMonth(), currentDate.getFullYear()]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const allFetchedEvents = [];

      // 1. Custom Events
      const { data: customEvents } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .neq('type', 'milestone') // Avoid duplicates with the milestones table fetch below
        .gte('event_date', startOfMonth.split('T')[0])
        .lte('event_date', endOfMonth.split('T')[0]);
      
      if (customEvents) {
        customEvents.forEach(e => allFetchedEvents.push({
          ...e,
          date: e.event_date,
          icon: <FiStar />,
          color: '#D8B4FE',
          category: 'Personalizado'
        }));
      }

      // 2. Child Birthdays
      const { data: children } = await supabase
        .from('children')
        .select('name, birth_date')
        .eq('user_id', user.id);
      
      if (children) {
        children.forEach(child => {
          if (child.birth_date) {
            const bDate = new Date(child.birth_date);
            // Check if month matches regardless of year
            if (bDate.getMonth() === currentDate.getMonth()) {
              allFetchedEvents.push({
                id: `bday-${child.name}`,
                title: `Aniversário: ${child.name} 🎂`,
                date: new Date(currentDate.getFullYear(), bDate.getMonth(), bDate.getDate() + 1).toISOString().split('T')[0],
                icon: <FiCheckCircle />,
                color: '#F9C6CE',
                category: 'Comemoração',
                readonly: true
              });
            }
          }
        });
      }

      // 3. Medical Appointments
      const { data: appts } = await supabase
        .from('prenatal_appointments')
        .select('*')
        .eq('user_id', user.id)
        .gte('appointment_date', startOfMonth.split('T')[0])
        .lte('appointment_date', endOfMonth.split('T')[0]);
      
      if (appts) {
        appts.forEach(a => allFetchedEvents.push({
          id: a.id,
          title: `Médico: ${a.appointment_type || 'Consulta'}`,
          description: a.doctor_name,
          date: a.appointment_date,
          icon: <FiActivity />,
          color: '#B8F0D0',
          category: 'Saúde',
          readonly: true
        }));
      }

      // 4. Weight Records
      const { data: weights } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', user.id)
        .eq('record_type', 'pregnancy_weight')
        .gte('recorded_at', startOfMonth.split('T')[0])
        .lte('recorded_at', endOfMonth.split('T')[0]);
      
      if (weights) {
        weights.forEach(w => allFetchedEvents.push({
          id: w.id,
          title: `Peso: ${w.value}kg`,
          date: w.recorded_at,
          icon: <FiActivity />,
          color: '#E0F2FE',
          category: 'Saúde',
          readonly: true
        }));
      }

      // 5. Photos / Diary
      const { data: diary } = await supabase
        .from('pregnancy_diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth)
        .lte('created_at', endOfMonth);
      
      if (diary) {
        diary.forEach(d => {
          if (d.belly_photo_url) {
            allFetchedEvents.push({
              id: d.id,
              title: `Foto da Barriga (Semana ${d.week_number})`,
              date: d.created_at.split('T')[0],
              icon: <FiCamera />,
              color: '#FEF3C7',
              category: 'Memória',
              readonly: true
            });
          }
        });
      }

      // 6. Pregnancy Discovery
      const { data: pregs } = await supabase
        .from('pregnancies')
        .select('discovery_date, year_label')
        .eq('user_id', user.id)
        .gte('discovery_date', startOfMonth.split('T')[0])
        .lte('discovery_date', endOfMonth.split('T')[0]);
      
      if (pregs) {
        pregs.forEach(p => {
          allFetchedEvents.push({
            id: `discovery-${p.year_label}`,
            title: `Descoberta da Gravidez! ✨`,
            description: p.year_label,
            date: p.discovery_date,
            icon: <FiStar />,
            color: '#F9C6CE',
            category: 'Comemoração',
            readonly: true
          });
        });
      }

      // 7. Vaccines
      // We filter by user_id through the children table to be safe
      const { data: vacs } = await supabase
        .from('vaccines')
        .select(`
          *,
          children!inner (
            name,
            user_id
          )
        `)
        .eq('children.user_id', user.id)
        .gte('scheduled_date', startOfMonth.split('T')[0])
        .lte('scheduled_date', endOfMonth.split('T')[0]);
      
      if (vacs) {
        vacs.forEach(v => {
          allFetchedEvents.push({
            id: v.id,
            title: `Vacina: ${v.vaccine_name} (${v.children?.name || 'Bebê'})`,
            date: v.scheduled_date,
            icon: <FiCheckCircle />,
            color: '#D1E8FF',
            category: 'Saúde',
            readonly: true
          });
        });
      }
      
      // 8. Milestones (Achievements)
      const { data: milestones } = await supabase
        .from('milestones')
        .select('*')
        .eq('user_id', user.id)
        .gte('milestone_date', startOfMonth.split('T')[0])
        .lte('milestone_date', endOfMonth.split('T')[0]);
      
      if (milestones) {
        milestones.forEach(m => {
          allFetchedEvents.push({
            id: m.id,
            title: `🏆 ${m.milestone_name}`,
            description: m.notes,
            date: m.milestone_date,
            icon: <FiAward />,
            color: '#D8B4FE',
            category: 'Conquista',
            readonly: true
          });
        });
      }

      setEvents(allFetchedEvents);
    } catch (err) {
      console.error("Error fetching calendar data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Padding for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const dayStr = day.toISOString().split('T')[0];
    const eventsForDay = events.filter(e => e.date === dayStr);
    setSelectedDay(day);
    setDayEvents(eventsForDay);
    setIsDetailModalOpen(true);
  };

  const openAddModal = (e) => {
    e.stopPropagation();
    setIsAddModalOpen(true);
    setNewEvent({ ...newEvent, date: selectedDay ? selectedDay.toISOString().split('T')[0] : new Date().toISOString().split('T')[0] });
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('calendar_events')
        .insert({
          user_id: user.id,
          title: newEvent.title,
          description: newEvent.description,
          event_date: newEvent.date,
          type: newEvent.type
        });

      if (error) throw error;
      
      setIsAddModalOpen(false);
      setNewEvent({ title: '', description: '', date: '', type: 'custom' });
      fetchEvents();
    } catch (err) {
      alert("Erro ao salvar evento: " + err.message);
    }
  };

  const getEventStyle = (type) => {
    switch (type) {
      case 'medical': return { color: '#B8F0D0', icon: <FiActivity />, label: 'Saúde' };
      case 'personal': return { color: '#F9C6CE', icon: <FiStar />, label: 'Pessoal' };
      case 'routine': return { color: '#D8B4FE', icon: <FiClock />, label: 'Rotina' };
      default: return { color: '#E0F2FE', icon: <FiTag />, label: 'Lembrete' };
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Deseja excluir este evento?")) return;
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setIsDetailModalOpen(false);
      fetchEvents();
    } catch (err) {
      alert("Erro ao excluir: " + err.message);
    }
  };

  return (
    <div className="calendar-page animate-fade-in">
      <header className="calendar-header">
        <div className="header-left">
          <h1>Calendário</h1>
          <p>{MONTHS[currentDate.getMonth()]} de {currentDate.getFullYear()}</p>
        </div>
        <div className="header-actions">
          <button className="btn-icon" onClick={prevMonth}><FiChevronLeft /></button>
          <button className="btn-icon" onClick={nextMonth}><FiChevronRight /></button>
          <button className="btn-primary btn-add-event" onClick={() => { setSelectedDay(null); setIsAddModalOpen(true); }}>
            <FiPlus /> Novo Evento
          </button>
        </div>
      </header>

      <div className="calendar-grid-container">
        <div className="days-of-week-header">
          {DAYS_OF_WEEK.map(d => <div key={d} className="dow-cell">{d}</div>)}
        </div>
        
        <div className="calendar-days-grid">
          {getDaysInMonth(currentDate).map((day, idx) => {
            if (!day) return <div key={`pad-${idx}`} className="day-cell muted" />;
            
            const dayStr = day.toISOString().split('T')[0];
            const dayEventsCount = events.filter(e => e.date === dayStr).length;
            const isToday = new Date().toDateString() === day.toDateString();
            
            return (
              <div 
                key={dayStr} 
                className={`day-cell ${isToday ? 'today' : ''} ${dayEventsCount > 0 ? 'has-events' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                <span className="day-number">{day.getDate()}</span>
                {dayEventsCount > 0 && (
                  <div className="event-indicators">
                    {events.filter(e => e.date === dayStr).slice(0, 3).map((e, i) => (
                      <div key={i} className="event-dot" style={{ backgroundColor: e.color }} />
                    ))}
                    {dayEventsCount > 3 && <span className="more-count">+{dayEventsCount - 3}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && createPortal(
        <div className="modal-backdrop" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content calendar-details-modal animate-fade-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsDetailModalOpen(false)}><FiX /></button>
            
            <div className="modal-header">
              <h3>{selectedDay.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
              <button className="btn-sm btn-ghost" onClick={openAddModal}>+ Adicionar</button>
            </div>

            <div className="day-events-list">
              {dayEvents.length > 0 ? dayEvents.map(e => (
                <div key={e.id} className="detail-event-card" style={{ borderLeft: `6px solid ${e.color}` }}>
                  <div className="event-main">
                    <span className="event-icon" style={{ color: e.color }}>{e.icon}</span>
                    <div className="event-info">
                      <strong>{e.title}</strong>
                      {e.description && <p>{e.description}</p>}
                    </div>
                  </div>
                  {!e.readonly && (
                    <button className="btn-delete-event" onClick={() => handleDeleteEvent(e.id)}>
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              )) : (
                <div className="empty-day-state">
                  <FiCalendar />
                  <p>Nenhum evento para este dia.</p>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Add Event Modal */}
      {isAddModalOpen && createPortal(
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content add-event-modal animate-fade-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsAddModalOpen(false)}><FiX /></button>
            <h3 className="modal-title">Novo Evento</h3>
            
            <form onSubmit={handleSaveEvent} className="event-form">
              <div className="form-group">
                <label><FiTag /> Título</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ex: Vacina da Pólio, Consulta Pré-natal..." 
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label><FiCalendar /> Data</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={newEvent.date}
                  onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label><FiTag /> Categoria</label>
                <div className="category-selector">
                  {[
                    { id: 'custom', label: 'Lembrete', icon: '📝' },
                    { id: 'medical', label: 'Saúde', icon: '🏥' },
                    { id: 'routine', label: 'Rotina', icon: '📅' },
                    { id: 'personal', label: 'Pessoal', icon: '⭐' }
                  ].map(cat => (
                    <button 
                      key={cat.id}
                      type="button"
                      className={`cat-btn ${newEvent.type === cat.id ? 'active' : ''}`}
                      onClick={() => setNewEvent({...newEvent, type: cat.id})}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label><FiClock /> Descrição (Opcional)</label>
                <textarea 
                  className="input-field" 
                  rows="2"
                  placeholder="Detalhes extras..."
                  value={newEvent.description}
                  onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setIsAddModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar Evento</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
