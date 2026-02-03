// Mapeamento de nomes de países para códigos ISO e imagens de pontos turísticos
export const COUNTRY_DATA: Record<string, { code: string; image: string }> = {
  'italia': { code: 'IT', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80' }, // Coliseu
  'japao': { code: 'JP', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80' }, // Templo Kyoto
  'turquia': { code: 'TR', image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80' }, // Hagia Sophia
  'franca': { code: 'FR', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=800&q=80' }, // Torre Eiffel
  'espanha': { code: 'ES', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80' }, // Sagrada Familia
  'portugal': { code: 'PT', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80' }, // Lisboa
  'reino unido': { code: 'GB', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80' }, // Big Ben
  'alemanha': { code: 'DE', image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80' }, // Portão de Brandemburgo
  'estados unidos': { code: 'US', image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80' }, // Estátua da Liberdade
  'argentina': { code: 'AR', image: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=800&q=80' }, // Buenos Aires
  'chile': { code: 'CL', image: 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=800&q=80' }, // Torres del Paine
  'peru': { code: 'PE', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80' }, // Machu Picchu
  'brasil': { code: 'BR', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80' }, // Cristo Redentor
  'mexico': { code: 'MX', image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80' }, // Chichen Itza
  'canada': { code: 'CA', image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&q=80' }, // Toronto
  'australia': { code: 'AU', image: 'https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=800&q=80' }, // Sydney Opera
  'grecia': { code: 'GR', image: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=800&q=80' }, // Santorini
  'egito': { code: 'EG', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80' }, // Pirâmides
  'tailandia': { code: 'TH', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80' }, // Templo Bangkok
  'india': { code: 'IN', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80' }, // Taj Mahal
  'china': { code: 'CN', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80' }, // Muralha da China
  'russia': { code: 'RU', image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80' }, // Catedral São Basílio
  'africa do sul': { code: 'ZA', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80' }, // Table Mountain
  'marrocos': { code: 'MA', image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80' }, // Marrakech
  'holanda': { code: 'NL', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80' }, // Amsterdam
  'belgica': { code: 'BE', image: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800&q=80' }, // Bruges
  'suica': { code: 'CH', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80' }, // Alpes
  'austria': { code: 'AT', image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80' }, // Viena
  'noruega': { code: 'NO', image: 'https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=800&q=80' }, // Fjords
  'suecia': { code: 'SE', image: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800&q=80' }, // Estocolmo
  'dinamarca': { code: 'DK', image: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&q=80' }, // Copenhagen
  'irlanda': { code: 'IE', image: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800&q=80' }, // Dublin
  'croacia': { code: 'HR', image: 'https://images.unsplash.com/photo-1555990538-1e7f3309c8e5?w=800&q=80' }, // Dubrovnik
  'colombia': { code: 'CO', image: 'https://images.unsplash.com/photo-1533699224246-6dc3b3ed3304?w=800&q=80' }, // Cartagena
  'uruguai': { code: 'UY', image: 'https://images.unsplash.com/photo-1615525137689-198778541af6?w=800&q=80' }, // Montevideo
  'nova zelandia': { code: 'NZ', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80' }, // Milford Sound
  'coreia do sul': { code: 'KR', image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=80' }, // Seoul
  'indonesia': { code: 'ID', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80' }, // Bali
  'vietna': { code: 'VN', image: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&q=80' }, // Ha Long Bay
  'filipinas': { code: 'PH', image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80' }, // Palawan
  'emirados arabes': { code: 'AE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80' }, // Burj Khalifa
  'israel': { code: 'IL', image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&q=80' }, // Jerusalém
  'cuba': { code: 'CU', image: 'https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=800&q=80' }, // Havana
  'islandia': { code: 'IS', image: 'https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=800&q=80' }, // Aurora
  'finlandia': { code: 'FI', image: 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=800&q=80' }, // Helsinki
  'polonia': { code: 'PL', image: 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=800&q=80' }, // Cracóvia
  'republica tcheca': { code: 'CZ', image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80' }, // Praga
  'hungria': { code: 'HU', image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80' }, // Budapeste
};

export function normalizeCountryName(name: string): string {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function getCountryFlag(countryName: string): string {
  const normalized = normalizeCountryName(countryName);
  const data = COUNTRY_DATA[normalized];

  if (data) {
    // Converte código ISO para emoji de bandeira
    const codePoints = data.code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  return '🏳️';
}

export function getCountryImageUrl(countryName: string): string {
  const normalized = normalizeCountryName(countryName);
  const data = COUNTRY_DATA[normalized];

  // Retorna a imagem do ponto turístico ou uma imagem padrão de viagem
  return data?.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';
}

export type ProfileCountry = {
  id: string;
  name: string;
  flag: string;
  imageUrl: string;
};

export function createProfileCountry(name: string): ProfileCountry {
  return {
    id: Date.now().toString(),
    name: name.trim(),
    flag: getCountryFlag(name),
    imageUrl: getCountryImageUrl(name),
  };
}

// Converte lista de strings para lista de ProfileCountry
export function convertToProfileCountries(names: string[]): ProfileCountry[] {
  return names.map((name, index) => ({
    id: (index + 1).toString(),
    name,
    flag: getCountryFlag(name),
    imageUrl: getCountryImageUrl(name),
  }));
}
