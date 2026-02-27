import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Clock } from 'lucide-react';

interface TimePickerProps {
  label: string;
  value: string; // Format "HH:MM:SS"
  onChange: (value: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ label, value, onChange }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Parse incoming value
  useEffect(() => {
    if (value) {
      const [h, m, s] = value.split(':').map(Number);
      setHours(h || 0);
      setMinutes(m || 0);
      setSeconds(s || 0);
    }
  }, [value]);

  const updateTime = (h: number, m: number, s: number) => {
    // Validate
    const safeH = Math.max(0, Math.min(23, h));
    const safeM = Math.max(0, Math.min(59, m));
    const safeS = Math.max(0, Math.min(59, s));

    const formatted = [
      safeH.toString().padStart(2, '0'),
      safeM.toString().padStart(2, '0'),
      safeS.toString().padStart(2, '0')
    ].join(':');

    onChange(formatted);
  };

  const adjust = (type: 'h'|'m'|'s', amount: number) => {
    if (type === 'h') updateTime(hours + amount, minutes, seconds);
    if (type === 'm') updateTime(hours, minutes + amount, seconds);
    if (type === 's') updateTime(hours, minutes, seconds + amount);
  };

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl w-full">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Clock className="text-brand-purple" size={18} />
        <label className="text-sm font-bold text-gray-200 tracking-wide uppercase">
          {label}
        </label>
      </div>

      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {/* Hours */}
        <DigitColumn 
          value={hours} 
          onChange={(v) => updateTime(v, minutes, seconds)} 
          max={23} 
          label="Horas" 
        />
        
        <div className="text-2xl font-black text-gray-600 pb-6">:</div>

        {/* Minutes */}
        <DigitColumn 
          value={minutes} 
          onChange={(v) => updateTime(hours, v, seconds)} 
          max={59} 
          label="Min" 
        />
        
        <div className="text-2xl font-black text-gray-600 pb-6">:</div>

        {/* Seconds */}
        <DigitColumn 
          value={seconds} 
          onChange={(v) => updateTime(hours, minutes, v)} 
          max={59} 
          label="Seg" 
        />
      </div>
    </div>
  );
};

const DigitColumn: React.FC<{ value: number, onChange: (v: number) => void, max: number, label: string }> = ({ value, onChange, max, label }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 0;
    onChange(val);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button 
        onClick={() => onChange(value < max ? value + 1 : 0)}
        className="p-1 hover:bg-slate-800 rounded-lg text-gray-500 hover:text-brand-neon transition-colors"
      >
        <ChevronUp size={24} />
      </button>

      <div className="relative group">
        <input 
          type="number" 
          value={value.toString().padStart(2, '0')}
          onChange={handleChange}
          className="w-20 h-20 bg-slate-950 text-center text-4xl font-black text-white rounded-2xl border-2 border-slate-800 focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/20 outline-none transition-all selection:bg-brand-purple selection:text-white"
        />
      </div>
      
      <button 
        onClick={() => onChange(value > 0 ? value - 1 : max)}
        className="p-1 hover:bg-slate-800 rounded-lg text-gray-500 hover:text-brand-neon transition-colors"
      >
        <ChevronDown size={24} />
      </button>

      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
    </div>
  );
};

export default TimePicker;