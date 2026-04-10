export interface Media {
  type: 'image' | 'video';
  url: string;
}

export interface Room {
  id: string;
  name: string;
  zoneSlug: string;
  zoneName: string;
  description: string;
  price: string;
  amenities: string[];
  media: Media[];
}

export interface Zone {
  id: string;
  name: string;
  slug: string;
  roomCount: string;
  coverImage: string;
}

export const zones: Zone[] = [
  {
    id: '1',
    name: 'Mercado Central',
    slug: 'mercado-central',
    roomCount: '8 Exclusive Rooms',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Corte Inglés',
    slug: 'corte-ingles',
    roomCount: '5 Executive Suites',
    coverImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Centro de la Ciudad',
    slug: 'centro-de-la-ciudad',
    roomCount: '12 Heritage Rooms',
    coverImage: 'https://images.unsplash.com/photo-1542314831-c6a4d27ce66b?q=80&w=1000&auto=format&fit=crop'
  }
];

export const rooms: Room[] = [
  {
    id: '101',
    name: 'Zen Suite',
    zoneSlug: 'mercado-central',
    zoneName: 'Mercado Central',
    description: 'A masterclass in minimalism. Features natural textures and a private meditation corner.',
    price: '€450/month',
    amenities: ['wifi', 'ac_unit', 'balcony', 'king_bed'],
    media: [
      { type: 'video', url: 'https://cdn.pixabay.com/video/2019/08/25/26270-356417742_tiny.mp4' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop' }
    ]
  },
  {
    id: '102',
    name: 'Golden Attic',
    zoneSlug: 'centro-de-la-ciudad',
    zoneName: 'Centro',
    description: 'Experience the Alicante skyline from our most elevated and prestigious sanctuary.',
    price: '€550/month',
    amenities: ['wifi', 'tv', 'local_cafe'],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1000&auto=format&fit=crop' }
    ]
  },
  {
    id: '103',
    name: 'Silk Studio',
    zoneSlug: 'corte-ingles',
    zoneName: 'Corte Inglés',
    description: 'A fusion of modern technology and organic comfort. Perfect for the digital nomad.',
    price: '€480/month',
    amenities: ['wifi', 'desk', 'ac_unit'],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop' }
    ]
  }
];
