import { createContext, useContext, useState, ReactNode } from "react";

type Budget = "Econômico" | "Moderado" | "Luxo" | null;
type Pace = "Tranquilo" | "Equilibrado" | "Intenso" | null;

type OnboardingState = {
  interests: string[];
  budget: Budget;
  pace: Pace;
  setInterests: (v: string[]) => void;
  setBudget: (v: Budget) => void;
  setPace: (v: Pace) => void;
};

const OnboardingContext = createContext<OnboardingState | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState<Budget>(null);
  const [pace, setPace] = useState<Pace>(null);

  return (
    <OnboardingContext.Provider
      value={{
        interests,
        budget,
        pace,
        setInterests,
        setBudget,
        setPace,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return ctx;
}
