
export type Category = 'Dresses' | 'Suits' | 'Accessories' | 'Outerwear' | 'Shoes';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  sizes: string[];
  colors: string[];
  ageRange: string;
  careInstructions: string;
  reviews: Review[];
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface SectionConfig {
  id: string;
  type: 'hero' | 'featured' | 'banner' | 'collection' | 'newsletter';
  title: string;
  subtitle?: string;
  imageUrl?: string;
  buttonText?: string;
  isVisible: boolean;
  order: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  addresses: Address[];
  orderHistory: Order[];
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: CartItem[];
}
