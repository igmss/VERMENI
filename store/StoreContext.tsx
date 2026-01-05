
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, SectionConfig, UserProfile } from '../types';
import { supabase } from '../lib/supabase';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (id: string, size: string, color: string) => void;
  toggleWishlist: (product: Product) => void;
  homepageConfig: SectionConfig[];
  updateHomepageConfig: (config: SectionConfig[]) => Promise<boolean>;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  refreshData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [homepageConfig, setHomepageConfig] = useState<SectionConfig[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch Products
      const { data: productsData, error: pError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (pError) throw pError;

      // Fetch Homepage Config
      const { data: configData, error: cError } = await supabase
        .from('homepage_config')
        .select('*')
        .order('display_order', { ascending: true });

      if (cError) throw cError;

      if (productsData) {
        setProducts(productsData.map(p => ({
          ...p,
          ageRange: p.age_range || '1-6Y',
          careInstructions: p.care_instructions || 'Professional clean only',
          isNew: p.is_new,
          isFeatured: p.is_featured,
          reviews: p.reviews || []
        })));
      }
      
      if (configData && configData.length > 0) {
        // CRITICAL FIX: Explicitly map database is_visible to frontend isVisible
        const mappedConfig = configData.map(c => ({
          id: c.id,
          type: c.type,
          title: c.title,
          subtitle: c.subtitle,
          imageUrl: c.image_url,
          buttonText: c.button_text,
          isVisible: c.is_visible, // Fixed mapping
          order: c.display_order
        }));
        console.log('Atelier Data Fetched:', mappedConfig);
        setHomepageConfig(mappedConfig);
      } else {
        setHomepageConfig([]);
      }
    } catch (err: any) {
      console.error('Atelier Connection Error:', err);
      setError(err.message || 'Failed to connect to the luxury database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addToCart = (product: Product, size: string, color: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === size && item.selectedColor === color) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  };

  const removeFromCart = (id: string, size: string, color: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size && item.selectedColor === color)));
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(p => p.id === product.id)) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const updateHomepageConfig = async (config: SectionConfig[]): Promise<boolean> => {
    const updates = config.map(c => ({
      id: c.id,
      type: c.type,
      title: c.title,
      subtitle: c.subtitle,
      image_url: c.imageUrl,
      button_text: c.buttonText,
      is_visible: c.isVisible,
      display_order: c.order
    }));

    try {
      console.log('Publishing to cloud:', updates);
      // Explicitly tell Supabase which column is the primary key for upsert
      const { error } = await supabase
        .from('homepage_config')
        .upsert(updates, { onConflict: 'id' });
        
      if (error) throw error;
      
      setHomepageConfig(config);
      return true;
    } catch (err: any) {
      console.error('Save Error:', err);
      alert('Cloud Sync Failed: ' + (err.message || 'Check your Supabase RLS policies.'));
      await fetchData(); // Rollback local state to what's in DB
      return false;
    }
  };

  const login = () => {
    setUser({
      name: 'Julian Vermeni',
      email: 'julian@vermeni.luxury',
      addresses: [{ id: '1', label: 'Primary Residence', street: '15 Place Vendôme', city: 'Paris', zip: '75001', country: 'France' }],
      orderHistory: []
    });
  };

  const logout = () => setUser(null);

  return (
    <StoreContext.Provider value={{
      products, cart, wishlist, addToCart, removeFromCart, toggleWishlist,
      homepageConfig, updateHomepageConfig, user, login, logout, isLoading, error,
      refreshData: fetchData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
