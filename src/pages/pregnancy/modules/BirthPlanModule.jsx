import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';
import './BirthPlanModule.css';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    title: "Como você imagina o ambiente do seu parto?",
    options: [
      { text: "Estruturado e seguro — prefiro hospital com toda tecnologia disponível", emoji: "🏥", tags: ['normal'] },
      { text: "Acolhedor e tranquilo — quero luz baixa, música suave, pouca intervenção", emoji: "🌿", tags: ['humanizado', 'natural'] },
      { text: "Ainda não tenho certeza", emoji: "🤷", tags: [] }
    ]
  },
  {
    id: 2,
    title: "Sobre a presença de pessoas durante o parto:",
    options: [
      { text: "Quero meu parceiro(a) comigo", emoji: "👫", tags: ['normal', 'humanizado'] },
      { text: "Quero minha mãe ou familiar de confiança", emoji: "👩‍👩‍👧", tags: ['humanizado'] },
      { text: "Quero uma doula (acompanhante especializada)", emoji: "🤝", tags: ['humanizado', 'natural'] },
      { text: "Prefiro o mínimo de pessoas possível", emoji: "🧘", tags: ['cesarea'] }
    ]
  },
  {
    id: 3,
    title: "Como você se sente em relação à dor do parto?",
    options: [
      { text: "Quero analgesia/peridural sem hesitar", emoji: "💊", tags: ['normal', 'cesarea'] },
      { text: "Quero tentar lidar naturalmente, mas aceito se precisar", emoji: "🌊", tags: ['humanizado'] },
      { text: "Quero vivenciar a experiência sem medicação, se possível", emoji: "🧘", tags: ['natural'] },
      { text: "Tenho muito medo da dor, quero o máximo de conforto", emoji: "😰", tags: ['cesarea'] }
    ]
  },
  {
    id: 4,
    title: "Sobre movimentação durante o trabalho de parto:",
    options: [
      { text: "Prefiro me movimentar livremente (caminhar, bola, banheira)", emoji: "🚶", tags: ['humanizado', 'natural'] },
      { text: "Me sinto mais segura deitada no leito", emoji: "🛏️", tags: ['normal', 'cesarea'] },
      { text: "Quero ter liberdade para decidir na hora", emoji: "🔄", tags: ['humanizado'] }
    ]
  },
  {
    id: 5,
    title: "Quanto ao corte do cordão umbilical:",
    options: [
      { text: "Quero clampeamento tardio (esperar parar de pulsar)", emoji: "⏱️", tags: ['humanizado', 'natural'] },
      { text: "Pode ser cortado normalmente", emoji: "✂️", tags: ['normal', 'cesarea'] },
      { text: "Quero que o pai/parceiro(a) corte o cordão", emoji: "👨", tags: ['humanizado'] }
    ]
  },
  {
    id: 6,
    title: "Logo após o nascimento, o que é mais importante para você?",
    options: [
      { text: "Contato pele a pele imediato com o bebê", emoji: "🤱", tags: ['humanizado', 'natural'] },
      { text: "Amamentação na sala de parto", emoji: "🍼", tags: ['humanizado', 'natural'] },
      { text: "Registro do momento (foto/vídeo)", emoji: "📸", tags: ['normal', 'cesarea'] },
      { text: "Descanso e tranquilidade", emoji: "💤", tags: ['cesarea'] }
    ]
  },
  {
    id: 7,
    title: "Sobre amamentação:",
    options: [
      { text: "Quero amamentar exclusivamente no peito", emoji: "🤱", tags: ['natural', 'humanizado'] },
      { text: "Pretendo combinar amamentação e fórmula", emoji: "🍼", tags: ['normal'] },
      { text: "Ainda vou decidir conforme as circunstâncias", emoji: "🤷", tags: [] }
    ]
  },
  {
    id: 8,
    title: "Em relação à cesárea:",
    options: [
      { text: "Prefiro cesárea planejada", emoji: "✅", tags: ['cesarea', 'cesarea', 'cesarea'] }, // Forte peso
      { text: "Prefiro evitar cesárea se não for necessária", emoji: "🚫", tags: ['natural', 'humanizado'] },
      { text: "Aceito qualquer opção que for mais segura para mim e meu bebê", emoji: "🔄", tags: ['normal'] }
    ]
  }
];

const RESULTS_DATA = {
  'normal': {
    title: "Parto Normal",
    emoji: "🏥",
    description: "Você valoriza segurança e tecnologia disponível. O parto vaginal tradicional em ambiente hospitalar é ideal para você — com suporte médico completo, analgesia disponível e toda estrutura necessária para uma experiência tranquila e segura."
  },
  'humanizado': {
    title: "Parto Humanizado",
    emoji: "🌿",
    description: "Você quer protagonizar sua história. O parto humanizado respeita seu tempo, seu corpo e suas escolhas — ambiente acolhedor, liberdade de movimento, presença de quem você ama e intervenções só quando realmente necessárias."
  },
  'natural': {
    title: "Parto Natural/Ativo",
    emoji: "🧘",
    description: "Você quer vivenciar cada sensação dessa jornada. O parto natural ativo valoriza o instinto do seu corpo, com movimento livre, imersão em água, clampeamento tardio e conexão imediata com seu bebê."
  },
  'cesarea': {
    title: "Cesárea Planejada",
    emoji: "💊",
    description: "Você prioriza previsibilidade e controle. A cesárea planejada permite organizar tudo com antecedência — data, equipe médica e recuperação — garantindo segurança para você e seu bebê."
  }
};

export default function BirthPlanModule({ pregnancy }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dbEntryId, setDbEntryId] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Quiz State
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [finalResult, setFinalResult] = useState(null); // 'normal', 'humanizado', etc.

  useEffect(() => {
    fetchBirthPlan();
  }, [pregnancy.id]);

  const fetchBirthPlan = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('birth_plans')
        .select('*')
        .eq('pregnancy_id', pregnancy.id)
        .single();

      if (data) {
        setDbEntryId(data.id);
        if (data.quiz_completed) {
          setQuizCompleted(true);
          setFinalResult(data.chosen_birth_type);
          setAnswers(data.answers_json || {});
        }
      }
    } catch (err) {
      console.log("No existing birth plan found.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setIsTakingQuiz(true);
    setCurrentStep(0);
    setAnswers({});
  };

  const handleSelectOption = (questionId, optionIndex, tags) => {
    const newAnswers = { ...answers, [questionId]: { optionIndex, tags } };
    setAnswers(newAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      processQuiz(newAnswers);
    }
  };

  const processQuiz = async (finalAnswers) => {
    setAnalyzing(true);
    
    // Calculate Score
    const scores = { normal: 0, humanizado: 0, natural: 0, cesarea: 0 };
    
    Object.values(finalAnswers).forEach(ans => {
      ans.tags.forEach(tag => {
        if (scores[tag] !== undefined) scores[tag]++;
      });
    });

    // Special logic per requirements
    // Pergunta 8: prefere cesárea -> Cesárea (we added strong weights to tags)
    let winner = 'humanizado'; // Default tie-breaker
    let maxScore = -1;

    for (const [type, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        winner = type;
      }
    }

    // Delay for dramatic effect
    setTimeout(async () => {
      // Save to Supabase
      try {
        const payload = {
          pregnancy_id: pregnancy.id,
          user_id: user.id,
          answers_json: finalAnswers,
          chosen_birth_type: winner,
          birth_type_description: RESULTS_DATA[winner].description,
          quiz_completed: true
        };

        if (dbEntryId) {
          await supabase.from('birth_plans').update(payload).eq('id', dbEntryId);
        } else {
          const { data } = await supabase.from('birth_plans').insert(payload).select().single();
          if (data) setDbEntryId(data.id);
        }

        setFinalResult(winner);
        setQuizCompleted(true);
        setIsTakingQuiz(false);
      } catch (err) {
        console.error("Error saving birth plan:", err);
        alert("Erro ao salvar o plano. Certifique-se de que a migração SQL foi rodada.");
      } finally {
        setAnalyzing(false);
      }
    }, 1500);
  };

  const handleRetakeQuiz = () => {
    if (window.confirm("Suas respostas atuais serão substituídas. Continuar?")) {
      setQuizCompleted(false);
      handleStartQuiz();
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  // VIEW 1: Initial State
  if (!quizCompleted && !isTakingQuiz) {
    return (
      <div className="birth-plan-module animate-fade-in text-center">
        <div className="internal-header">
          <h2>Plano de Parto 📋</h2>
        </div>
        <div className="start-quiz-container">
          <div className="quiz-hero-icon">🤰</div>
          <h2 className="quiz-title">Qual é o parto dos seus sonhos? 💗</h2>
          <p className="quiz-subtitle">
            Responda algumas perguntas e descubra qual tipo de parto combina mais com você e suas expectativas.
          </p>
          <button className="btn btn-primary btn-large start-quiz-btn" onClick={handleStartQuiz}>
            Fazer o quiz 📋
          </button>
        </div>
      </div>
    );
  }

  // VIEW 2: Quiz in progress
  if (isTakingQuiz && !analyzing) {
    const question = QUIZ_QUESTIONS[currentStep];
    const progress = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

    return (
      <div className="birth-plan-module animate-fade-in">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="quiz-step-text">Pergunta {currentStep + 1} de {QUIZ_QUESTIONS.length}</p>

        <div className="question-container animate-fade-in" key={question.id}>
          <h3 className="question-title">{question.title}</h3>
          
          <div className="options-grid">
            {question.options.map((opt, i) => (
              <button 
                key={i} 
                className="quiz-option-card"
                onClick={() => handleSelectOption(question.id, i, opt.tags)}
              >
                <div className="opt-emoji">{opt.emoji}</div>
                <div className="opt-text">{opt.text}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // VIEW 3: Analyzing Loading state
  if (analyzing) {
    return (
      <div className="birth-plan-module text-center analyzing-state animate-fade-in">
        <div className="pulsing-heart">💗</div>
        <h3 className="mt-4">Analisando suas respostas...</h3>
        <p>Preparando seu plano perfeito.</p>
      </div>
    );
  }

  // VIEW 4: Result
  if (quizCompleted && finalResult) {
    const resultObj = RESULTS_DATA[finalResult] || RESULTS_DATA['humanizado'];
    
    return (
      <div className="birth-plan-module result-view animate-fade-in">
        <div className="internal-header">
          <h2>Plano de Parto 📋</h2>
        </div>

        <div className="hero-card result-hero">
          <div className="hero-emoji result-emoji">{resultObj.emoji}</div>
          <h3 className="hero-title">Seu parto ideal:<br/>{resultObj.title}</h3>
          <p className="hero-subtitle result-desc">{resultObj.description}</p>
        </div>

        <div className="content-card answers-summary">
          <h3>Suas preferências</h3>
          <div className="answers-chips">
            {Object.keys(answers).map(qId => {
              const q = QUIZ_QUESTIONS.find(q => q.id === parseInt(qId));
              const ansOpt = answers[qId].optionIndex;
              const text = q?.options[ansOpt]?.text;
              const emoji = q?.options[ansOpt]?.emoji;
              if (!text) return null;
              return (
                <div key={qId} className="answer-memento">
                  <span className="memento-emoji">{emoji}</span>
                  <span className="memento-text">{text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="retake-container">
          <button className="btn btn-ghost retake-btn" onClick={handleRetakeQuiz}>
            Refazer quiz 🔄
          </button>
        </div>
      </div>
    );
  }

  return null;
}
