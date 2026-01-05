
import React, { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import { useStore } from '../store/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, MoveUp, MoveDown, Save, Plus, Trash2, Layout as LayoutIcon, Settings, Image as ImageIcon, Type, BarChart3, Package, Lock, ArrowRight, Database, Sparkles, Upload, X, Loader2, Palette, Ruler } from 'lucide-react';
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
  const [isUploadingGlobal, setIsUploadingGlobal] = useState(false);
  
  // Product Management State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    category: 'Dresses',
    sizes: ['2Y', '4Y', '6Y'],
    colors: ['Pearl White'],
    images: [],
    isNew: true,
    isFeatured: true
  });

  const [tempAttr, setTempAttr] = useState({ size: '', color: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sectionFileRef = useRef<HTMLInputElement>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

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

  // --- Generic Image Upload Logic ---
  const uploadToStorage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `atelier/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [...(newProduct.images || [])];
      for (const file of Array.from(files)) {
        const url = await uploadToStorage(file);
        uploadedUrls.push(url);
      }
      setNewProduct({ ...newProduct, images: uploadedUrls });
    } catch (err) {
      alert('Upload failed. Ensure "products" bucket exists in Supabase Storage.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSectionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingGlobal(true);
    try {
      const url = await uploadToStorage(file);
      handleUpdate(id, 'imageUrl', url);
    } catch (err) {
      alert('Upload failed.');
    } finally {
      setIsUploadingGlobal(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Masterpiece requires a name and value.');
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
      care_instructions: 'Professional Dry Clean Only'
    };

    const { error } = await supabase.from('products').insert([payload]);
    
    if (error) {
      alert('Failed to archive to cloud.');
    } else {
      alert('Archive successful.');
      setIsAddingProduct(false);
      setNewProduct({ name: '', price: 0, description: '', category: 'Dresses', images: [], sizes: ['2Y', '4Y', '6Y'], colors: ['Pearl White'], isNew: true, isFeatured: true });
      refreshData();
    }
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    setLocalConfig(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <Layout>
      <div className="pt-40 pb-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-6">
            <div>
              <h1 className="text-5xl font-serif mb-4 text-graphite">Atelier Control</h1>
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
              {activeModule === 'layout' && (
                <button 
                  onClick={() => updateHomepageConfig(localConfig).then(() => alert('Layout Published'))}
                  className="flex items-center space-x-2 px-10 py-5 bg-gold text-white text-[11px] tracking-[0.2em] font-bold hover:bg-graphite transition-all shadow-xl"
                >
                  <Save size={16} />
                  <span>PUBLISH LAYOUT</span>
                </button>
              )}
              {activeModule === 'products' && (
                <button 
                  onClick={() => setIsAddingProduct(true)}
                  className="flex items-center space-x-2 px-10 py-5 bg-graphite text-white text-[11px] tracking-[0.2em] font-bold hover:bg-gold transition-all shadow-xl"
                >
                  <Plus size={16} />
                  <span>NEW PIECE</span>
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeModule === 'layout' && (
              <MotionDiv key="layout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                {localConfig.map((section) => (
                  <MotionDiv key={section.id} className="bg-white p-10 border-l-[6px] border-gold shadow-sm">
                    <div className="flex justify-between mb-8">
                      <div className="flex items-center space-x-4">
                         <div className="p-3 bg-gray-50 text-gold"><LayoutIcon size={20}/></div>
                         <h4 className="font-bold tracking-widest uppercase text-xs">{section.type} Section</h4>
                      </div>
                      <button onClick={() => handleUpdate(section.id, 'isVisible', (!section.isVisible).toString())}>
                        {section.isVisible ? <Eye size={18} className="text-gold" /> : <EyeOff size={18} className="text-gray-300" />}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <input 
                          type="text" value={section.title} placeholder="Headline"
                          onChange={(e) => handleUpdate(section.id, 'title', e.target.value)}
                          className="w-full p-4 border border-gray-100 font-serif text-lg focus:border-gold outline-none"
                        />
                        <textarea 
                          value={section.subtitle} placeholder="Description"
                          onChange={(e) => handleUpdate(section.id, 'subtitle', e.target.value)}
                          className="w-full p-4 border border-gray-100 text-sm h-32 focus:border-gold outline-none"
                        />
                      </div>
                      <div className="space-y-6">
                        <div className="relative aspect-video bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-100 group">
                          {section.imageUrl ? (
                            <img src={section.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                          ) : <ImageIcon size={30} className="text-gray-200" />}
                          <button 
                            onClick={() => { setActiveSectionId(section.id); sectionFileRef.current?.click(); }}
                            className="absolute inset-0 bg-graphite/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white"
                          >
                            <Upload size={24} />
                            <span className="text-[10px] tracking-widest uppercase mt-2">Change Atmosphere</span>
                          </button>
                        </div>
                        <input type="file" ref={sectionFileRef} className="hidden" accept="image/*" onChange={(e) => activeSectionId && handleSectionImageUpload(e, activeSectionId)} />
                      </div>
                    </div>
                  </MotionDiv>
                ))}
              </MotionDiv>
            )}

            {activeModule === 'products' && (
              <MotionDiv key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-10">
                <table className="w-full text-left">
                  <thead className="border-b text-[10px] tracking-widest uppercase text-gray-400">
                    <tr><th className="pb-6">Piece</th><th className="pb-6">Category</th><th className="pb-6 text-right">Actions</th></tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-6 flex items-center space-x-4">
                          <img src={p.images[0]} className="w-12 h-16 object-cover bg-gray-100" />
                          <div className="font-serif">{p.name}</div>
                        </td>
                        <td className="py-6 text-[10px] tracking-widest uppercase text-gold">{p.category}</td>
                        <td className="py-6 text-right">
                          <button onClick={async () => { await supabase.from('products').delete().eq('id', p.id); refreshData(); }} className="text-red-300 hover:text-red-500"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* NEW PRODUCT MODAL */}
      <AnimatePresence>
        {isAddingProduct && (
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-graphite/60 backdrop-blur-sm flex items-center justify-center p-6">
            <MotionDiv initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white w-full max-w-5xl h-[90vh] overflow-y-auto p-12 relative shadow-2xl">
              <button onClick={() => setIsAddingProduct(false)} className="absolute top-8 right-8 text-gray-400 hover:text-graphite"><X size={24}/></button>
              
              <h2 className="text-4xl font-serif mb-12">Catalog Addition</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <input type="text" placeholder="Piece Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-4 border-b text-2xl font-serif outline-none focus:border-gold" />
                  
                  <div className="grid grid-cols-2 gap-6">
                    <input type="number" placeholder="Price (€)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} className="p-4 border focus:border-gold outline-none" />
                    <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as any})} className="p-4 border focus:border-gold outline-none uppercase text-[10px] tracking-widest font-bold">
                      <option>Dresses</option><option>Suits</option><option>Accessories</option><option>Outerwear</option><option>Shoes</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] tracking-widest uppercase font-bold text-gray-400">Available Attributes</label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="flex items-center border p-3 bg-gray-50 mb-2">
                          <Ruler size={14} className="mr-2 text-gold"/>
                          <input type="text" placeholder="Add Size (e.g. 4Y)" value={tempAttr.size} onChange={e => setTempAttr({...tempAttr, size: e.target.value})} className="bg-transparent text-xs outline-none w-full"/>
                          <button onClick={() => { if(tempAttr.size) { setNewProduct({...newProduct, sizes: [...(newProduct.sizes || []), tempAttr.size]}); setTempAttr({...tempAttr, size: ''}); } }}><Plus size={14}/></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {newProduct.sizes?.map(s => <span key={s} className="px-2 py-1 bg-pearl border text-[9px] font-bold">{s}</span>)}
                        </div>
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center border p-3 bg-gray-50 mb-2">
                          <Palette size={14} className="mr-2 text-gold"/>
                          <input type="text" placeholder="Add Color (e.g. Gold)" value={tempAttr.color} onChange={e => setTempAttr({...tempAttr, color: e.target.value})} className="bg-transparent text-xs outline-none w-full"/>
                          <button onClick={() => { if(tempAttr.color) { setNewProduct({...newProduct, colors: [...(newProduct.colors || []), tempAttr.color]}); setTempAttr({...tempAttr, color: ''}); } }}><Plus size={14}/></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {newProduct.colors?.map(c => <span key={c} className="px-2 py-1 bg-pearl border text-[9px] font-bold">{c}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <textarea placeholder="The story behind the piece..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full p-4 border h-32 focus:border-gold outline-none text-sm leading-loose" />
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-4">Masterpiece Imagery</label>
                    <div className="grid grid-cols-3 gap-4">
                      {newProduct.images?.map((url, idx) => (
                        <div key={idx} className="aspect-[3/4] bg-gray-100 relative group">
                          <img src={url} className="w-full h-full object-cover" />
                          <button onClick={() => setNewProduct({...newProduct, images: newProduct.images?.filter((_, i) => i !== idx)})} className="absolute inset-0 bg-red-500/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"><Trash2 size={16}/></button>
                        </div>
                      ))}
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-[3/4] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:text-gold hover:border-gold transition-all"
                      >
                        {isUploading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                        <span className="text-[8px] tracking-widest uppercase mt-2">Add shot</span>
                      </button>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleProductImageUpload} />
                  </div>

                  <button onClick={handleSaveProduct} className="w-full py-6 bg-graphite text-white text-[11px] tracking-[0.4em] font-bold hover:bg-gold transition-all uppercase mt-12">
                    Archive Piece to Collection
                  </button>
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
