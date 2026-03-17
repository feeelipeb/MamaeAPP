import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Calendar.css';

export default function Calendar({ events = [], onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    if (onDateSelect) onDateSelect(newDate);
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  // Generate days array
  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= numDays; i++) {
    days.push(i);
  }

  const hasEvent = (day) => {
    if (!day) return false;
    const dateStr = new Date(year, month, day).toDateString();
    return events.some(eventDate => new Date(eventDate).toDateString() === dateStr);
  };

  const isSelected = (day) => {
    if (!day) return false;
    return new Date(year, month, day).toDateString() === selectedDate.toDateString();
  };

  const isToday = (day) => {
    if (!day) return false;
    return new Date(year, month, day).toDateString() === new Date().toDateString();
  };

  return (
    <div className="calendar-card card">
      <div className="calendar-header">
        <h3>{monthNames[month]} {year}</h3>
        <div className="calendar-controls">
          <button onClick={prevMonth} className="btn-icon"><FiChevronLeft /></button>
          <button onClick={nextMonth} className="btn-icon"><FiChevronRight /></button>
        </div>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${!day ? 'empty' : ''} ${isSelected(day) ? 'selected' : ''} ${isToday(day) ? 'today' : ''} ${hasEvent(day) ? 'has-event' : ''}`}
            onClick={() => day && handleDateClick(day)}
          >
            {day}
            {hasEvent(day) && <div className="event-dot"></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
