export type Itinerary = {
  id: string;
  title: string;
  destinationId: string;
  destinationName: string;
  days: number;
  budget: 'Econômico' | 'Moderado' | 'Luxo';
  interests: string[];

  dailyPlan: DailyPlan[];
  restaurants: Restaurant[];
  checklist: ChecklistItem[];

  createdAt: string;
};

export type DailyPlan = {
  day: number;
  title: string;
  activities: string[];
  places: string[];
};

export type Restaurant = {
  id: string;
  name: string;
  category: string;
  priceLevel: '$' | '$$' | '$$$';
  location: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};
