import './ModulePage.css';

const moduleData = {
  baby: { emoji: '👶', title: 'Bebê', subtitle: 'Acompanhamento de desenvolvimento' },
  menu: { emoji: '🍽️', title: 'Cardápio Infantil', subtitle: 'Refeições e nutrição' },
  pregnancy: { emoji: '🤰', title: 'Diário de Gestação', subtitle: 'Acompanhe semana a semana' },
  calendar: { emoji: '📅', title: 'Calendário', subtitle: 'Tudo em um só lugar' },
  memories: { emoji: '📖', title: 'Lembranças', subtitle: 'Momentos especiais' },
  conquistas: { emoji: '🏆', title: 'Conquistas', subtitle: 'Marcos e momentos únicos' },
  activities: { emoji: '🎮', title: 'Atividades', subtitle: 'Brincadeiras por idade' },
  stories: { emoji: '🌙', title: 'Histórias para Dormir', subtitle: 'Contos e cantigas' },
};

export default function ModulePage({ moduleKey }) {
  const mod = moduleData[moduleKey];

  if (!mod) {
    return (
      <div className="page-shell animate-fade-in">
        <h1>Página não encontrada</h1>
      </div>
    );
  }

  return (
    <div className="page-shell animate-fade-in">
      <div className="shell-icon">{mod.emoji}</div>
      <h1>{mod.title}</h1>
      <p className="shell-subtitle">{mod.subtitle}</p>
      <div className="shell-badge">
        <span>✨</span>
        Em breve
      </div>
    </div>
  );
}
