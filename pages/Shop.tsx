
import React, { useState, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { Filter, Grid, List, ChevronDown, X } from 'lucide-react';
import { Category } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '../store/StoreContext';

// Fix: Cast motion.div to any to avoid property 'initial' mismatch errors
const MotionDiv = motion.div as any;

const Shop = () => {
  const { products, isLoading } = useStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Newest');

  const categories: (Category | 'All')[] = ['All', 'Dresses', 'Suits', 'Accessories', 'Outerwear', 'Shoes'];

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    return result;
  }, [products, selectedCategory]);

  if (isLoading) return <div className="h-screen flex items-center justify-center font-serif text-2xl tracking-widest animate-pulse">LOADING COLLECTION...</div>;

  return (
    <Layout>
      <div className="pt-40 pb-20">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <h1 className="text-5xl font-serif mb-4">The Collection</h1>
            <p className="text-gray-500 text-sm tracking-widest">Discover our latest masterpieces for the season.</p>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-y border-gray-100 py-6 mb-12 gap-6">
            <div className="flex items-center space-x-10">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 text-[10px] tracking-widest font-semibold text-graphite hover:text-gold transition-colors"
              >
                <Filter size={14} />
                <span>FILTERS {isFilterOpen ? <X size={12} className="inline ml-1"/> : <ChevronDown size={12} className="inline ml-1"/>}</span>
              </button>
              
              <div className="hidden lg:flex items-center space-x-6">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[10px] tracking-[0.2em] transition-colors ${selectedCategory === cat ? 'text-gold' : 'text-gray-400 hover:text-graphite'}`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between w-full lg:w-auto space-x-8">
               <div className="flex items-center space-x-4 border-r border-gray-100 pr-8">
                  <button onClick={() => setViewMode('grid')} className={`${viewMode === 'grid' ? 'text-gold' : 'text-gray-300'}`}>
                    <Grid size={18} />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`${viewMode === 'list' ? 'text-gold' : 'text-gray-300'}`}>
                    <List size={18} />
                  </button>
               </div>
               
               <div className="flex items-center space-x-2 text-[10px] tracking-widest">
                  <span className="text-gray-400">SORT BY:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent font-semibold focus:outline-none cursor-pointer"
                  >
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
               </div>
            </div>
          </div>

          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-12 lg:gap-16`}>
            {filteredProducts.map((product, idx) => (
              viewMode === 'grid' ? (
                <ProductCard key={product.id} product={product} index={idx} />
              ) : (
                /* Fix: Use casted MotionDiv to resolve property 'initial' mismatch */
                <MotionDiv 
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="flex flex-col md:flex-row items-center gap-8 border-b border-gray-100 pb-12"
                >
                  <img src={product.images[0]} alt={product.name} className="w-48 aspect-[3/4] object-cover" />
                  <div className="flex-grow">
                    <span className="text-[10px] tracking-widest text-gold uppercase">{product.category}</span>
                    <h3 className="text-2xl font-serif mt-2 mb-4">{product.name}</h3>
                    <p className="text-sm text-gray-500 max-w-2xl mb-6">{product.description}</p>
                    <p className="text-lg font-medium">€{product.price.toLocaleString()}</p>
                  </div>
                  <Link to={`/product/${product.id}`} className="px-8 py-4 border border-graphite text-[10px] tracking-widest hover:bg-graphite hover:text-white transition-all uppercase">
                    View Details
                  </Link>
                </MotionDiv>
              )
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
