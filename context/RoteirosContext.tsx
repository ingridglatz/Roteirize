import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Itinerary } from '../types/Itinerary';
import { MOCK_ITINERARIES } from '../data/mockItineraries';

type RoteirosContextType = {
  roteiros: Itinerary[];
  addRoteiro: (roteiro: Itinerary) => void;
  deleteRoteiro: (id: string) => void;
};

const RoteirosContext = createContext<RoteirosContextType | undefined>(
  undefined,
);

type RoteirosProviderProps = {
  children: ReactNode;
};

export function RoteirosProvider({ children }: RoteirosProviderProps) {
  const [roteiros, setRoteiros] = useState<Itinerary[]>(MOCK_ITINERARIES);

  const addRoteiro = (roteiro: Itinerary) => {
    setRoteiros((prev) => [roteiro, ...prev]);
  };

  const deleteRoteiro = (id: string) => {
    setRoteiros((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <RoteirosContext.Provider value={{ roteiros, addRoteiro, deleteRoteiro }}>
      {children}
    </RoteirosContext.Provider>
  );
}

export function useRoteiros() {
  const context = useContext(RoteirosContext);
  if (!context) {
    throw new Error('useRoteiros must be used within a RoteirosProvider');
  }
  return context;
}
