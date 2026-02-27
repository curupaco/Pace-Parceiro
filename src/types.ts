export interface Race {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  distanceKm: number; // Distância principal/padrão para exibição no card
  distances: number[]; // Todas as distâncias disponíveis no evento
  location: string;
  imageUrl: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Difícil';
  confidence?: 'confirmed' | 'predicted';
  siteUrl?: string;
}

export interface UserInput {
  targetTime: string; // e.g., "00:55:00"
}

export interface KmSplit {
  km: number;
  targetPace: string;
  elevation: number;
  difficultyColor: string;
  difficultyLabel: string;
  tip: string;
  description: string;
}

export interface RacePlan {
  source?: 'ai' | 'fallback';
  raceName: string;
  weatherPrediction: {
    temp: string;
    condition: string;
    wind: string;
    description: string;
  };
  overallStrategy: string;
  splits: KmSplit[];
  summary: string;
}

// Runtime check
export const TypesVersion = 1;