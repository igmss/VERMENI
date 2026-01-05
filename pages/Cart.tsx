
import React from 'react';
import { Layout } from '../components/Layout';
import { useStore } from '../store/StoreContext';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

// Fix: Cast motion.div to any to avoid property 'initial' mismatch errors
const MotionDiv = motion.div as any;

const Cart = () => {
  const { cart, removeFromCart } = useStore();
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <Layout>
      <div className="pt-40 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-serif mb-12">Shopping Bag</h1>
          
          {cart.length === 0 ? (
            <div className="py-20 text-center bg-gray-50 rounded-sm">
              <ShoppingBag size={48} className="mx-auto text-gray-200 mb-6" />
              <p className="text-xl font-serif text-gray-400 mb-8">Your bag is currently empty.</p>
              <Link to="/shop" className="inline-block px-10 py-4 bg-graphite text-pearl text-[11px] tracking-widest uppercase hover:bg-gold transition-all">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Items */}
              <div className="lg:col-span-8">
                <div className="border-t border-gray-100">
                  {cart.map((item, idx) => (
                    /* Fix: Use casted MotionDiv to resolve property 'initial' mismatch */
                    <MotionDiv 
                      key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col md:flex-row items-center py-8 border-b border-gray-100 gap-8"
                    >
                      <img src={item.images[0]} alt={item.name} className="w-32 aspect-[3/4] object-cover" />
                      <div className="flex-grow">
                        <h3 className="font-serif text-xl mb-1">{item.name}</h3>
                        <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-4">
                          Size: {item.selectedSize} / Color: {item.selectedColor}
                        </p>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-4 border border-gray-100 px-3 py-1">
                            <button className="text-gray-400 hover:text-graphite"><Minus size={12}/></button>
                            <span className="text-xs font-medium">{item.quantity}</span>
                            <button className="text-gray-400 hover:text-graphite"><Plus size={12}/></button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                            className="text-[10px] tracking-widest text-gray-400 hover:text-red-500 transition-colors flex items-center"
                          >
                            <Trash2 size={12} className="mr-1" /> REMOVE
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium">€{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </MotionDiv>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-4">
                <div className="bg-gray-50 p-8 rounded-sm sticky top-32">
                  <h3 className="text-[11px] tracking-[0.3em] font-bold uppercase mb-8 pb-4 border-b border-gray-200">Order Summary</h3>
                  <div className="space-y-6 mb-10">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">€{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Estimated Shipping</span>
                      <span className="font-medium">{shipping === 0 ? 'Complimentary' : `€${shipping}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span className="font-medium text-xs italic">Calculated at checkout</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-6 mb-10">
                    <div className="flex justify-between">
                      <span className="text-lg font-serif">Total</span>
                      <span className="text-xl font-medium">€{total.toLocaleString()}</span>
                    </div>
                  </div>
                  <Link 
                    to="/cart" 
                    className="w-full py-5 bg-gold text-white text-[11px] tracking-[0.3em] font-bold flex items-center justify-center hover:bg-graphite transition-all uppercase shadow-lg"
                  >
                    PROCEED TO CHECKOUT <ArrowRight size={14} className="ml-2" />
                  </Link>
                  <p className="text-[10px] text-center text-gray-400 mt-6 leading-relaxed">
                    By proceeding to checkout you agree to our <br/> <Link to="/" className="underline">Terms and Conditions</Link>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
