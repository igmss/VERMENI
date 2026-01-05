
import { Product, SectionConfig } from './types';

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aurelia Silk Tulle Gown',
    price: 1250,
    description: 'Hand-woven Italian silk tulle with delicate 24k gold thread embroidery. Perfect for the most prestigious ceremonies.',
    category: 'Dresses',
    images: ['https://picsum.photos/id/64/800/1200', 'https://picsum.photos/id/65/800/1200'],
    sizes: ['2Y', '3Y', '4Y', '5Y', '6Y'],
    colors: ['Pearl White', 'Blush Rose'],
    ageRange: '2-6 Years',
    careInstructions: 'Professional dry clean only. Store in provided acid-free garment bag.',
    isFeatured: true,
    isNew: true,
    reviews: [{ id: 'r1', user: 'Elizabeth M.', rating: 5, comment: 'Breathtaking quality. My daughter looked like an angel.', date: '2023-11-15' }]
  },
  {
    id: '2',
    name: 'Emperor Velvet Suit',
    price: 980,
    description: 'Bespoke velvet suit tailored from premium French cotton velvet with silk satin lapels.',
    category: 'Suits',
    images: ['https://picsum.photos/id/129/800/1200', 'https://picsum.photos/id/130/800/1200'],
    sizes: ['3Y', '4Y', '5Y', '6Y'],
    colors: ['Warm Graphite', 'Midnight Navy'],
    ageRange: '3-6 Years',
    careInstructions: 'Professional dry clean only.',
    isFeatured: true,
    reviews: []
  },
  {
    id: '3',
    name: 'Gilded Butterfly Headband',
    price: 340,
    description: 'Hand-crafted brass butterflies plated in antique gold, set with miniature crystal accents.',
    category: 'Accessories',
    images: ['https://picsum.photos/id/175/800/1200'],
    sizes: ['One Size'],
    colors: ['Antique Gold'],
    ageRange: '1-6 Years',
    careInstructions: 'Wipe with soft, dry cloth.',
    reviews: []
  },
  {
    id: '4',
    name: 'Casper Cashmere Overcoat',
    price: 1550,
    description: 'Double-faced Mongolian cashmere for ultimate warmth and softness during winter soirees.',
    category: 'Outerwear',
    images: ['https://picsum.photos/id/338/800/1200'],
    sizes: ['2Y', '4Y', '6Y'],
    colors: ['Oatmeal', 'Graphite'],
    ageRange: '2-6 Years',
    careInstructions: 'Specialist cashmere cleaning recommended.',
    isNew: true,
    reviews: []
  },
  {
    id: '5',
    name: 'Royal Heritage Mary Janes',
    price: 450,
    description: 'Supple Italian lambskin leather with scalloped edges and gold buckle closure.',
    category: 'Shoes',
    images: ['https://picsum.photos/id/21/800/1200'],
    sizes: ['22', '24', '26', '28'],
    colors: ['Pearl White', 'Antique Gold'],
    ageRange: '1-6 Years',
    careInstructions: 'Protect with leather conditioner.',
    reviews: []
  }
];

export const INITIAL_HOMEPAGE_CONFIG: SectionConfig[] = [
  {
    id: 'hero-1',
    type: 'hero',
    title: 'The Golden Age of Childhood',
    subtitle: 'Where Heritage Meets Haute Couture',
    imageUrl: 'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&q=80&w=2000',
    buttonText: 'Discover Collection',
    isVisible: true,
    order: 0
  },
  {
    id: 'featured-1',
    type: 'featured',
    title: 'Exquisite Creations',
    subtitle: 'Masterpieces crafted for your most precious moments.',
    isVisible: true,
    order: 1
  },
  {
    id: 'banner-1',
    type: 'banner',
    title: 'The Artisanal Atelier',
    subtitle: 'Each piece tells a story of a thousand stitches.',
    imageUrl: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&q=80&w=2000',
    buttonText: 'Explore the Craft',
    isVisible: true,
    order: 2
  }
];
