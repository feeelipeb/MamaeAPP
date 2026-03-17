import React from 'react';
import { weeklyData } from '../data/weeklyData';
import './CurrentWeekModule.css';

export default function CurrentWeekModule({ pregnancy, currentWeek }) {
  // Fallback to week 4 if before week 4, or week 40 if over
  const weekKey = Math.max(4, Math.min(40, currentWeek));
  const data = weeklyData[weekKey] || weeklyData[40];

  // Tri label logic for badge
  let triLabel = "💗 1º Tri";
  if (weekKey >= 14 && weekKey <= 26) triLabel = "💜 2º Tri";
  if (weekKey >= 27) triLabel = "✨ 3º Tri";

  // Check for exams
  const exams = {
    8: "Primeira consulta de pré-natal",
    10: "Exame de sangue — Beta HCG e hemograma",
    12: "Ultrassom morfológico 1º trimestre + Translucência nucal",
    16: "Exame de sangue — Toxoplasmose, rubéola, HIV",
    20: "Ultrassom morfológico 2º trimestre",
    24: "Teste de tolerância à glicose (diabetes gestacional)",
    28: "Exame de sangue — Hemograma, ferro",
    32: "Ultrassom de crescimento fetal",
    36: "Estreptococo B (Swab vaginal)",
    38: "Monitoramento fetal / Cardiotocografia",
    40: "Avaliação para indução se ultrapassar DPP"
  };
  const weekExam = exams[weekKey];

  return (
    <div className="current-week-module animate-fade-in">
      <div className="internal-header">
        <h2>Semana {currentWeek} 📅</h2>
      </div>

      <div className="hero-card week-hero">
        <div className="badge-tri">{triLabel}</div>
        <div className="hero-emoji">{data.fruitEmoji}</div>
        <h3 className="hero-title">Semana {currentWeek}</h3>
        <p className="hero-subtitle">Seu bebê tem o tamanho de um(a) <strong>{data.fruit}</strong> 🌱</p>
      </div>

      <div className="content-card dev-card">
        <h3>O que está acontecendo? 👶</h3>
        <p>{data.development}</p>
      </div>

      {data.symptoms && data.symptoms.length > 0 && (
        <div className="content-card symp-card">
          <h3>Seu corpo esta semana 🌸</h3>
          <div className="symptoms-chips">
            {data.symptoms.map((symp, i) => (
              <span key={i} className="chip-tag">{symp}</span>
            ))}
          </div>
        </div>
      )}

      {data.tip && (
        <div className="content-card tip-card">
          <h3>💡 Dica da semana</h3>
          <p>{data.tip}</p>
        </div>
      )}

      {weekExam && (
        <div className="content-card exam-card">
          <h3>🏥 Alerta de Exame!</h3>
          <p>{weekExam}</p>
        </div>
      )}
    </div>
  );
}
