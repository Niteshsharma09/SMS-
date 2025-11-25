

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  type: 'frames' | 'sunglasses' | 'lenses';
  brand: 'Ray-Ban' | 'Oakley' | 'Persol' | 'Vogue' | 'Visionary' | 'Titan' | 'Fastrack' | 'Lauredale' | 'Technoii' | 'NVG';
  style: 'Aviator' | 'Wayfarer' | 'Round' | 'Cat-Eye' | 'Rectangular' | 'Browline' | 'Sport' | 'Zero Power' | 'Single Vision' | 'Bifocal' | 'Progressive';
  material: 'Metal' | 'Acetate' | 'Titanium' | 'Polycarbonate';
  imageId: string;
};

// This is now used for seeding data or as a fallback.
// The app primarily fetches data from Firestore.
export const products: Product[] = [
  {
    id: '1',
    name: 'Metropolis',
    price: 150,
    description: 'Sleek and modern, these rectangular frames are perfect for the urban professional. Made from lightweight titanium.',
    type: 'frames',
    brand: 'Vogue',
    style: 'Rectangular',
    material: 'Titanium',
    imageId: 'frame-1',
  },
  {
    id: '2',
    name: 'Artisan',
    price: 180,
    description: 'Classic tortoise shell in a contemporary round shape. Crafted from high-quality acetate for a comfortable fit.',
    type: 'frames',
    brand: 'Persol',
    style: 'Round',
    material: 'Acetate',
    imageId: 'frame-2',
  },
  {
    id: '3',
    name: 'Maverick',
    price: 220,
    description: 'A modern take on the classic aviator. These minimalist silver metal frames are both stylish and durable.',
    type: 'frames',
    brand: 'Ray-Ban',
    style: 'Aviator',
    material: 'Metal',
    imageId: 'frame-3',
  },
  {
    id: '4',
    name: 'Diva',
    price: 165,
    description: 'Make a statement with these bold red cat-eye frames. Perfect for adding a pop of color to any outfit.',
    type: 'frames',
    brand: 'Vogue',
    style: 'Cat-Eye',
    material: 'Acetate',
    imageId: 'frame-4',
  },
  {
    id: '5',
    name: 'Scholar',
    price: 195,
    description: 'A sophisticated browline style with a transparent clear finish. The perfect blend of vintage and modern.',
    type: 'frames',
    brand: 'Persol',
    style: 'Browline',
    material: 'Acetate',
    imageId: 'frame-5',
  },
  {
    id: '6',
    name: 'Poet',
    price: 210,
    description: 'Delicate gold wire-rim oval frames that exude a vintage charm. Lightweight and elegant for everyday wear.',
    type: 'frames',
    brand: 'Ray-Ban',
    style: 'Round',
    material: 'Metal',
    imageId: 'frame-6',
  },
  {
    id: '7',
    name: 'Icon',
    price: 155,
    description: 'The timeless black wayfarer. These sunglasses are an essential accessory for any wardrobe, offering 100% UV protection.',
    type: 'sunglasses',
    brand: 'Ray-Ban',
    style: 'Wayfarer',
    material: 'Acetate',
    imageId: 'sun-1',
  },
  {
    id: '8',
    name: 'Pilot',
    price: 190,
    description: 'Classic gold-rimmed aviator sunglasses with signature green lenses. An enduring style icon.',
    type: 'sunglasses',
    brand: 'Ray-Ban',
    style: 'Aviator',
    material: 'Metal',
    imageId: 'sun-2',
  },
  {
    id: '9',
    name: 'Glamour',
    price: 175,
    description: 'Oversized and glamorous round sunglasses for a movie-star look. Provides excellent coverage and style.',
    type: 'sunglasses',
    brand: 'Vogue',
    style: 'Round',
    material: 'Acetate',
    imageId: 'sun-3',
  },
  {
    id: '10',
    name: 'Velocity',
    price: 250,
    description: 'Sporty wraparound sunglasses with polarized lenses, designed for high performance and maximum clarity.',
    type: 'sunglasses',
    brand: 'Oakley',
    style: 'Sport',
    material: 'Titanium',
    imageId: 'sun-4',
  },
  {
    id: '11',
    name: 'Retrograde',
    price: 185,
    description: 'Stand out with these retro-inspired hexagonal sunglasses. Features metal frames and warm brown lenses.',
    type: 'sunglasses',
    brand: 'Persol',
    style: 'Wayfarer',
    material: 'Metal',
    imageId: 'sun-5',
  },
  {
    id: '12',
    name: 'Chic',
    price: 160,
    description: 'Elegant white-framed cat-eye sunglasses. A perfect accessory for a sunny day by the Riviera.',
    type: 'sunglasses',
    brand: 'Vogue',
    style: 'Cat-Eye',
    material: 'Acetate',
    imageId: 'sun-6',
  },
  {
    id: '18',
    name: 'Holbrook',
    price: 180,
    description: 'A timeless, classic design fused with modern Oakley technology. Inspired by the screen heroes from the 1940s, 50s, and 60s.',
    type: 'sunglasses',
    brand: 'Oakley',
    style: 'Wayfarer',
    material: 'Acetate',
    imageId: 'sun-1',
  },
  {
    id: '19',
    name: 'Cellor',
    price: 280,
    description: 'An iconic Persol design, the Cellor features a distinctive browline style and the signature Persol arrow.',
    type: 'sunglasses',
    brand: 'Persol',
    style: 'Browline',
    material: 'Acetate',
    imageId: 'sun-5',
  },
  {
    id: '20',
    name: 'Round Metal',
    price: 210,
    description: 'Totally retro. This look has been worn by legendary musicians and inspired by the 1960s counter-culture.',
    type: 'sunglasses',
    brand: 'Ray-Ban',
    style: 'Round',
    material: 'Metal',
    imageId: 'sun-2',
  },
  {
    id: '21',
    name: 'Edge',
    price: 120,
    description: 'Modern and sleek sunglasses from Titan, perfect for a sharp, contemporary look.',
    type: 'sunglasses',
    brand: 'Titan',
    style: 'Rectangular',
    material: 'Metal',
    imageId: 'sun-1'
  },
  {
    id: '22',
    name: 'Rider',
    price: 80,
    description: 'Sporty and youthful sunglasses from Fastrack, built for an active lifestyle.',
    type: 'sunglasses',
    brand: 'Fastrack',
    style: 'Sport',
    material: 'Polycarbonate',
    imageId: 'sun-4'
  },
  {
    id: '23',
    name: 'Riviera',
    price: 150,
    description: 'Elegant and stylish sunglasses from Lauredale, for a touch of classic glamour.',
    type: 'sunglasses',
    brand: 'Lauredale',
    style: 'Cat-Eye',
    material: 'Acetate',
    imageId: 'sun-6'
  },
  {
    id: '24',
    name: 'Vision',
    price: 100,
    description: 'The signature sunglasses from Technoii, combining modern design with everyday comfort.',
    type: 'sunglasses',
    brand: 'Technoii',
    style: 'Wayfarer',
    material: 'Acetate',
    imageId: 'sun-1'
  },
  {
    id: '25',
    name: 'Nightfall',
    price: 130,
    description: 'NVG tactical-style sunglasses, offering superior protection and a bold look.',
    type: 'sunglasses',
    brand: 'NVG',
    style: 'Sport',
    material: 'Polycarbonate',
    imageId: 'sun-4'
  },
   {
    id: '13',
    name: 'Single Vision',
    price: 120,
    description: 'High-quality single vision lenses for clear sight at all distances. Made from durable polycarbonate.',
    type: 'lenses',
    brand: 'Visionary',
    style: 'Single Vision',
    material: 'Polycarbonate',
    imageId: 'lens-1',
  },
  {
    id: '14',
    name: 'Progressives',
    price: 280,
    description: 'Seamless progressive lenses for perfect vision at near, intermediate, and far distances. No more lines.',
    type: 'lenses',
    brand: 'Visionary',
    style: 'Progressive',
    material: 'Polycarbonate',
    imageId: 'lens-2',
  },
  {
    id: '15',
    name: 'Zero Power',
    price: 90,
    description: 'For fashion or screen protection without correction.',
    type: 'lenses',
    brand: 'Visionary',
    style: 'Zero Power',
    material: 'Polycarbonate',
    imageId: 'lens-3',
  },
  {
    id: '17',
    name: 'Bifocals',
    price: 220,
    description: 'Lined bifocal lenses for clear vision at two distances. A classic solution for presbyopia.',
    type: 'lenses',
    brand: 'Visionary',
    style: 'Bifocal',
    material: 'Polycarbonate',
    imageId: 'lens-bifocal',
  }
];

export const getProductById = (id: string, allProducts: Product[]): Product | undefined => {
    return allProducts.find(p => p.id === id);
}

// These are now just for fallback or for UI elements that need the full list before data loads.
export const brands = ['Ray-Ban', 'Oakley', 'Persol', 'Vogue', 'Visionary', 'Titan', 'Fastrack', 'Lauredale', 'Technoii', 'NVG'];
export const styles = ['Aviator', 'Wayfarer', 'Round', 'Cat-Eye', 'Rectangular', 'Browline', 'Sport'];
export const types = ['frames', 'sunglasses', 'lenses'];
export const lensStyles = ['Zero Power', 'Single Vision', 'Bifocal', 'Progressive'];

    