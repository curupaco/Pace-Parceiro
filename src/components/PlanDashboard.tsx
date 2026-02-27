import React, { useRef, useState } from 'react';
import type { RacePlan, KmSplit } from '../types';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { CloudSun, Wind, Thermometer, Zap, Award, Flag, Share2, Loader2, Droplets, Sparkles, Calculator } from 'lucide-react';
import html2canvas from 'html2canvas';

interface PlanDashboardProps {
  plan: RacePlan;
  onReset: () => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as KmSplit;
    return (
      <div className="bg-slate-800 p-3 border border-slate-700 shadow-xl rounded-lg">
        <p className="font-bold text-brand-purple">KM {label}</p>
        <p className="text-sm text-gray-300">Elev: {data.elevation}m</p>
        <p className="text-sm font-semibold text-brand-orange">Meta: {data.targetPace}</p>
        <p className="text-xs text-gray-400 mt-1 max-w-[150px]">{data.description}</p>
      </div>
    );
  }
  return null;
};

// Helper para contraste de cor do texto
const getBadgeTextColor = (label: string) => {
  const normalized = label.toLowerCase();
  if (
    normalized.includes('suave') ||
    normalized.includes('firme') ||
    normalized.includes('fácil') ||
    normalized.includes('moderado') ||
    normalized.includes('controle')
  ) {
    return 'text-slate-900 font-extrabold';
  }
  return 'text-white font-bold';
};

const PlanDashboard: React.FC<PlanDashboardProps> = ({ plan, onReset }) => {
  const [sharing, setSharing] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (!captureRef.current) return;
    setSharing(true);

    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#020617', // Slate 950 explicitly
        scale: 2, // Retina quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        windowHeight: captureRef.current.scrollHeight,
      });

      const imageBlob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, 'image/png')
      );

      if (!imageBlob) throw new Error("Falha ao gerar imagem");

      const file = new File([imageBlob], `pace-parceiro-${plan.raceName}.png`, { type: 'image/png' });

      const shareData = {
        title: `Minha estratégia para ${plan.raceName}`,
        text: `Confira minha estratégia de prova criada com o PaceParceiro! 🏃💨`,
        files: [file],
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `Estrategia_${plan.raceName.replace(/\s+/g, '_')}.png`;
        link.click();
      }

    } catch (err) {
      console.error('Error sharing:', err);
      alert('Não foi possível compartilhar a imagem. Tente tirar um print da tela!');
    } finally {
      setSharing(false);
    }
  };

  const isAI = plan.source === 'ai';

  return (
    <div className="space-y-6 animate-fade-in pb-20">

      {/* Controls - Outside capture area */}
      <div className="flex justify-between items-center px-1 sticky top-16 z-40 bg-slate-950/80 backdrop-blur py-2">
        <button
          onClick={onReset}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Nova Estratégia
        </button>
        <button
          onClick={handleShare}
          disabled={sharing}
          className="flex items-center gap-2 bg-brand-neon text-slate-900 px-4 py-2 rounded-full font-bold text-sm hover:bg-white transition-colors shadow-lg shadow-brand-neon/20"
        >
          {sharing ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
          {sharing ? 'Gerando...' : 'Compartilhar Tudo'}
        </button>
      </div>

      {/* Capture Area: Everything inside here becomes the image */}
      <div
        ref={captureRef}
        className="bg-slate-950 p-4 rounded-2xl space-y-6 border border-slate-900"
      >
        {/* Header Summary Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-neon opacity-5 rounded-full blur-3xl -mr-10 -mt-10"></div>

          <div className="relative z-10 text-center md:text-left">

            {/* Source Badge */}
            <div className="flex justify-center md:justify-start mb-4">
              {isAI ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles size={12} />
                  Estratégia Personalizada (IA)
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-500 text-[10px] font-bold uppercase tracking-wider">
                  <Calculator size={12} />
                  Estratégia Calculada (Offline)
                </div>
              )}
            </div>

            <div className="mb-6 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
                {plan.raceName}
              </h2>
            </div>

            {/* Grid de Informações Climáticas e Estratégia */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {/* Temp */}
              <div className="bg-white/5 p-3 rounded-xl backdrop-blur-md border border-white/10 flex flex-col items-center justify-center">
                <Thermometer className="text-brand-orange mb-1" size={20} />
                <span className="text-lg font-bold">{plan.weatherPrediction.temp}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Temp</span>
              </div>

              {/* Wind */}
              <div className="bg-white/5 p-3 rounded-xl backdrop-blur-md border border-white/10 flex flex-col items-center justify-center">
                <Wind className="text-blue-400 mb-1" size={20} />
                <span className="text-xs sm:text-sm font-bold text-center leading-tight">{plan.weatherPrediction.wind}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Vento</span>
              </div>

              {/* Condition */}
              <div className="bg-white/5 p-3 rounded-xl backdrop-blur-md border border-white/10 flex flex-col items-center justify-center">
                {plan.weatherPrediction.condition.toLowerCase().includes('chuva') ? (
                  <Droplets className="text-blue-300 mb-1" size={20} />
                ) : (
                  <CloudSun className="text-yellow-300 mb-1" size={20} />
                )}
                <span className="text-xs sm:text-sm font-bold text-center leading-tight line-clamp-2">{plan.weatherPrediction.condition}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Condição</span>
              </div>

              {/* Strategy Focus - Full Width */}
              <div className="col-span-3 bg-white/5 p-4 rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-3 text-left">
                <div className="flex flex-col items-center justify-center min-w-[50px] border-r border-white/10 pr-3 my-1">
                  <Zap className="text-brand-neon mb-1" size={20} />
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Foco</span>
                </div>
                <span className="text-sm font-bold leading-snug flex-1 text-white">{plan.overallStrategy}</span>
              </div>
            </div>

            <div className="mt-4 bg-slate-950/50 p-4 rounded-xl border border-white/5">
              <p className="text-sm italic text-gray-300 text-center">"{plan.summary}"</p>
            </div>
          </div>
        </div>

        {/* Altimetry Chart */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 break-inside-avoid">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ActivityIcon /> Altimetria & Pace
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={plan.splits}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorElev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="km" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#64748b' }} />
                <Area
                  type="monotone"
                  dataKey="elevation"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorElev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KM by KM Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white px-2 flex items-center gap-2">
            <Flag size={20} className="text-brand-orange" /> Detalhe KM a KM
          </h3>

          <div className="grid gap-3">
            {plan.splits.map((split) => (
              <div
                key={split.km}
                className="bg-slate-900 rounded-xl shadow-md border border-slate-800 p-4 flex gap-4 items-start relative break-inside-avoid"
              >
                {/* Side color bar indicator */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                  style={{ backgroundColor: split.difficultyColor }}
                />

                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 font-bold text-white text-sm">
                  {split.km}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-base">
                      {split.targetPace} <span className="text-[10px] font-normal text-gray-500">min/km</span>
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded shadow-sm ${getBadgeTextColor(split.difficultyLabel)}`}
                      style={{ backgroundColor: split.difficultyColor }}
                    >
                      {split.difficultyLabel}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed mb-2 whitespace-normal">
                    {split.description}
                  </p>

                  <div className="flex items-start gap-1.5 bg-yellow-900/10 p-2 rounded text-[10px] text-yellow-200 border border-yellow-800/20">
                    <Award size={12} className="flex-shrink-0 text-yellow-400 mt-0.5" />
                    <span className="font-medium italic whitespace-normal leading-tight">{split.tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer for the image */}
        <div className="pt-4 pb-2 flex justify-center items-center gap-2 opacity-60 border-t border-slate-800">
          <div className="w-3 h-3 bg-brand-neon rounded-sm transform rotate-45"></div>
          <span className="text-[10px] font-bold tracking-widest text-white">GERADO PELO APP PACE PARCEIRO</span>
        </div>
      </div>
    </div>
  );
};

const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-purple"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
);

export default PlanDashboard;