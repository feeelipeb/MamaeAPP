import { useState } from 'react';
import Calendar from '../components/Calendar';
import './RoutinePage.css';

// Mock events for demonstration
const mockEvents = [
  new Date(new Date().getFullYear(), new Date().getMonth(), 15),
  new Date(new Date().getFullYear(), new Date().getMonth(), 18),
  new Date(new Date().getFullYear(), new Date().getMonth(), 22),
  new Date(new Date().getFullYear(), new Date().getMonth(), 25),
];

export default function RoutinePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const eventsForSelectedDate = [
    { time: '08:00', title: 'Café da manhã', category: 'Alimentação' },
    { time: '10:00', title: 'Passeio no parque', category: 'Lazer' },
    { time: '14:00', title: 'Soneca da tarde', category: 'Sono' },
  ];

  return (
    <div className="routine-page animate-fade-in">
      <header className="page-header">
        <h1>📅 Rotina das Crianças</h1>
        <p>Acompanhe e organize o dia a dia dos pequenos</p>
      </header>

      <div className="routine-content">
        <div className="calendar-section">
          <Calendar 
            events={mockEvents} 
            onDateSelect={(date) => setSelectedDate(date)} 
          />
        </div>

        <div className="events-section card">
          <div className="events-header">
            <h3>{selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</h3>
            <button className="btn btn-primary btn-sm">Adicionar</button>
          </div>

          <div className="events-list">
            {eventsForSelectedDate.map((event, index) => (
              <div key={index} className="event-item">
                <div className="event-time">{event.time}</div>
                <div className="event-info">
                  <div className="event-title">{event.title}</div>
                  <div className="event-category">{event.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
