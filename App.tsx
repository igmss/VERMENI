
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './store/StoreContext';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Admin = lazy(() => import('./pages/Admin'));
const Cart = lazy(() => import('./pages/Cart'));
const Profile = lazy(() => import('./pages/Profile'));

import { Layout } from './components/Layout';

const LoadingScreen = () => (
  <div className="h-screen w-full flex items-center justify-center bg-pearl">
    <div className="text-center">
      <h1 className="text-4xl font-serif tracking-[0.3em] text-graphite animate-pulse mb-4">VERMENI</h1>
      <p className="text-[10px] tracking-[0.5em] text-gold uppercase">Atelier Loading...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            {/* Catch-all - redirecting to home for this demo */}
            <Route path="*" element={<Layout><Home /></Layout>} />
          </Routes>
        </Suspense>
      </Router>
    </StoreProvider>
  );
};

export default App;
