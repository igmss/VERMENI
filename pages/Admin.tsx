
import React, { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import { useStore } from '../store/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, MoveUp, MoveDown, Save, Plus, Trash2, Layout as LayoutIcon, Settings, Image as ImageIcon, Type, BarChart3, Package, Lock, ArrowRight, Database, Sparkles, Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';

const MotionDiv = motion.div as any;

const Admin = () => {
  const { homepageConfig, updateHomepageConfig, refreshData, products } = useStore();
  const [localConfig, setLocalConfig] = useState([...homepageConfig]);
  const [activeModule, setActiveModule] = useState<'layout' | 'products' | 'analytics'>('layout');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Product Management State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    category: 'Dresses',
    sizes: [],
    colors: [],
    images: [],
    isNew: true,
    isFeatured: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setLocalConfig([...homepageConfig]);
  }, [homepageConfig]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'vermeni2025') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid atelier credentials.');
    }
  };

  // --- Image Upload Logic ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [...(newProduct.images || [])];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    setNewProduct({ ...newProduct, images: uploadedUrls });
    setIsUploading(false);
  };

  const removeUploadedImage = (index: number) => {
    const images = [...(newProduct.images || [])];
    images.splice(index, 1);
    setNewProduct({ ...newProduct, images });
  };

  const handleSaveProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Please provide at least a name and price for the masterpiece.');
      return;
    }

    const payload = {
      name: newProduct.name,
      price: newProduct.price,
      description: newProduct.description,
      category: newProduct.category,
      images: newProduct.images,
      sizes: newProduct.sizes,
      colors: newProduct.colors,
      is_new: newProduct.isNew,
      is_featured: newProduct.isFeatured,
      age_range: '1-6Y',
      care_instructions: 'Dry clean only'
    };

    const { error } = await supabase.from('products').insert([payload]);
    
    if (error) {
      console.error('Save error:', error);
      alert('Failed to save product to catalog.');
    } else {
      alert('Product added to the Vermeni Collection.');
      setIsAddingProduct(false);
      setNewProduct({
        name: '', price: 0, description: '', category: 'Dresses', images: [], sizes: [], colors: [], isNew: true, isFeatured: false
      });
      refreshData();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this piece from the catalog?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) refreshData();
  };

  // --- Homepage Layout Logic ---
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newConfig = [...localConfig];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newConfig.length) return;
    
    [newConfig[index], newConfig[targetIdx]] = [newConfig[targetIdx], newConfig[index]];
    newConfig.forEach((item, idx) => item.order = idx);
    setLocalConfig(newConfig);
  };

  const toggleVisibility = (id: string) => {
    setLocalConfig(prev => prev.map(item => item.id === id ? { ...item, isVisible: !item.isVisible } : item));
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    setLocalConfig(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const saveChanges = async () => {
    await updateHomepageConfig(localConfig);
    alert('Cloud Database updated successfully.');
  };

  const initializeDatabase = async () => {
    if (!confirm('This will seed initial sample data to your Supabase instance. Continue?')) return;
    setIsInitializing(true);
    try {
      const initialProducts = [
        { name: 'Aurelia Silk Tulle Gown', price: 1250, description: 'Hand-woven Italian silk tulle with delicate 24k gold thread embroidery.', category: 'Dresses', images: ['https://picsum.photos/id/64/800/1200'], sizes: ['2Y', '4Y'], colors: ['Pearl White'], age_range: '2-6Y', care_instructions: 'Dry clean', is_new: true, is_featured: true },
        { name: 'Emperor Velvet Suit', price: 980, description: 'Bespoke velvet suit tailored from premium French cotton velvet.', category: 'Suits', images: ['https://picsum.photos/id/129/800/1200'], sizes: ['4Y', '6Y'], colors: ['Graphite'], age_range: '3-6Y', care_instructions: 'Dry clean', is_new: false, is_featured: true }
      ];

      const initialConfig = [
        { id: 'hero-1', type: 'hero', title: 'The Golden Age of Childhood', subtitle: 'Where Heritage Meets Haute Couture', image_url: 'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?q=80&w=2000', button_text: 'Discover Collection', is_visible: true, display_order: 0 },
        { id: 'featured-1', type: 'featured', title: 'Exquisite Creations', subtitle: 'Masterpieces crafted for your most precious moments.', is_visible: true, display_order: 1 },
        { id: 'banner-1', type: 'banner', title: 'The Artisanal Atelier', subtitle: 'Each piece tells a story of a thousand stitches.', image_url: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2000', button_text: 'Explore the Craft', is_visible: true, display_order: 2 }
      ];

      await supabase.from('products').upsert(initialProducts);
      await supabase.from('homepage_config').upsert(initialConfig);
      
      await refreshData();
      alert('Atelier Initialized! Real data is now in your Supabase.');
    } catch (err) {
      console.error(err);
      alert('Initialization error. Check console.');
    } finally {
      setIsInitializing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="pt-40 pb-20 min-h-screen bg-graphite flex items-center justify-center">
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 max-w-md w-full text-center shadow-2xl rounded-sm"
          >
            <Lock size={40} className="mx-auto text-gold mb-8" />
            <h1 className="text-3xl font-serif mb-4">Atelier Access</h1>
            <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase mb-12">Private Administrative Portal</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input 
                  type="password" 
                  placeholder="Enter Atelier Passcode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 border-b border-gray-200 text-center text-sm focus:outline-none focus:border-gold transition-colors tracking-widest placeholder:text-gray-300"
                />
                {error && <p className="text-[10px] text-red-500 mt-4 uppercase tracking-widest">{error}</p>}
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-gold text-white text-[11px] tracking-[0.4em] font-bold flex items-center justify-center hover:bg-graphite transition-all uppercase"
              >
                Authenticate <ArrowRight size={14} className="ml-2" />
              </button>
            </form>
          </MotionDiv>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-40 pb-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-6">
            <div>
              <h1 className="text-5xl font-serif mb-4">Atelier CMS</h1>
              <div className="flex space-x-12 mt-8">
                {['layout', 'products', 'analytics'].map((mod: any) => (
                  <button 
                    key={mod}
                    onClick={() => setActiveModule(mod)}
                    className={`text-[10px] tracking-[0.3em] font-bold uppercase pb-2 border-b-2 transition-all ${
                      activeModule === mod ? 'text-gold border-gold' : 'text-gray-300 border-transparent hover:text-graphite'
                    }`}
                  >
                    {mod}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              {activeModule === 'layout' ? (
                <>
                  <button 
                    onClick={initializeDatabase}
                    disabled={isInitializing}
                    className="flex items-center space-x-2 px-8 py-5 border border-gold text-gold text-[10px] tracking-[0.2em] font-bold hover:bg-gold hover:text-white transition-all disabled:opacity-50"
                  >
                    <Database size={16} />
                    <span>{isInitializing ? 'INITIALIZING...' : 'INITIALIZE REAL DATA'}</span>
                  </button>
                  <button 
                    onClick={saveChanges}
                    className="flex items-center space-x-2 px-10 py-5 bg-gold text-white text-[11px] tracking-[0.2em] font-bold hover:bg-graphite transition-all shadow-xl"
                  >
                    <Save size={16} />
                    <span>PUBLISH LAYOUT</span>
                  </button>
                </>
              ) : activeModule === 'products' ? (
                <button 
                  onClick={() => setIsAddingProduct(true)}
                  className="flex items-center space-x-2 px-10 py-5 bg-graphite text-white text-[11px] tracking-[0.2em] font-bold hover:bg-gold transition-all shadow-xl"
                >
                  <Plus size={16} />
                  <span>NEW PIECE</span>
                </button>
              ) : null}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeModule === 'layout' && (
              <MotionDiv 
                key="layout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {localConfig.map((section, idx) => (
                  <MotionDiv 
                    layout
                    key={section.id}
                    className={`bg-white p-10 border-l-[6px] ${section.isVisible ? 'border-gold shadow-md' : 'border-gray-200 opacity-60'} transition-all`}
                  >
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-50">
                      <div className="flex items-center space-x-6">
                        <div className="w-12 h-12 bg-gray-50 flex items-center justify-center text-gold rounded-sm">
                          {section.type === 'hero' ? <LayoutIcon size={24} /> : <ImageIcon size={24} />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold tracking-[0.2em] uppercase">{section.type}</h4>
                          <span className="text-[10px] text-gray-400 font-mono">{section.id}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <button onClick={() => moveSection(idx, 'up')} className="p-3 hover:bg-gray-50 text-gray-400 transition-colors"><MoveUp size={18}/></button>
                        <button onClick={() => moveSection(idx, 'down')} className="p-3 hover:bg-gray-50 text-gray-400 transition-colors"><MoveDown size={18}/></button>
                        <div className="w-[1px] h-6 bg-gray-100 mx-2"></div>
                        <button onClick={() => toggleVisibility(section.id)} className={`p-3 transition-colors ${section.isVisible ? 'text-gold' : 'text-gray-300'}`}>
                          {section.isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <div>
                          <label className="block text-[10px] tracking-[0.2em] font-bold uppercase mb-3 text-gray-400">Headline</label>
                          <input 
                            type="text" 
                            value={section.title}
                            onChange={(e) => handleUpdate(section.id, 'title', e.target.value)}
                            className="w-full p-4 border border-gray-100 text-lg focus:outline-none focus:border-gold font-serif transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-[0.2em] font-bold uppercase mb-3 text-gray-400">Subtitle</label>
                          <textarea 
                            value={section.subtitle}
                            onChange={(e) => handleUpdate(section.id, 'subtitle', e.target.value)}
                            className="w-full p-4 border border-gray-100 text-sm h-32 focus:outline-none focus:border-gold transition-all leading-relaxed"
                          />
                        </div>
                      </div>
                      <div className="space-y-8">
                        {section.imageUrl !== undefined && (
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] font-bold uppercase mb-3 text-gray-400">Atmosphere URL</label>
                            <input 
                              type="text" 
                              value={section.imageUrl}
                              onChange={(e) => handleUpdate(section.id, 'imageUrl', e.target.value)}
                              className="w-full p-4 border border-gray-100 text-[10px] text-gray-400 focus:outline-none focus:border-gold transition-all font-mono"
                            />
                          </div>
                        )}
                        {section.buttonText !== undefined && (
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] font-bold uppercase mb-3 text-gray-400">Action Callout</label>
                            <input 
                              type="text" 
                              value={section.buttonText}
                              onChange={(e) => handleUpdate(section.id, 'buttonText', e.target.value)}
                              className="w-full p-4 border border-gray-100 text-[11px] tracking-[0.3em] font-bold focus:outline-none focus:border-gold transition-all uppercase"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </MotionDiv>
                ))}
              </MotionDiv>
            )}

            {activeModule === 'products' && (
              <MotionDiv 
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-10 shadow-sm rounded-sm"
              >
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-3xl font-serif">Catalog Management</h3>
                  <div className="text-[10px] tracking-widest text-gray-400 uppercase">Total Items: {products.length}</div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">
                        <th className="pb-6">Piece</th>
                        <th className="pb-6">Category</th>
                        <th className="pb-6">Price</th>
                        <th className="pb-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} className="border-b border-gray-50 last:border-0 group hover:bg-gray-50/50 transition-all">
                          <td className="py-6 flex items-center space-x-6">
                            <div className="w-16 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-serif text-lg">{p.name}</div>
                              <div className="text-[10px] tracking-widest text-gray-400 uppercase mt-1">ID: {p.id.slice(0, 8)}...</div>
                            </div>
                          </td>
                          <td className="py-6">
                            <span className="text-[10px] tracking-widest uppercase text-gold font-bold">{p.category}</span>
                          </td>
                          <td className="py-6 font-medium">€{p.price.toLocaleString()}</td>
                          <td className="py-6 text-right space-x-4">
                            <button className="text-[10px] tracking-widest text-gray-400 hover:text-gold uppercase font-bold transition-colors">Edit</button>
                            <button 
                              onClick={() => handleDeleteProduct(p.id)}
                              className="text-[10px] tracking-widest text-gray-400 hover:text-red-500 uppercase font-bold transition-colors"
                            >
                              Archive
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* NEW PRODUCT MODAL */}
      <AnimatePresence>
        {isAddingProduct && (
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-graphite/40 backdrop-blur-md flex items-center justify-center p-6"
          >
            <MotionDiv 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-sm p-12 relative"
            >
              <button 
                onClick={() => setIsAddingProduct(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-graphite transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-12">
                <h2 className="text-4xl font-serif mb-2">New Masterpiece</h2>
                <p className="text-[10px] tracking-[0.3em] text-gold uppercase">Add a new creation to the Vermeni Catalog</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Side: Details */}
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] font-bold uppercase mb-3 text-gray-400">Piece Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Aurelia Silk Tulle Gown"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full p-4 border border-gray-100 text-lg focus:outline-none focus:border-gold font-serif transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] font-bold uppercase mb-3 text-gray-400">Atelier Price (€)</label>
                      <input 
                        type="number" 
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                        className="w-full p-4 border border-gray-100 text-sm focus:outline-none focus:border-gold transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] font-bold uppercase mb-3 text-gray-400">Category</label>
                      <select 
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value as Category})}
                        className="w-full p-4 border border-gray-100 text-xs tracking-widest uppercase focus:outline-none focus:border-gold transition-all"
                      >
                        <option>Dresses</option>
                        <option>Suits</option>
                        <option>Accessories</option>
                        <option>Outerwear</option>
                        <option>Shoes</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] font-bold uppercase mb-3 text-gray-400">Atelier Description</label>
                    <textarea 
                      placeholder="Describe the heritage and craft..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full p-4 border border-gray-100 text-sm h-32 focus:outline-none focus:border-gold transition-all leading-relaxed"
                    />
                  </div>
                </div>

                {/* Right Side: Imagery */}
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] font-bold uppercase mb-3 text-gray-400">Piece Imagery</label>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {newProduct.images?.map((url, idx) => (
                        <div key={idx} className="relative aspect-[3/4] bg-gray-50 rounded-sm overflow-hidden group">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => removeUploadedImage(idx)}
                            className="absolute inset-0 bg-graphite/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} className="text-white" />
                          </button>
                        </div>
                      ))}
                      
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="aspect-[3/4] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:text-gold hover:border-gold transition-all"
                      >
                        {isUploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                        <span className="text-[8px] tracking-widest uppercase font-bold mt-2">{isUploading ? 'Uploading...' : 'Add Shot'}</span>
                      </button>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                    />
                    <p className="text-[9px] text-gray-400 tracking-widest italic">Professional Atelier shots recommended (Aspect 3:4).</p>
                  </div>

                  <div className="pt-10 border-t border-gray-50">
                    <button 
                      onClick={handleSaveProduct}
                      className="w-full py-6 bg-graphite text-white text-[11px] tracking-[0.4em] font-bold hover:bg-gold transition-all uppercase shadow-xl"
                    >
                      Archive Piece to Catalog
                    </button>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Admin;
