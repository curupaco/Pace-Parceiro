import React, { useEffect, useState, useMemo } from 'react';
import { raceService, RaceVariant } from './services/supabaseService';
import type { Race, UserInput, RacePlan } from './types';
import { generateRaceStrategy, searchRaces } from './services/geminiService';
import { STATIC_RACES } from './constants';
import RaceCard from './components/RaceCard';
import PlanDashboard from './components/PlanDashboard';
import TimePicker from './components/TimePicker';
import { Timer, ArrowRight, Loader2, Search, CalendarDays, Footprints, Zap, Map, Trophy, Ban, Sparkles, PlusCircle, MapPin, Calendar, Activity, Settings2 } from 'lucide-react';

const parseDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const getDistanceMeta = (km: number) => {
  if (km < 6) return { label: 'Curta / Rápida', icon: Zap };
  if (km < 16) return { label: 'Intermediária', icon: Timer };
  if (km < 22) return { label: 'Meia Maratona', icon: Map };
  return { label: 'Longa Duração', icon: Trophy };
};

const getSmartTimeSuggestions = (km: number) => {
  if (km <= 5) return [
    { label: "Elite (Sub 20')", time: "00:19:59" },
    { label: "Rápido (Sub 25')", time: "00:24:59" },
    { label: "Médio (30')", time: "00:30:00" },
    { label: "Leve (40')", time: "00:40:00" },
  ];
  if (km <= 10) return [
    { label: "Sub 45'", time: "00:44:59" },
    { label: "Sub 50'", time: "00:49:59" },
    { label: "Sub 60'", time: "00:59:59" },
    { label: "Completar", time: "01:10:00" },
  ];
  if (km <= 15) return [
    { label: "Sub 1h10", time: "01:09:59" },
    { label: "Sub 1h20", time: "01:19:59" },
    { label: "Sub 1h30", time: "01:29:59" },
  ];
  if (km <= 21.1) return [
    { label: "Sub 1h40", time: "01:39:59" },
    { label: "Sub 1h50", time: "01:49:59" },
    { label: "Sub 2h00", time: "01:59:59" },
    { label: "Sub 2h15", time: "02:14:59" },
  ];
  return [
    { label: "Sub 3h30", time: "03:29:59" },
    { label: "Sub 4h00", time: "03:59:59" },
    { label: "Sub 4h30", time: "04:29:59" },
  ];
};

const App: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [viewMode, setViewMode] = useState<'search' | 'custom'>('search');

  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<number>(10);
  const [userInput, setUserInput] = useState<UserInput>({ targetTime: '00:50:00' });
  const [plan, setPlan] = useState<RacePlan | null>(null);

  const [customRaceData, setCustomRaceData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    distance: 10,
    location: 'São Paulo, SP'
  });

  const [races, setRaces] = useState<Race[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // CARREGAMENTO INICIAL DO SUPABASE
  useEffect(() => {
    const loadSupabaseRaces = async () => {
      try {
        const data = await raceService.getAllRaces();

      }, []);

  useEffect(() => {
    if (step === 2 && selectedRace) {
      if (!selectedDistance) {
        const def = (selectedRace.distances && selectedRace.distances.length > 0)
          ? selectedRace.distances[0]
          : 10;
        setSelectedDistance(def);
      }
    }
  }, [step, selectedRace]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

  };

  const handleSelectRace = (race: Race) => {
    setSelectedRace(race);
    const dist = (race.distances && race.distances.length > 0) ? race.distances[0] : race.distanceKm || 10;
    setSelectedDistance(dist);
    setStep(2);
  };

  const handleCustomRaceSubmit = () => {
    if (!customRaceData.name) return;

  };

  const handleGenerate = async () => {
    if (!selectedRace || !userInput.targetTime || !selectedDistance) return;

  };

  const handleReset = () => {
    setStep(1);
    setSelectedRace(null);
    setSelectedDistance(10);
    setPlan(null);
    setError(null);
    setUserInput({ targetTime: '00:50:00' });
  };

  const smartSuggestions = useMemo(() => {
    if (!selectedDistance) return [];
    return getSmartTimeSuggestions(selectedDistance);
  }, [selectedDistance]);

  return (
    <div className="min-h-screen font-sans text-gray-200 bg-slate-950 selection:bg-brand-purple selection:text-white pb-10 w-full overflow-x-hidden">
      <header className="bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800 transition-all duration-300">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="w-7 h-7 rounded bg-brand-neon flex items-center justify-center transform hover:rotate-6 transition-transform">
              <span className="text-lg font-black text-slate-900 leading-none pb-0.5">P</span>
            </div>
            <span className="font-bold text-white tracking-tight">PaceParceiro</span>
          </div>
          {step > 1 && (
            <button onClick={handleReset} className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider">
              Cancelar
            </button>
          )}
        </div>
      </header>

      );
};

      export default App;