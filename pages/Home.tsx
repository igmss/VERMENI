
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useStore } from '../store/StoreContext';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';

const MotionDiv = motion.div as any;
const MotionSpan = motion.span as any;
const MotionH1 = motion.h1 as any;
const MotionH2 = motion.h2 as any;
const MotionP = motion.p as any;

const HeroSection = ({ title, subtitle, imageUrl, buttonText }: any) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-graphite">
      <MotionDiv style={{ y, scale } as any} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img src={imageUrl || 'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?q=80&w=2000'} alt="Hero" className="w-full h-full object-cover" />
      </MotionDiv>
      
      <MotionDiv 
        style={{ opacity } as any}
        className="relative z-20 text-center text-white px-6"
      >
        <MotionSpan 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="block text-[10px] tracking-[0.8em] uppercase mb-8 font-semibold text-gold"
        >
          Vermeni Excellence
        </MotionSpan>
        <MotionH1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-9xl font-serif mb-10 leading-[1.1] tracking-tight"
        >
          {title}
        </MotionH1>
        <MotionP 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.2 }}
          className="text-lg font-light tracking-[0.2em] mb-12 max-w-3xl mx-auto opacity-80"
        >
          {subtitle}
        </MotionP>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          <Link to="/shop" className="group relative inline-block px-14 py-6 border border-white/30 text-[11px] tracking-[0.4em] font-medium transition-all duration-700 uppercase overflow-hidden">
            <span className="relative z-10 group-hover:text-graphite transition-colors duration-500">{buttonText || 'Discover'}</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Link>
        </MotionDiv>
      </MotionDiv>

      {/* Interactive Butterfly elements */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {[...Array(5)].map((_, i) => (
          <MotionDiv
            key={i}
            animate={{
              x: [Math.random() * 100, Math.random() * 1000],
              y: [Math.random() * 100, Math.random() * 800],
              opacity: [0, 0.2, 0],
            }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
            className="absolute text-gold"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </MotionDiv>
        ))}
      </div>
    </section>
  );
};

const FeaturedSection = ({ title, subtitle }: any) => {
  const { products } = useStore();
  const featured = products.filter(p => p.isFeatured).slice(0, 3);
  
  if (featured.length === 0) return null;

  return (
    <section className="py-40 bg-pearl">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <MotionH2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl font-serif mb-8"
            >
              {title}
            </MotionH2>
            <MotionP 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-500 text-sm tracking-[0.15em] leading-relaxed uppercase"
            >
              {subtitle}
            </MotionP>
          </div>
          <Link to="/shop" className="text-[10px] tracking-[0.3em] font-bold border-b border-gold pb-2 hover:text-gold transition-colors uppercase">
            View All Pieces
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
          {featured.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ContentBanner = ({ title, subtitle, imageUrl, buttonText }: any) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="h-[90vh] relative overflow-hidden flex items-center bg-graphite">
      <MotionDiv style={{ y } as any} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img src={imageUrl || 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2000'} alt="Banner" className="w-full h-full object-cover grayscale-[40%]" />
      </MotionDiv>
      <div className="container mx-auto px-6 relative z-20 text-white">
        <div className="max-w-3xl">
          <MotionH2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-serif mb-8 leading-tight"
          >
            {title}
          </MotionH2>
          <MotionP 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xl tracking-[0.1em] font-light mb-12 opacity-80"
          >
            {subtitle}
          </MotionP>
          <Link to="/shop" className="inline-block px-12 py-5 bg-pearl text-graphite text-[11px] tracking-[0.3em] font-bold hover:bg-gold hover:text-white transition-all duration-500 uppercase">
            {buttonText || 'Explore'}
          </Link>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const { homepageConfig, isLoading } = useStore();

  if (isLoading) return (
    <div className="h-screen w-full flex items-center justify-center bg-pearl">
      <div className="text-center">
        <h1 className="text-4xl font-serif tracking-[0.4em] text-graphite animate-pulse mb-4">VERMENI</h1>
        <p className="text-[10px] tracking-[0.6em] text-gold uppercase opacity-60">Initializing Atelier</p>
      </div>
    </div>
  );

  // If no config found in real DB, show a welcome state
  if (homepageConfig.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-pearl text-center px-6">
        <h1 className="text-5xl font-serif mb-6">Welcome to Vermeni</h1>
        <p className="text-gray-400 tracking-widest uppercase text-xs mb-10 max-w-md mx-auto leading-loose">
          Your luxury database is connected. Please visit the Admin Dashboard to initialize your homepage layout.
        </p>
        <Link to="/admin" className="px-10 py-4 bg-graphite text-pearl text-[11px] tracking-[0.4em] uppercase hover:bg-gold transition-all">
          Open Atelier Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-0">
      {homepageConfig
        .filter(section => section.isVisible)
        .sort((a, b) => a.order - b.order)
        .map(section => {
          switch (section.type) {
            case 'hero':
              return <HeroSection key={section.id} {...section} />;
            case 'featured':
              return <FeaturedSection key={section.id} {...section} />;
            case 'banner':
              return <ContentBanner key={section.id} {...section} />;
            default:
              return null;
          }
        })}
    </div>
  );
};

export default Home;
