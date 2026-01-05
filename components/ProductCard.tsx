
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../store/StoreContext';

// Fix: Cast motion.div to any to avoid property 'initial' mismatch errors
const MotionDiv = motion.div as any;

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.find(p => p.id === product.id);

  return (
    /* Fix: Use casted MotionDiv to resolve property 'initial' mismatch */
    <MotionDiv 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          {product.images[1] && (
            <img 
              src={product.images[1]} 
              alt={`${product.name} alternative`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000 group-hover:opacity-100"
            />
          )}
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="text-[8px] tracking-[0.2em] font-bold bg-pearl text-graphite px-3 py-1 uppercase shadow-sm">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={() => toggleWishlist(product)}
          className="absolute top-4 right-4 p-2 bg-pearl/80 backdrop-blur-sm rounded-full opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0"
        >
          <Heart 
            size={16} 
            className={isWishlisted ? 'fill-gold text-gold' : 'text-graphite'} 
          />
        </button>

        {/* Quick Add (Hover) */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full transition-transform duration-500 group-hover:translate-y-0">
          <Link 
            to={`/product/${product.id}`}
            className="w-full py-4 bg-graphite/90 backdrop-blur-md text-pearl text-[10px] tracking-[0.3em] flex items-center justify-center hover:bg-gold transition-colors"
          >
            VIEW DETAILS
          </Link>
        </div>
      </div>

      <div className="mt-6 text-center">
        <h3 className="text-xs tracking-widest text-gray-500 uppercase mb-2">{product.category}</h3>
        <Link to={`/product/${product.id}`}>
          <h2 className="font-serif text-lg mb-2 group-hover:text-gold transition-colors">{product.name}</h2>
        </Link>
        <p className="text-sm font-medium text-graphite">€{product.price.toLocaleString()}</p>
      </div>
    </MotionDiv>
  );
};
