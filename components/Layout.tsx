
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Heart, Menu, X, Search, Settings } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';

// Fix: Cast motion.div to any to avoid property 'initial' mismatch errors in this environment
const MotionDiv = motion.div as any;

const Navbar = () => {
  const { cart, wishlist, user } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'COLLECTIONS', path: '/shop' },
    { name: 'ATELIER', path: '/shop' },
    { name: 'WORLD OF VERMENI', path: '/' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
      isScrolled || location.pathname !== '/' ? 'bg-pearl/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Left Links - Desktop */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`text-[10px] tracking-[0.3em] font-medium transition-colors hover:text-gold ${
                isScrolled || location.pathname !== '/' ? 'text-graphite' : 'text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Logo */}
        <Link to="/" className="text-2xl lg:text-3xl font-serif tracking-[0.2em] relative group">
          <span className={isScrolled || location.pathname !== '/' ? 'text-graphite' : 'text-white'}>VERMENI</span>
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-500 group-hover:w-full"></span>
        </Link>

        {/* Right Icons */}
        <div className={`flex items-center space-x-6 ${isScrolled || location.pathname !== '/' ? 'text-graphite' : 'text-white'}`}>
          <Link to="/shop" className="hover:text-gold transition-colors"><Search size={20} strokeWidth={1.5} /></Link>
          <Link to="/profile" className="hover:text-gold transition-colors flex items-center">
            <User size={20} strokeWidth={1.5} />
            {user && <span className="hidden lg:inline ml-2 text-[10px] tracking-widest">MY ATELIER</span>}
          </Link>
          <Link to="/profile" className="relative hover:text-gold transition-colors">
            <Heart size={20} strokeWidth={1.5} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-white text-[8px] w-3 h-3 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative hover:text-gold transition-colors">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-white text-[8px] w-3 h-3 flex items-center justify-center rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>
          <Link to="/admin" className="hover:text-gold transition-colors"><Settings size={20} strokeWidth={1.5} /></Link>
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden">
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          /* Fix: Use casted MotionDiv to resolve property 'initial' mismatch */
          <MotionDiv 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-pearl z-[60] flex flex-col p-10"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsMobileMenuOpen(false)}><X size={32} strokeWidth={1} /></button>
            </div>
            <div className="flex flex-col space-y-8 mt-20">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-serif text-graphite hover:text-gold transition-colors">HOME</Link>
              {navLinks.map(link => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl font-serif text-graphite hover:text-gold transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-serif text-graphite hover:text-gold transition-colors">PROFILE</Link>
              <Link 
                to="/admin" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl tracking-widest text-gold mt-10"
              >
                ADMIN DASHBOARD
              </Link>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-graphite text-pearl pt-20 pb-10">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-pearl/10 pb-20">
        <div>
          <h3 className="font-serif text-2xl mb-8 tracking-widest">VERMENI</h3>
          <p className="text-sm font-light leading-loose opacity-70 max-w-xs">
            Redefining childhood elegance through exceptional craftsmanship and heritage-inspired design.
          </p>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[0.3em] font-semibold mb-8 uppercase">Concierge</h4>
          <ul className="space-y-4 text-xs font-light opacity-60">
            <li><Link to="/shop" className="hover:text-gold transition-colors">The Boutique</Link></li>
            <li><Link to="/profile" className="hover:text-gold transition-colors">My Profile</Link></li>
            <li><Link to="/shop" className="hover:text-gold transition-colors">Size Guide</Link></li>
            <li><Link to="/" className="hover:text-gold transition-colors">Contact Atelier</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[0.3em] font-semibold mb-8 uppercase">The Brand</h4>
          <ul className="space-y-4 text-xs font-light opacity-60">
            <li><Link to="/" className="hover:text-gold transition-colors">Our Story</Link></li>
            <li><Link to="/" className="hover:text-gold transition-colors">Craftsmanship</Link></li>
            <li><Link to="/" className="hover:text-gold transition-colors">Careers</Link></li>
            <li><Link to="/" className="hover:text-gold transition-colors">Press</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[0.3em] font-semibold mb-8 uppercase">Atelier Letters</h4>
          <p className="text-xs font-light opacity-60 mb-6">Receive invitations to private viewings and early access.</p>
          <div className="flex border-b border-pearl/30 pb-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-transparent text-xs w-full focus:outline-none placeholder:text-pearl/30"
            />
            <button className="text-[10px] tracking-widest text-gold hover:text-white transition-colors">JOIN</button>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mt-10 text-[10px] tracking-widest opacity-40">
        <p>© 2025 VERMENI LUXURY GROUP. ALL RIGHTS RESERVED.</p>
        <div className="flex space-x-8 mt-4 md:mt-0">
          <Link to="/">PRIVACY POLICY</Link>
          <Link to="/">TERMS OF SERVICE</Link>
          <Link to="/">COOKIE SETTINGS</Link>
        </div>
      </div>
    </div>
  </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
