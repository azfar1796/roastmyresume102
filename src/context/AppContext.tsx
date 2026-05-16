import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AnalysisResult } from '../types';

interface AppContextType {
  resumeText: string;
  setResumeText: (text: string) => void;
  tone: string;
  setTone: (tone: string) => void;
  jobDescription: string;
  setJobDescription: (desc: string) => void;
  result: AnalysisResult | null;
  setResult: (result: AnalysisResult | null) => void;
  clearAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'roastmyresume_state';

interface PersistedState {
  resumeText: string;
  tone: string;
  jobDescription: string;
  result: AnalysisResult | null;
}

function loadFromStorage(): PersistedState | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as PersistedState;
  } catch { /* ignore */ }
  return null;
}

function saveToStorage(state: PersistedState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const stored = loadFromStorage();

  const [resumeText, setResumeText] = useState(stored?.resumeText ?? '');
  const [tone, setTone] = useState(stored?.tone ?? 'Brutal HR');
  const [jobDescription, setJobDescription] = useState(stored?.jobDescription ?? '');
  const [result, setResult] = useState<AnalysisResult | null>(stored?.result ?? null);

  useEffect(() => {
    saveToStorage({ resumeText, tone, jobDescription, result });
  }, [resumeText, tone, jobDescription, result]);

  const clearAll = useCallback(() => {
    setResumeText('');
    setTone('Brutal HR');
    setJobDescription('');
    setResult(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AppContext.Provider
      value={{
        resumeText,
        setResumeText,
        tone,
        setTone,
        jobDescription,
        setJobDescription,
        result,
        setResult,
        clearAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
