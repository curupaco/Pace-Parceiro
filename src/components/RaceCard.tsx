import React from 'react';
import type { Race } from '../types';
import { MapPin, ChevronRight, CheckCircle2, Clock, ExternalLink } from 'lucide-react';

interface RaceCardProps {
  race: Race;
  onSelect: (race: Race) => void;
  isSelected: boolean;
}

const RaceCard: React.FC<RaceCardProps> = ({ race, onSelect, isSelected }) => {
  const dateObj = new Date(race.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
  const weekDay = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });

  // Cores baseadas na dificuldade
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Iniciante': return 'bg-emerald-500 shadow-emerald-500/20';
      case 'Intermediário': return 'bg-yellow-500 shadow-yellow-500/20';
      case 'Difícil': return 'bg-red-500 shadow-red-500/20';
      default: return 'bg-slate-500';
    }
  };

  const difficultyColor = getDifficultyColor(race.difficulty);
  const isConfirmed = race.confidence === 'confirmed';

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (race.siteUrl) {
      window.open(race.siteUrl, '_blank');
    }
  };

  return (
    <div
      onClick={() => onSelect(race)}
      className={`
        w-full max-w-full overflow-hidden
        group relative flex flex-col sm:flex-row items-stretch gap-3 p-3 sm:gap-4 sm:p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 box-border
        ${isSelected
          ? 'bg-slate-900 border-brand-purple shadow-xl shadow-brand-purple/10 scale-[1.02]'
          : 'bg-slate-900/60 border-slate-800 hover:border-brand-neon hover:shadow-lg hover:shadow-brand-neon/5 hover:-translate-y-1'
        }
      `}
    >
      <div className="flex gap-3 items-center sm:items-stretch">
        {/* Coluna da Data (Left Ticket Stub) */}
        <div className={`
          flex flex-col items-center justify-center w-[52px] h-[52px] sm:h-auto sm:w-[70px] rounded-xl border border-slate-800 bg-slate-950
          group-hover:border-slate-700 transition-colors flex-shrink-0 relative overflow-hidden
        `}>
          {/* Status Bar Top */}
          <div className={`absolute top-0 inset-x-0 h-1 ${isConfirmed ? 'bg-emerald-500' : 'bg-yellow-500'}`} />

          <span className="text-xl sm:text-2xl font-black text-white tracking-tighter leading-none mt-1">{day}</span>
          <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">{month}</span>
        </div>

        {/* Mobile Header (Title next to date on small screens) */}
        <div className="sm:hidden flex-1 min-w-0">
          <h3 className={`font-bold text-base leading-tight truncate transition-colors ${isSelected ? 'text-brand-neon' : 'text-gray-100'}`}>
            {race.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              {isConfirmed ? (
                <CheckCircle2 size={10} className="text-emerald-500" />
              ) : (
                <Clock size={10} className="text-yellow-500" />
              )}
              <span className={`text-[10px] font-bold ${isConfirmed ? 'text-emerald-500' : 'text-yellow-500'}`}>
                {isConfirmed ? 'CONFIRMADA' : 'PREVISTA'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal (Desktop & Details) */}
      <div className="flex-1 flex flex-col justify-center min-w-0 py-0.5 mt-2 sm:mt-0">

        {/* Badges Superiores (Desktop Only Title logic handled via css/structure) */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {/* Difficulty Dot */}
          <div className="flex items-center gap-1.5 bg-slate-950/50 px-1.5 py-0.5 rounded-full border border-slate-800 flex-shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full shadow-sm ${difficultyColor}`}></span>
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wide">{race.difficulty}</span>
          </div>

          {/* Distance Chips */}
          <div className="flex gap-1 overflow-hidden flex-wrap">
            {race.distances.slice(0, 3).map((d) => (
              <span key={d} className="text-[9px] sm:text-[10px] font-bold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap">
                {d}K
              </span>
            ))}
            {race.distances.length > 3 && (
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 px-1 py-0.5">+</span>
            )}
          </div>

          {/* Desktop Status Badge */}
          <div className="hidden sm:flex items-center gap-1 ml-auto">
            {isConfirmed ? (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 size={10} />
                <span className="text-[9px] font-bold">DATA OFICIAL</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                <Clock size={10} />
                <span className="text-[9px] font-bold">PREVISTA</span>
              </div>
            )}
          </div>
        </div>

        {/* Nome da Corrida (Desktop) */}
        <h3 className={`hidden sm:block font-bold text-lg leading-tight mb-1 truncate transition-colors ${isSelected ? 'text-brand-neon' : 'text-gray-100 group-hover:text-white'}`}>
          {race.name}
        </h3>

        {/* Localização e Link */}
        <div className="flex items-center gap-3 text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-0 justify-between sm:justify-start">
          <div className="flex items-center gap-1 min-w-0 max-w-[70%] sm:max-w-none">
            <MapPin size={12} className="text-brand-orange flex-shrink-0" />
            <span className="truncate">{race.location}</span>
          </div>

          {race.siteUrl && (
            <button
              onClick={handleLinkClick}
              className="flex items-center gap-1 text-brand-purple hover:text-white transition-colors hover:underline z-10 px-2 py-1 rounded hover:bg-slate-800"
            >
              <span className="font-semibold">Fonte</span>
              <ExternalLink size={10} />
            </button>
          )}
        </div>
      </div>

      {/* Seta de Ação (Direita) */}
      <div className="hidden sm:flex items-center justify-center pl-2 border-l border-slate-800/50 flex-shrink-0">
        <div className={`
          p-1.5 sm:p-2 rounded-full transition-all duration-300
          ${isSelected ? 'bg-brand-neon text-slate-900 rotate-90' : 'bg-slate-800 text-gray-400 group-hover:text-white group-hover:bg-brand-purple'}
        `}>
          <ChevronRight size={16} strokeWidth={3} className="sm:w-[18px] sm:h-[18px]" />
        </div>
      </div>
    </div>
  );
};

export default RaceCard;