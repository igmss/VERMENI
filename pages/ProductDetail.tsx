
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useStore } from '../store/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight, Minus, Plus, Truck, RefreshCcw } from 'lucide-react';

// Fix: Cast motion.img to any to avoid property 'initial' mismatch errors
const MotionImg = motion.img as any;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist, isLoading } = useStore();
  
  const product = products.find(p => p.id === id);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  if (isLoading) return <div className="h-screen flex items-center justify-center font-serif text-2xl tracking-widest">LOADING PIECE...</div>;

  if (!product) {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          <p>Piece not found.</p>
        </div>
      </Layout>
    );
  }

  const isWishlisted = wishlist.find(p => p.id === product.id);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select a size and color.');
      return;
    }
    addToCart(product, selectedSize, selectedColor);
    navigate('/cart');
  };

  return (
    <Layout>
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <nav className="flex items-center space-x-2 text-[10px] tracking-widest text-gray-400 mb-12 uppercase">
            <Link to="/" className="hover:text-graphite">Home</Link>
            <ChevronRight size={10} />
            <Link to="/shop" className="hover:text-graphite">Shop</Link>
            <ChevronRight size={10} />
            <span className="text-graphite">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
            <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-6">
              <div className="relative flex-grow aspect-[3/4] overflow-hidden bg-gray-50">
                {/* Fix: Use casted MotionImg to resolve property 'initial' mismatch */}
                <MotionImg 
                  key={activeImgIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  src={product.images[activeImgIdx]} 
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-500 cursor-zoom-in ${isZoomed ? 'scale-150' : 'scale-100'}`}
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                />
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-6 right-6 p-4 bg-pearl/80 backdrop-blur-md rounded-full text-graphite hover:text-gold transition-all"
                >
                  <Heart size={20} className={isWishlisted ? 'fill-gold text-gold' : ''} />
                </button>
              </div>
              
              <div className="flex md:flex-col gap-4 overflow-x-auto md:w-32">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImgIdx(idx)}
                    className={`flex-shrink-0 w-20 md:w-full aspect-[3/4] overflow-hidden border-2 transition-all ${activeImgIdx === idx ? 'border-gold' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col">
              <span className="text-xs tracking-[0.3em] text-gold uppercase mb-4">{product.category}</span>
              <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">{product.name}</h1>
              <p className="text-2xl text-graphite font-medium mb-10">€{product.price.toLocaleString()}</p>
              
              <p className="text-sm text-gray-500 leading-relaxed mb-10 pb-10 border-b border-gray-100">
                {product.description}
              </p>

              <div className="space-y-10 mb-12">
                <div>
                  <h4 className="text-[10px] tracking-[0.2em] font-bold uppercase mb-4">Select Color</h4>
                  <div className="flex gap-4">
                    {product.colors.map(color => (
                      <button 
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border p-1 transition-all ${selectedColor === color ? 'border-gold scale-110' : 'border-transparent'}`}
                      >
                        <div className="w-full h-full rounded-full bg-gray-200"></div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] tracking-[0.2em] font-bold uppercase mb-4">Select Size</h4>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 border text-[11px] tracking-widest ${selectedSize === size ? 'bg-graphite text-pearl' : 'border-gray-200'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                className="w-full py-6 bg-graphite text-pearl text-[11px] tracking-[0.4em] font-bold hover:bg-gold transition-all uppercase"
              >
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
