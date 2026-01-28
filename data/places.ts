import { ImageSourcePropType } from 'react-native';

export type PlaceActivity = {
  icon: string;
  title: string;
  description: string;
};

export type PlaceCuriosity = {
  emoji: string;
  text: string;
};

export type PlaceTip = {
  icon: string;
  text: string;
};

export type Place = {
  slug: string;
  title: string;
  location: string;
  category: string;
  image: ImageSourcePropType;
  description: string;
  rating: number;
  curiosities: PlaceCuriosity[];
  activities: PlaceActivity[];
  tips: PlaceTip[];
  bestTime: string;
  difficulty: 'Facil' | 'Moderado' | 'Dificil';
};

export const PLACES_DATA: Place[] = [
  {
    slug: 'praia-do-felix',
    title: 'Praia do Felix',
    location: 'Ubatuba, SP',
    category: 'Praia',
    image: require('../assets/images/praia1.jpg'),
    description:
      'Uma das praias mais bonitas de Ubatuba, dividida em duas partes por uma formacao rochosa. O lado esquerdo tem ondas fortes, perfeito para surf, enquanto o lado direito e mais calmo e ideal para banho.',
    rating: 4.8,
    curiosities: [
      { emoji: '🌊', text: 'A praia e dividida em duas por pedras no meio, criando duas praias com caracteristicas diferentes.' },
      { emoji: '🏄', text: 'O lado esquerdo e um dos melhores picos de surf de Ubatuba, com ondas consistentes o ano todo.' },
      { emoji: '🌿', text: 'Cercada por Mata Atlantica preservada, e comum avistar tucanos e saguis na vegetacao ao redor.' },
      { emoji: '📸', text: 'O mirante na trilha de acesso oferece uma das vistas mais fotografadas do litoral norte paulista.' },
    ],
    activities: [
      { icon: 'water-outline', title: 'Surf', description: 'Ondas consistentes no lado esquerdo da praia' },
      { icon: 'walk-outline', title: 'Trilha do Mirante', description: 'Caminhada leve com vista panoramica da praia' },
      { icon: 'fish-outline', title: 'Snorkeling', description: 'Lado direito com aguas calmas e piscinas naturais' },
      { icon: 'camera-outline', title: 'Fotografia', description: 'Por do sol espetacular com vista para as ilhas' },
    ],
    tips: [
      { icon: 'time-outline', text: 'Chegue cedo nos fins de semana, o estacionamento lota rapido.' },
      { icon: 'restaurant-outline', text: 'Ha quiosques simples na praia com peixe fresco e acai.' },
      { icon: 'warning-outline', text: 'Cuidado com as correntes no lado esquerdo se nao for surfista.' },
    ],
    bestTime: 'Abril a Novembro',
    difficulty: 'Facil',
  },
  {
    slug: 'ilha-anchieta',
    title: 'Ilha Anchieta',
    location: 'Ubatuba, SP',
    category: 'Ilha',
    image: require('../assets/images/praia2.jpg'),
    description:
      'Antiga colonia penal transformada em parque estadual, a Ilha Anchieta combina historia, trilhas ecologicas e praias paradisiacas com aguas cristalinas perfeitas para mergulho.',
    rating: 4.9,
    curiosities: [
      { emoji: '🏚️', text: 'A ilha abrigou um presidio entre 1908 e 1955, e as ruinas ainda podem ser visitadas.' },
      { emoji: '⚔️', text: 'Em 1952, houve uma das maiores rebelioes de presos do Brasil, dramatizada em filmes e livros.' },
      { emoji: '🐢', text: 'E um importante ponto de desova de tartarugas marinhas no litoral de Sao Paulo.' },
      { emoji: '🐠', text: 'As aguas ao redor tem visibilidade de ate 15 metros, sendo um dos melhores pontos de mergulho do estado.' },
    ],
    activities: [
      { icon: 'boat-outline', title: 'Passeio de Barco', description: 'Travessia de 30min com vista para a costa' },
      { icon: 'eye-outline', title: 'Mergulho', description: 'Aguas cristalinas com vida marinha abundante' },
      { icon: 'footsteps-outline', title: 'Trilha do Presidio', description: 'Percurso historico pelas ruinas da colonia penal' },
      { icon: 'leaf-outline', title: 'Trilha do Saco Grande', description: 'Caminhada pela mata ate praia deserta' },
    ],
    tips: [
      { icon: 'ticket-outline', text: 'Reserve o passeio de barco com antecedencia na alta temporada.' },
      { icon: 'sunny-outline', text: 'Leve protetor solar e agua, nao ha sombra em todas as praias.' },
      { icon: 'bag-outline', text: 'Leve lanche, nao ha comercio na ilha.' },
    ],
    bestTime: 'Outubro a Marco',
    difficulty: 'Moderado',
  },
  {
    slug: 'praia-almada',
    title: 'Praia da Almada',
    location: 'Ubatuba, SP',
    category: 'Praia',
    image: require('../assets/images/praia3.jpg'),
    description:
      'Praia extensa com areia clara e aguas calmas, ideal para familias. Cercada por caicaras e pescadores, mantem uma atmosfera autentica com otimos restaurantes de frutos do mar.',
    rating: 4.5,
    curiosities: [
      { emoji: '🎣', text: 'A comunidade caicara local ainda vive da pesca artesanal, tradicao de seculos.' },
      { emoji: '🦜', text: 'Na mata ao fundo da praia vivem diversas especies de aves raras da Mata Atlantica.' },
      { emoji: '🛶', text: 'E possivel alugar caiaques e fazer o percurso ate a vizinha Praia do Engenho.' },
      { emoji: '🍤', text: 'Os restaurantes pe-na-areia servem o peixe mais fresco de Ubatuba, direto dos barcos.' },
    ],
    activities: [
      { icon: 'sunny-outline', title: 'Banho de Mar', description: 'Aguas calmas e rasas, perfeitas para criancas' },
      { icon: 'boat-outline', title: 'Caiaque', description: 'Aluguel na praia para explorar a costa' },
      { icon: 'restaurant-outline', title: 'Gastronomia', description: 'Restaurantes caicaras com peixe fresco do dia' },
      { icon: 'bicycle-outline', title: 'Passeio de Bike', description: 'Ciclovia ate a Praia do Lazaro' },
    ],
    tips: [
      { icon: 'cash-outline', text: 'Peca o peixe do dia nos restaurantes, e sempre mais fresco e barato.' },
      { icon: 'car-outline', text: 'Ha estacionamento pago proximo, mas da para ir a pe da Praia do Lazaro.' },
      { icon: 'umbrella-outline', text: 'Aluguel de cadeira e guarda-sol custa em media R$40 o dia.' },
    ],
    bestTime: 'Ano todo',
    difficulty: 'Facil',
  },
];

export function getPlaceBySlug(slug: string): Place | undefined {
  return PLACES_DATA.find((p) => p.slug === slug);
}
