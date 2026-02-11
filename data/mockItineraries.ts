import { Itinerary } from '../types/Itinerary';

export const MOCK_ITINERARIES: Itinerary[] = [
  {
    id: '1',
    title: 'Fim de semana em Ubatuba 🌊',
    destinationId: 'ubatuba',
    destinationName: 'Ubatuba, Brasil',
    days: 3,
    budget: 'moderate',
    interests: ['Praias', 'Natureza'],

    dailyPlan: [
      {
        day: 1,
        title: 'Chegada e praia central',
        activities: ['Check-in', 'Praia do Itaguá', 'Jantar no centro'],
        places: ['Praia do Itaguá'],
      },
    ],

    restaurants: [
      {
        id: 'r1',
        name: 'Raízes Restaurante',
        category: 'Frutos do mar',
        priceLevel: '$$',
        location: 'Itaguá',
      },
    ],

    checklist: [
      { id: 'c1', text: 'Reservar hotel', done: true },
      { id: 'c2', text: 'Alugar carro', done: false },
    ],

    createdAt: new Date().toISOString(),
  },
];
