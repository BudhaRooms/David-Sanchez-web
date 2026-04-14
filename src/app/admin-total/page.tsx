"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { AdminLogin } from "@/components/AdminLogin";
import { LogOut, Plus, Trash2, LayoutGrid, Eye, Images, MapPin } from "lucide-react";
import { RoomFormModal } from "@/components/RoomFormModal";
import { PoiFormModal } from "@/components/PoiFormModal";

export default function AdminPage() {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'rooms' | 'texts' | 'music' | 'guide' | 'emergencies'>('rooms');

  // Rooms state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingRoom, setEditingRoom] = useState<any>(null);

  // Music state
  const [musicUrl, setMusicUrl] = useState('');
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [appMusicEnabled, setAppMusicEnabled] = useState(true);
  const [uploadingMusic, setUploadingMusic] = useState(false);

  // Texts state
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroText1, setHeroText1] = useState('');
  const [heroText2, setHeroText2] = useState('');
  const [savingTexts, setSavingTexts] = useState(false);

  // Emergencies State
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [loadingEms, setLoadingEms] = useState(false);
  const [newEmergency, setNewEmergency] = useState({ name: '', phone: '', icon: 'phone', note: '' });
  // Guide POIs state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pois, setPois] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingPois, setLoadingPois] = useState(false);
  const [showPoiModal, setShowPoiModal] = useState(false);
  
  const zones = ['Recomendaciones Globales', 'Mercado Central', 'Corte Inglés', 'Plaza de Toros', 'Puente Rojo', 'Auditorio'];
  const [activeZone, setActiveZone] = useState<string>(zones[0]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) {
        fetchAccommodations();
        fetchGlobalSettings();
        fetchPois();
        fetchEmergencies();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchAccommodations();
        fetchGlobalSettings();
        fetchPois();
        fetchEmergencies();
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAccommodations() {
    setLoadingData(true);
    const { data, error } = await supabase
      .from("accommodations")
      .select("*");

    if (!error && data) {
      const sorted = data.sort((a, b) => {
        const orderA = a.size ? parseInt(a.size, 10) : Number.MAX_SAFE_INTEGER;
        const orderB = b.size ? parseInt(b.size, 10) : Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setAccommodations(sorted);
    }
    setLoadingData(false);
  };

  async function fetchGlobalSettings() {
    const { data } = await supabase.from('global_settings').select('*').limit(1).maybeSingle();
    if (data) {
      setSettingsId(data.id);
      setMusicUrl(data.music_url || '');
      setMusicEnabled(data.music_enabled ?? true);
      setAppMusicEnabled(data.app_music_enabled ?? true);
      setHeroTitle(data.hero_title || '');
      setHeroText1(data.hero_text_1 || '');
      setHeroText2(data.hero_text_2 || '');
    }
  }

  async function fetchPois() {
    setLoadingPois(true);
    const { data: cats } = await supabase.from('guide_categories').select('*').order('created_at', { ascending: true });
    if (cats) setCategories(cats);

    const { data: ps } = await supabase.from('guide_pois').select('*').order('created_at', { ascending: false });
    if (ps) setPois(ps);
    setLoadingPois(false);
  }

  async function fetchEmergencies() {
    setLoadingEms(true);
    const { data } = await supabase.from('emergency_numbers').select('*').order('created_at', { ascending: true });
    if (data) setEmergencies(data);
    setLoadingEms(false);
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la propiedad: ${name}?`)) {
      const { error } = await supabase.from("accommodations").delete().eq("id", id);
      if (!error) {
        setAccommodations(accommodations.filter(a => a.id !== id));
      } else {
        alert("Error al eliminar: " + error.message);
      }
    }
  };

  const handleSaveTexts = async () => {
    if (!settingsId) return alert("Error: no settings row found");
    setSavingTexts(true);
    const { error } = await supabase.from('global_settings')
      .update({ hero_title: heroTitle, hero_text_1: heroText1, hero_text_2: heroText2 }).eq('id', settingsId);
    setSavingTexts(false);
    if (error) alert("Error guardando textos: " + error.message);
    else alert("Textos guardados correctamente.");
  };

  const handleUploadMusic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMusic(true);
    const filename = `music/${Date.now()}.mp3`;
    
    const { error } = await supabase.storage.from('media').upload(filename, file);
    if (error) {
      alert("Error subiendo música: " + error.message);
      setUploadingMusic(false);
      return;
    }
    if (!settingsId) return;
    const publicUrl = supabase.storage.from('media').getPublicUrl(filename).data.publicUrl;
    const { error: dbError } = await supabase.from('global_settings').update({ music_url: publicUrl }).eq('id', settingsId);
    if (dbError) {
      alert("Error actualizando url: " + dbError.message);
    } else {
      setMusicUrl(publicUrl);
    }
    setUploadingMusic(false);
  };

  const handleToggleMusic = async () => {
    if (!settingsId) return;
    const newVal = !musicEnabled;
    const { error } = await supabase.from('global_settings').update({ music_enabled: newVal }).eq('id', settingsId);
    if (!error) setMusicEnabled(newVal);
  };

  const handleToggleAppMusic = async () => {
    if (!settingsId) return;
    const newVal = !appMusicEnabled;
    const { error } = await supabase.from('global_settings').update({ app_music_enabled: newVal }).eq('id', settingsId);
    if (!error) setAppMusicEnabled(newVal);
  };

  const handleDeletePoi = async (id: string) => {
    if (window.confirm("¿Seguro que deseas eliminar este punto de interés?")) {
      const { error } = await supabase.from('guide_pois').delete().eq('id', id);
      if (!error) setPois(pois.filter(p => p.id !== id));
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const { error } = await supabase.from('guide_categories').insert({ zone: activeZone, name: newCategoryName.trim() });
    if (!error) {
      setNewCategoryName('');
      fetchPois();
    } else {
      alert("Error al crear la categoría: " + error.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("¿Seguro que deseas eliminar esta categoría y TODOS sus lugares?")) {
      const { error } = await supabase.from('guide_categories').delete().eq('id', id);
      if (!error) {
        fetchPois();
      }
    }
  };

  const handleAddEmergency = async () => {
    if (!newEmergency.name || !newEmergency.phone) return;
    if ((newEmergency as any).id) {
      const { id, ...updateData } = newEmergency as any;
      const { error } = await supabase.from('emergency_numbers').update(updateData).eq('id', id);
      if (!error) {
         setNewEmergency({ name: '', phone: '', icon: 'call', note: '' });
         fetchEmergencies();
      }
    } else {
      const { ...insertData } = newEmergency;
      const { error } = await supabase.from('emergency_numbers').insert([insertData]);
      if (!error) {
         setNewEmergency({ name: '', phone: '', icon: 'call', note: '' });
         fetchEmergencies();
      }
    }
  };

  const handleDeleteEmergency = async (id: string) => {
    if (window.confirm("¿Eliminar este número de emergencia?")) {
      const { error } = await supabase.from('emergency_numbers').delete().eq('id', id);
      if (!error) fetchEmergencies();
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin"></div></div>;
  }

  if (!session) {
    return <AdminLogin />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* SaaS HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-gray-900 leading-none">Dashboard Unificado</h1>
              <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider mt-0.5">{session.user.email}</p>
            </div>
          </div>
          
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24">
        
        {/* TABS */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-8 gap-6 text-sm font-semibold text-gray-500">
          <button onClick={() => setActiveTab('rooms')} className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'rooms' ? 'border-gray-900 text-gray-900' : 'border-transparent hover:text-gray-700'}`}>Habitaciones</button>
          <button onClick={() => setActiveTab('texts')} className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'texts' ? 'border-gray-900 text-gray-900' : 'border-transparent hover:text-gray-700'}`}>Textos Web</button>
          <button onClick={() => setActiveTab('music')} className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'music' ? 'border-gray-900 text-gray-900' : 'border-transparent hover:text-gray-700'}`}>Música Web</button>
          <button onClick={() => setActiveTab('guide')} className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'guide' ? 'border-gray-900 text-gray-900' : 'border-transparent hover:text-gray-700'}`}>Guía Huéspedes</button>
          <button onClick={() => setActiveTab('emergencies')} className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'emergencies' ? 'border-gray-900 text-gray-900' : 'border-transparent hover:text-gray-700'}`}>Teléfonos Emergencia</button>
        </div>

        {activeTab === 'rooms' && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Tus Propiedades</h2>
                <p className="text-gray-500 mt-1">Gestiona el contenido, precios y fotos multimedia de tus catálogos.</p>
              </div>
              <button 
                onClick={() => { setEditingRoom(null); setShowModal(true); }}
                className="flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-black hover:shadow-md hover:-translate-y-0.5 transition-all w-full sm:w-auto"
              >
                <Plus className="w-5 h-5" /> Nueva Propiedad
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingData ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 h-72 animate-pulse">
                    <div className="w-full h-40 bg-gray-100 rounded-xl mb-4"></div>
                    <div className="w-3/4 h-5 bg-gray-100 rounded mb-2"></div>
                    <div className="w-1/2 h-4 bg-gray-100 rounded"></div>
                  </div>
                ))
              ) : accommodations.length === 0 ? (
                <div className="col-span-full py-20 bg-white border border-dashed border-gray-300 rounded-3xl flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
                    <Images className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Sin Alojamientos Aún</h3>
                  <p className="text-gray-500 max-w-sm mb-6">Tu catálogo web está vacío. Agrega tu primer cuarto o apartamento para verlo en vivo.</p>
                  <button onClick={() => { setEditingRoom(null); setShowModal(true); }} className="bg-white border border-gray-200 text-gray-900 font-semibold px-6 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                    Crear Propiedad
                  </button>
                </div>
              ) : (
                accommodations.map((acc) => {
                  const gallery = acc.media_gallery || [];
                  const hasOldImage = acc.main_image_url && gallery.length === 0;
                  const photoCount = hasOldImage ? 1 : gallery.length;
                  const coverImg = gallery.length > 0 ? gallery[0] : acc.main_image_url;

                  return (
                    <div key={acc.id} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-lg transition-shadow overflow-hidden group flex flex-col">
                      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                        {coverImg ? (
                          (typeof coverImg === 'string' && (coverImg.toLowerCase().includes('.mp4') || coverImg.toLowerCase().includes('.mov') || coverImg.toLowerCase().includes('.webm'))) ? (
                             <video src={coverImg} autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={coverImg} alt={acc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          )
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-300"><Images className="w-10 h-10" /></div>
                        )}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-900 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          {acc.zone || 'Sin Zona'}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                          <Images className="w-3.5 h-3.5" />
                          {photoCount}
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{acc.name}</h3>
                        {acc.climate_desc && <span className="text-xs text-primary font-bold mb-1 block uppercase tracking-wide">{acc.climate_desc}</span>}
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{acc.extras_desc || 'Sin descripción'}</p>
                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                          <a href={`/habitaciones/${acc.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                            <Eye className="w-4 h-4" /> Ver Preview
                          </a>
                          <div className="flex gap-1.5 focus:outline-none">
                            <button onClick={() => { setEditingRoom(acc); setShowModal(true); }} className="px-3 py-1.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1.5">Editar</button>
                            <button onClick={() => handleDelete(acc.id, acc.name)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {activeTab === 'texts' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6">Textos Dinámicos de la Web</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Título Principal (H1)</label>
                <input className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Frase Hero Home (1) (Las Mejores...)</label>
                <textarea className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none" rows={2} value={heroText1} onChange={e => setHeroText1(e.target.value)}></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Párrafo de Experiencia (En Budha Rooms...)</label>
                <textarea className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none" rows={4} value={heroText2} onChange={e => setHeroText2(e.target.value)}></textarea>
              </div>
              <button disabled={savingTexts} onClick={handleSaveTexts} className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-black transition-colors">
                {savingTexts ? "Guardando..." : "Guardar Textos"}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'music' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6">Audio de Fondo de la Web</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-900">Música en Web</h4>
                  <p className="text-sm text-gray-500">¿Sonará en el inicio de budharooms.com?</p>
                </div>
                <button onClick={handleToggleMusic} className={`w-14 h-8 shrink-0 rounded-full transition-colors flex items-center p-1 ${musicEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`w-6 h-6 bg-white rounded-full transition-transform ${musicEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-900">Música en la App</h4>
                  <p className="text-sm text-gray-500">¿Sonará en la app de la guía del huésped?</p>
                </div>
                <button onClick={handleToggleAppMusic} className={`w-14 h-8 shrink-0 rounded-full transition-colors flex items-center p-1 ${appMusicEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`w-6 h-6 bg-white rounded-full transition-transform ${appMusicEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>

            <div className="space-y-4">
               <div>
                  <h4 className="font-bold text-gray-700 text-sm mb-2">Archivo MP3 Actual</h4>
                  {musicUrl ? (
                    <audio controls src={musicUrl} className="w-full max-w-md"></audio>
                  ) : <p className="text-gray-400 text-sm">No hay música configurada.</p>}
               </div>
               
               <div className="pt-4 border-t border-gray-100">
                 <h4 className="font-bold text-gray-700 text-sm mb-2">Subir nueva canción</h4>
                 <input type="file" accept="audio/mpeg, audio/mp3" onChange={handleUploadMusic} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"/>
                 {uploadingMusic && <p className="text-sm text-blue-600 mt-2">Subiendo...</p>}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="mb-6">
             <div className="flex justify-between items-end mb-6">
               <div>
                <h2 className="text-xl font-bold">Guía de Huéspedes App</h2>
                <p className="text-sm text-gray-500">Agrega categorías dinámicas y comerciales por cada Zona.</p>
               </div>
             </div>
             
             {/* Selector de Zona & Globales */}
             <div className="mb-6 border-b border-gray-200 pb-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Recomendaciones Globales</h3>
               <div className="flex flex-wrap gap-2 mb-4">
                 <button 
                   onClick={() => setActiveZone('Recomendaciones Globales')}
                   className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeZone === 'Recomendaciones Globales' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                 >
                   Recomendaciones Globales
                 </button>
               </div>
               
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-4">Información por Zona (Locales)</h3>
               <div className="flex flex-wrap gap-2">
                 {zones.filter(z => z !== 'Recomendaciones Globales').map(z => (
                   <button 
                     key={z} 
                     onClick={() => setActiveZone(z)}
                     className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeZone === z ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                   >
                     {z}
                   </button>
                 ))}
               </div>
             </div>

             {/* Gestión de Categorías para la Zona Activa */}
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6 flex flex-wrap gap-4 justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Categorías en {activeZone}</h3>
                  <p className="text-xs text-gray-500">
                    {activeZone === 'Recomendaciones Globales' 
                      ? 'Ej: Restaurantes/Bares, Turismo, Playas/Ocio...'
                      : 'Ej: Parkings, Farmacias, Supermercados...'}
                  </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                   <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nueva categoría..." className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 outline-none focus:border-gray-900"/>
                   <button onClick={handleAddCategory} className="bg-gray-900 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-black whitespace-nowrap">Crear Categoría</button>
                </div>
             </div>

             {loadingPois ? <p className="text-gray-500 p-4">Cargando datos principales...</p> : categories.filter(c => activeZone === 'Recomendaciones Globales' ? (!c.zone || c.zone === 'Recomendaciones Globales' || !zones.includes(c.zone)) : c.zone === activeZone).length === 0 ? <p className="text-gray-500 p-4 text-center border-2 border-dashed border-gray-200 rounded-xl">No hay categorías en esta zona. ¡Crea la primera arriba!</p> : (
               <div className="space-y-8">
                 {categories.filter(c => activeZone === 'Recomendaciones Globales' ? (!c.zone || c.zone === 'Recomendaciones Globales' || !zones.includes(c.zone)) : c.zone === activeZone).map(cat => {
                   const catPois = pois.filter(p => p.category_id === cat.id);
                   return (
                     <div key={cat.id} className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
                       <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                          <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide">{cat.name}</h3>
                          <div className="flex gap-3">
                             <button onClick={() => {
                               setSelectedCategoryId(cat.id);
                               setShowPoiModal(true);
                             }} className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-100 flex items-center gap-1">
                               <Plus className="w-4 h-4"/> Añadir Lugar
                             </button>
                             <button onClick={() => handleDeleteCategory(cat.id)} className="text-sm text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                               <Trash2 className="w-4 h-4"/> 
                             </button>
                          </div>
                       </div>

                       {catPois.length === 0 ? (
                         <p className="text-sm text-gray-400 italic py-2">No hay lugares en esta categoría todavía.</p>
                       ) : (
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                           {catPois.map(p => (
                             <div key={p.id} className="border border-gray-100 rounded-xl p-4 flex flex-col items-start shadow-sm bg-gray-50 hover:bg-white hover:border-gray-300 transition-colors">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                {p.thumb && <img src={p.thumb} alt={p.name} className="w-full h-32 object-cover rounded-lg mb-3" />}
                                <h4 className="font-bold mt-2 text-gray-900 leading-tight">{p.name}</h4>
                                {p.price && <span className="mt-1 text-[10px] font-bold text-white bg-green-600 px-2 py-0.5 rounded-full">{p.price}</span>}
                                <p className="text-xs text-gray-500 mt-2 line-clamp-2 flex-1">{p.description}</p>
                                
                                <div className="mt-4 pt-3 border-t border-gray-200 w-full flex justify-between">
                                   <a href={p.mapLink} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline"><MapPin className="w-3 h-3"/> Mapa</a>
                                   <div className="flex gap-2">
                                      <button onClick={() => {
                                        (window as any).editPoiData = p;
                                        setSelectedCategoryId(cat.id);
                                        setShowPoiModal(true);
                                      }} className="text-xs text-gray-500 font-semibold hover:underline">Editar</button>
                                      <button onClick={() => handleDeletePoi(p.id)} className="text-xs text-red-500 font-semibold hover:underline">Eliminar</button>
                                    </div>
                                </div>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   );
                 })}
               </div>
             )}
          </div>
        )}

        {activeTab === 'emergencies' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6">Teléfonos de Emergencia</h2>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
              <input type="text" value={newEmergency.name} onChange={e => setNewEmergency({...newEmergency, name: e.target.value})} placeholder="Nombre (ej. Ambulancia)" className="border border-gray-300 rounded px-3 py-2 text-sm outline-none flex-1"/>
              <input type="text" value={newEmergency.phone} onChange={e => setNewEmergency({...newEmergency, phone: e.target.value})} placeholder="Teléfono" className="border border-gray-300 rounded px-3 py-2 text-sm outline-none flex-1"/>
              <input type="text" value={newEmergency.icon} onChange={e => setNewEmergency({...newEmergency, icon: e.target.value})} placeholder="Icono (ej. local_police)" className="border border-gray-300 rounded px-3 py-2 text-sm outline-none w-32"/>
              <button 
                onClick={() => { setNewEmergency({ name: '', phone: '', icon: 'call', note: '' }); }} 
                className="text-gray-500 px-3 py-2 text-sm hover:underline"
              >
                Limpiar
              </button>
              <button 
                onClick={handleAddEmergency} 
                className="bg-red-600 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-red-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4"/> {(newEmergency as any).id ? 'Guardar' : 'Añadir'}
              </button>
            </div>

            {loadingEms ? <p className="text-gray-500">Cargando...</p> : (
              <div className="space-y-3">
                {emergencies.map(em => (
                  <div key={em.id} className="flex justify-between items-center bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined">{em.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{em.name}</h4>
                        <p className="font-mono text-sm text-gray-500">{em.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => setNewEmergency(em)} className="text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-semibold">Editar</button>
                       <button onClick={() => handleDeleteEmergency(em.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 className="w-5 h-5"/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {showModal && (
        <RoomFormModal 
          initialData={editingRoom}
          onClose={() => setShowModal(false)} 
          onSuccess={() => {
            setShowModal(false);
            setEditingRoom(null);
            fetchAccommodations();
          }} 
        />
      )}

      {showPoiModal && selectedCategoryId && (
        <PoiFormModal 
          categoryId={selectedCategoryId}
          zone={activeZone}
          onClose={() => {
            setShowPoiModal(false);
            setSelectedCategoryId(null);
          }} 
          onSuccess={() => {
            setShowPoiModal(false);
            setSelectedCategoryId(null);
            fetchPois();
          }} 
        />
      )}
    </div>
  );
}
