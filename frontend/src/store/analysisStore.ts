import { create } from 'zustand';

export interface SMCPattern {
  type: 'order_block' | 'fvg' | 'liquidity_sweep' | 'market_structure' | 'supply_demand';
  level: number;
  strength: 'low' | 'medium' | 'high';
  confirmed: boolean;
}

export interface Analysis {
  id?: string;
  pair: string;
  timeframe: string;
  signal: 'BUY' | 'SELL';
  entry: number;
  stopLoss: number;
  takeProfit: number[];
  riskReward: number;
  confidence: number;
  pattern: string;
  reasoning: string;
  patterns: SMCPattern[];
  timestamp?: Date;
}

interface AnalysisStore {
  analysis: Analysis | null;
  history: Analysis[];
  setAnalysis: (analysis: Analysis) => void;
  addToHistory: (analysis: Analysis) => void;
  clearAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  analysis: null,
  history: [],
  setAnalysis: (analysis) =>
    set((state) => ({
      analysis,
      history: [analysis, ...state.history].slice(0, 50), // Keep last 50
    })),
  addToHistory: (analysis) =>
    set((state) => ({
      history: [analysis, ...state.history].slice(0, 50),
    })),
  clearAnalysis: () => set({ analysis: null }),
}));
