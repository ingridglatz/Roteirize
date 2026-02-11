import { createContext, useContext, useState, ReactNode } from 'react';

type Days = number | null;
type Budget = 'economic' | 'moderate' | 'luxury' | null;
type Pace = 'relaxed' | 'balanced' | 'intense' | null;

type OnboardingState = {
  interests: string[];
  budget: Budget;
  pace: Pace;
  days: Days;
  setInterests: (v: string[]) => void;
  setBudget: (v: Budget) => void;
  setPace: (v: Pace) => void;
  setDays: (v: Days) => void;
};

const OnboardingContext = createContext<OnboardingState | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState<Budget>(null);
  const [pace, setPace] = useState<Pace>(null);
  const [days, setDays] = useState<Days>(null);

  return (
    <OnboardingContext.Provider
      value={{
        interests,
        budget,
        pace,
        days,
        setInterests,
        setBudget,
        setPace,
        setDays,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return ctx;
}
