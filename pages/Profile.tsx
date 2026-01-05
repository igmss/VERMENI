
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useStore } from '../store/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';

// Fix: Cast motion.div to any to avoid property 'initial' mismatch errors
const MotionDiv = motion.div as any;

const Profile = () => {
  const { user, wishlist, logout, login } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'settings'>('overview');

  if (!user) {
    return (
      <Layout>
        <div className="pt-40 pb-20 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <h1 className="text-4xl font-serif mb-6">Welcome Back</h1>
            <p className="text-gray-500 text-sm tracking-widest mb-10 leading-relaxed uppercase">
              Please sign in to access your private atelier profile and orders.
            </p>
            <button 
              onClick={login}
              className="w-full py-5 bg-graphite text-pearl text-[11px] tracking-[0.4em] font-bold hover:bg-gold transition-all duration-500 uppercase"
            >
              Sign In to Vermeni
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <Layout>
      <div className="pt-40 pb-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
              <div className="bg-white p-8 shadow-sm rounded-sm">
                <div className="text-center mb-10">
                  <div className="w-24 h-24 bg-blush rounded-full mx-auto mb-4 flex items-center justify-center text-graphite font-serif text-3xl">
                    {user.name.charAt(0)}
                  </div>
                  <h2 className="text-xl font-serif">{user.name}</h2>
                  <p className="text-[10px] tracking-widest text-gray-400 mt-1 uppercase">{user.email}</p>
                </div>

                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-4 px-4 py-4 text-[10px] tracking-[0.2em] font-bold uppercase transition-all ${
                        activeTab === tab.id ? 'bg-pearl text-gold border-r-2 border-gold' : 'text-gray-400 hover:text-graphite hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon size={16} strokeWidth={1.5} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                  <button 
                    onClick={logout}
                    className="w-full flex items-center space-x-4 px-4 py-4 text-[10px] tracking-[0.2em] font-bold uppercase text-red-400 hover:bg-red-50 transition-all mt-6"
                  >
                    <LogOut size={16} strokeWidth={1.5} />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                {/* Fix: Use casted MotionDiv to resolve property 'initial' mismatch */}
                <MotionDiv
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-10 shadow-sm rounded-sm min-h-[600px]"
                >
                  {activeTab === 'overview' && (
                    <div>
                      <h3 className="text-2xl font-serif mb-8">Atelier Dashboard</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="border border-gray-100 p-6 rounded-sm">
                          <h4 className="text-[10px] tracking-widest font-bold text-gold uppercase mb-4">Recent Activity</h4>
                          <p className="text-sm text-gray-500 italic">No recent orders found.</p>
                        </div>
                        <div className="border border-gray-100 p-6 rounded-sm">
                          <h4 className="text-[10px] tracking-widest font-bold text-gold uppercase mb-4">Saved Address</h4>
                          {user.addresses.map(addr => (
                            <div key={addr.id} className="text-sm text-graphite leading-relaxed">
                              <p className="font-semibold">{addr.label}</p>
                              <p>{addr.street}</p>
                              <p>{addr.city}, {addr.zip}</p>
                              <p>{addr.country}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-blush/10 p-8 border border-blush/20 text-center">
                        <p className="text-sm text-graphite mb-4">You have {wishlist.length} pieces in your wishlist.</p>
                        <button onClick={() => setActiveTab('wishlist')} className="text-[10px] tracking-[0.2em] font-bold text-gold hover:underline uppercase">View Wishlist</button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'orders' && (
                    <div>
                      <h3 className="text-2xl font-serif mb-8">Order History</h3>
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <ShoppingBag size={48} className="text-gray-100 mb-6" />
                        <p className="text-gray-400 text-sm italic mb-8">Your order history is currently empty.</p>
                        <Link to="/shop" className="px-10 py-4 border border-graphite text-[10px] tracking-widest uppercase hover:bg-graphite hover:text-white transition-all">Start Exploring</Link>
                      </div>
                    </div>
                  )}

                  {activeTab === 'wishlist' && (
                    <div>
                      <h3 className="text-2xl font-serif mb-10">Private Collection</h3>
                      {wishlist.length === 0 ? (
                        <div className="text-center py-20">
                          <Heart size={48} className="mx-auto text-gray-100 mb-6" />
                          <p className="text-gray-400 text-sm mb-8">No pieces saved yet.</p>
                          <Link to="/shop" className="text-gold text-[10px] font-bold tracking-widest uppercase hover:underline">Go to Boutique</Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                          {wishlist.map((item, idx) => (
                            <ProductCard key={item.id} product={item} index={idx} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div>
                      <h3 className="text-2xl font-serif mb-10">Security & Preferences</h3>
                      <form className="space-y-8 max-w-lg">
                        <div className="space-y-6">
                           <div>
                            <label className="block text-[10px] tracking-widest font-bold uppercase mb-2">Full Name</label>
                            <input type="text" defaultValue={user.name} className="w-full p-4 border border-gray-100 text-sm focus:outline-none focus:border-gold" />
                           </div>
                           <div>
                            <label className="block text-[10px] tracking-widest font-bold uppercase mb-2">Email Address</label>
                            <input type="email" defaultValue={user.email} className="w-full p-4 border border-gray-100 text-sm focus:outline-none focus:border-gold" />
                           </div>
                        </div>
                        <div className="pt-6 border-t border-gray-100">
                           <button type="button" className="px-8 py-4 bg-graphite text-pearl text-[10px] tracking-widest uppercase hover:bg-gold transition-all">Update Information</button>
                        </div>
                      </form>
                    </div>
                  )}
                </MotionDiv>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
