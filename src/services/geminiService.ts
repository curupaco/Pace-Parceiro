import { GoogleGenAI } from "@google/genai";
import type { Race, UserInput, RacePlan, KmSplit } from '../types';
import { STATIC_RACES } from '../constants';

const apiKey = import.meta.env.VITE_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const mapEffortToStyle = (effort: number) => {
  switch (effort) {
    case 1: return { color: '#3b82f6', label: '😌 Suave' };
    case 2: return { color: '#10b981', label: '😎 Cruzeiro' };
    case 3: return { color: '#facc15', label: '😅 Firme' };
    case 4: return { color: '#f97316', label: '🥵 Forte' };
    case 5: return { color: '#ef4444', label: '💀 Máximo' };
    default: return { color: '#3b82f6', label: 'Moderado' };
  }
};

// --- SERVICES ---

export const searchRaces = async (query: string): Promise<Race[]> => {
  // Se não tem API KEY ou a query for vazia, retorna estático (apenas para não quebrar)
  if (!apiKey || !query) return STATIC_RACES;

  try {
    const modelId = "gemini-3-flash-preview";
    const prompt = `
      Current Date: ${new Date().toLocaleDateString()}.
      User Search: "${query}".
      Task: Find up to 3 real running races (official events) that match the search.
      Location Context: Sao Paulo, Brazil (default if not specified).
      Output Format: Name|YYYY-MM-DD|MaxDistance(int)|City
      Rules:
      1. Strictly plain text, one per line. No markdown.
      2. If vague, infer upcoming major races.
      3. If no real race found, return nothing.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });

    const text = response.text || "";
    const lines = text.split('\n').filter(l => l.includes('|'));

    return lines.map((line, idx) => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length < 3) return null;
      const [name, date, distStr, loc] = parts;
      const dist = parseInt(distStr.replace(/\D/g, '')) || 10;
      return {
        id: `ai-${idx}-${Date.now()}`,
        name: name,
        date: date,
        distanceKm: dist,
        distances: [dist], // AI search usually returns just the main distance
        location: loc || "Brasil",
        difficulty: 'Intermediário',
        confidence: 'confirmed',
        imageUrl: "https://images.unsplash.com/photo-1533561797500-4fad143ca5ee?q=80&w=800&auto=format&fit=crop"
      } as Race;
    }).filter(r => r !== null) as Race[];

  } catch (error) {
    console.error("Search API Error:", error);
    // Em caso de erro real da API (quota), lançamos o erro para a UI tratar
    // Não fazemos fallback silencioso para lista estática, pois o usuário quer buscar algo específico.
    throw error;
  }
};

export const generateRaceStrategy = async (race: Race, input: UserInput, selectedDistance: number, useAI: boolean): Promise<RacePlan> => {
  if (!apiKey) throw new Error("API Key missing");

  // O Prompt aqui é a alma do negócio. Ele deve tratar tanto provas famosas quanto "Treino Customizado".
  const prompt = `
    Role: Professional Running Coach.
    Event Context: 
    - Name: ${race.name}
    - Date: ${race.date}
    - Location: ${race.location}
    - Distance: ${selectedDistance}km
    - User Target Time: ${input.targetTime}

    Task: Create a detailed, kilometer-by-kilometer race strategy.
    
    Intelligence Required:
    1. Analyze the Event Name/Location. If it's a famous race (e.g., Silvestre, Rio, Boston), use REAL historical knowledge about elevation/hills.
    2. If it's a generic/unknown race, infer elevation based on the typical topography of ${race.location}.
    3. Weather: Predict weather based on the Month of the race in that location.
    4. Pacing: Calculate the exact splits to achieve ${input.targetTime}, applying a "Negative Split" strategy (start slower, finish strong).

    Output Format (String with delimiters, NO MARKDOWN):
    Temperature|Condition|Wind|StrategySummary|Splits...

    Where Splits are: Km,Pace(MM:SS),Elev(m),Effort(1-5),ShortTip
    Separator between splits: ;
    
    Example Output:
    18°C|Nublado|12km/h|Comece leve para poupar energia.|1,05:10,5,1,Segura a emoção;2,05:05,10,2,Encontre seu ritmo...
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const rawText = response.text || "";

    if (!rawText.includes('|')) throw new Error("Invalid format");

    const parts = rawText.split('|');
    const splitsStr = parts.slice(4).join('|').trim();
    const splitItems = splitsStr.split(';').filter(s => s.includes(','));

    const splits: KmSplit[] = splitItems.map((s) => {
      const [k, p, e, f, t] = s.split(',').map(x => x.trim());
      const effort = parseInt(f) || 2;
      const style = mapEffortToStyle(effort);
      return {
        km: parseInt(k) || 0,
        targetPace: p || "00:00",
        elevation: parseInt(e) || 0,
        tip: t || "Foco",
        difficultyColor: style.color,
        difficultyLabel: style.label,
        description: t
      };
    });

    return {
      source: 'ai',
      raceName: race.name,
      weatherPrediction: {
        temp: parts[0].trim(),
        condition: parts[1].trim(),
        wind: parts[2].trim(),
        description: "Análise IA baseada em dados históricos."
      },
      overallStrategy: parts[3].trim(),
      summary: parts[3].trim(),
      splits: splits.slice(0, Math.ceil(selectedDistance))
    };

  } catch (error) {
    console.error("Strategy Gen Error:", error);
    throw error; // UI will handle retry message
  }
};