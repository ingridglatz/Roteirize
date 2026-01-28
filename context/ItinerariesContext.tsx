import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Itinerary } from '../types/Itinerary';
import { MOCK_ITINERARIES } from '../data/mockItineraries';

const STORAGE_KEY = '@roteirize_itineraries';

type ItinerariesContextType = {
  itineraries: Itinerary[];
  addItinerary: (itinerary: Itinerary) => void;
  updateItinerary: (id: string, updates: Partial<Itinerary>) => void;
  deleteItinerary: (id: string) => void;
};

const ItinerariesContext = createContext<ItinerariesContextType | null>(null);

export function ItinerariesProvider({ children }: { children: ReactNode }) {
  const [itineraries, setItineraries] = useState<Itinerary[]>(MOCK_ITINERARIES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((json) => {
      if (json) {
        try {
          setItineraries(JSON.parse(json));
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(itineraries));
    }
  }, [itineraries, loaded]);

  const addItinerary = useCallback((itinerary: Itinerary) => {
    setItineraries((prev) => [itinerary, ...prev]);
  }, []);

  const updateItinerary = useCallback(
    (id: string, updates: Partial<Itinerary>) => {
      setItineraries((prev) =>
        prev.map((it) => (it.id === id ? { ...it, ...updates } : it)),
      );
    },
    [],
  );

  const deleteItinerary = useCallback((id: string) => {
    setItineraries((prev) => prev.filter((it) => it.id !== id));
  }, []);

  return (
    <ItinerariesContext.Provider
      value={{ itineraries, addItinerary, updateItinerary, deleteItinerary }}
    >
      {children}
    </ItinerariesContext.Provider>
  );
}

export function useItineraries() {
  const ctx = useContext(ItinerariesContext);
  if (!ctx) throw new Error('useItineraries must be used within ItinerariesProvider');
  return ctx;
}
