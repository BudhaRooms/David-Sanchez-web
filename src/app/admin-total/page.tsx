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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingPoi, setEditingPoi] = useState<any>(null);

  const GLOBAL_CATEGORIES = ['Restaurantes', 'Playas', 'Centros Comerciales', 'Ocio Nocturno', 'Zonas Concurridas', 'Monumentos', 'Culturales'];
  const ZONE_NAMES = ['Mercado Central', 'Corte Inglés', 'Plaza de Toros', 'Puente Rojo', 'Auditorio'];
  const GLOBAL_ZONE = 'Recomendaciones Globales';
  const CAT_ICONS: Record<string, string> = { 'Restaurantes': '🍽️', 'Playas': '🏖️', 'Centros Comerciales': '🛍️', 'Ocio Nocturno': '🎶', 'Zonas Concurridas': '🚶', 'Monumentos': '🏛️', 'Culturales': '🎭' };

  const [activeGuideSection, setActiveGuideSection] = useState<'global' | 'zone'>('global');
  const [activeGlobalCatName, setActiveGlobalCatName] = useState<string>(GLOBAL_CATEGORIES[0]);
  const [activeZone, setActiveZone] = useState<string>('Mercado Central');
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
    } else if (error) {
      console.error("Error fetching accommodations:", error.message);
    }
    setLoadingData(false);
  }

  async function fetchGlobalSettings() {
    const { data, error } = await supabase.from('global_settings').select('*').limit(1).maybeSingle();
    if (error) {
      console.error("Error fetching settings:", error.message);
      return;
    }
    if (data) {
      setSettingsId(data.id);
      setMusicUrl(data.music_url || '');
      setMusicEnabled(data.music_enabled ?? true);
      setAppMusicEnabled(data.app_music_enabled ?? true);
      setHeroTitle(data.hero_title || '');
      // Columns are text_block_1 / text_block_2 in the DB
      setHeroText1(data.text_block_1 || data.hero_text_1 || '');
      setHeroText2(data.text_block_2 || data.hero_text_2 || '');
    }
  }

  async function fetchPois() {
    setLoadingPois(true);
    try {
      // 1. Fetch categories
      const { data: cats } = await supabase
        .from('guide_categories')
        .select('*')
        .order('created_at', { ascending: true });
      const allCats = cats || [];

      // 2. Decide which predefined categories are missing
      const GLOBAL_CATS_LOCAL = ['Restaurantes', 'Playas', 'Centros Comerciales', 'Ocio Nocturno', 'Zonas Concurridas', 'Monumentos', 'Culturales'];
      const ZONE_NAMES_LOCAL = ['Mercado Central', 'Corte Inglés', 'Plaza de Toros', 'Puente Rojo', 'Auditorio'];
      const GLOBAL_ZONE_LOCAL = 'Recomendaciones Globales';
      const toCreate: { id: string; name: string; zone: string }[] = [];

      for (const name of GLOBAL_CATS_LOCAL) {
        if (!allCats.find(c => c.name === name && c.zone === GLOBAL_ZONE_LOCAL))
          toCreate.push({ id: crypto.randomUUID(), name, zone: GLOBAL_ZONE_LOCAL });
      }
      for (const zone of ZONE_NAMES_LOCAL) {
        if (!allCats.find(c => c.zone === zone))
          toCreate.push({ id: crypto.randomUUID(), name: 'Lugares', zone });
      }

      // 3. If any missing, insert them (pre-check above guards against duplicates)
      if (toCreate.length > 0) {
        await supabase.from('guide_categories').insert(toCreate);
        const { data: freshCats } = await supabase
          .from('guide_categories')
          .select('*')
          .order('created_at', { ascending: true });
        setCategories(freshCats || []);
      } else {
        setCategories(allCats);
      }

      // 4. Fetch POIs
      const { data: ps } = await supabase
        .from('guide_pois')
        .select('*')
        .order('created_at', { ascending: false });
      setPois(ps || []);
    } finally {
      setLoadingPois(false);
    }
  }


  async function fetchEmergencies() {
    setLoadingEms(true);
    const { data, error } = await supabase
      .from('emergency_numbers')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) console.error("Error fetching emergencies:", error.message);
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
    setSavingTexts(true);
    const payload = { hero_title: heroTitle, text_block_1: heroText1, text_block_2: heroText2 };
    if (!settingsId) {
       const newId = crypto.randomUUID();
       const { data, error } = await supabase
         .from('global_settings')
         .insert({ id: newId, ...payload })
         .select().single();
       if (!error && data) setSettingsId(data.id);
       else if (error) { alert("Error guardando textos: " + error.message); setSavingTexts(false); return; }
    } else {
       const { error } = await supabase
         .from('global_settings')
         .update(payload)
         .eq('id', settingsId);
       if (error) { alert("Error guardando textos: " + error.message); setSavingTexts(false); return; }
    }
    setSavingTexts(false);
    alert("✅ Textos guardados correctamente.");
  };

  const handleUploadMusic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMusic(true);

    const filename = `track-${Date.now()}.mp3`;

    const { error: uploadError } = await supabase.storage.from('music').upload(filename, file, {
      upsert: true,
    });

    if (uploadError) {
      alert("❌ Error subiendo música: " + uploadError.message);
      setUploadingMusic(false);
      return;
    }

    const publicUrl = supabase.storage.from('music').getPublicUrl(filename).data.publicUrl;

    // Always try UPSERT: update if row exists, insert otherwise
    const upsertId = settingsId || crypto.randomUUID();
    const { data, error: dbError } = await supabase
      .from('global_settings')
      .upsert({ id: upsertId, music_url: publicUrl, music_enabled: musicEnabled, app_music_enabled: appMusicEnabled })
      .select()
      .single();

    if (dbError) {
      alert("❌ Error guardando URL de música: " + dbError.message);
    } else if (data) {
      setSettingsId(data.id);
      setMusicUrl(publicUrl);
      alert("🎵 Música subida y guardada correctamente.");
    }
    setUploadingMusic(false);
  };

  const handleToggleMusic = async () => {
    const newVal = !musicEnabled;
    if (!settingsId) {
       const newId = crypto.randomUUID();
       const { data, error } = await supabase.from('global_settings').insert({ id: newId, music_enabled: newVal }).select().single();
       if (!error && data) {
         setSettingsId(data.id);
         setMusicEnabled(newVal);
       }
       return;
    }
    const { error } = await supabase.from('global_settings').update({ music_enabled: newVal }).eq('id', settingsId);
    if (!error) setMusicEnabled(newVal);
    else alert("Error actualizando: " + error.message);
  };

  const handleToggleAppMusic = async () => {
    const newVal = !appMusicEnabled;
    setAppMusicEnabled(newVal);

    if (!settingsId) {
      const newId = crypto.randomUUID();
      const { data, error } = await supabase
        .from('global_settings')
        .insert({ id: newId, app_music_enabled: newVal })
        .select()
        .single();
      if (!error && data) setSettingsId(data.id);
      return;
    }
    const { error } = await supabase
      .from('global_settings')
      .update({ app_music_enabled: newVal })
      .eq('id', settingsId);
    if (error) {
      // Revert on failure
      setAppMusicEnabled(!newVal);
      alert("Error actualizando: " + error.message);
    }
  };

  const handleDeletePoi = async (id: string) => {
    if (window.confirm("¿Seguro que deseas eliminar este punto de interés?")) {
      const { error } = await supabase.from('guide_pois').delete().eq('id', id);
      if (!error) setPois(pois.filter(p => p.id !== id));
      else alert("Error: " + error.message);
    }
  };

  // Opens the POI modal — creates the DB category first if it doesn't exist yet
  const openPoiModal = async (catName: string, zone: string, existingPoi?: Record<string, string> | null) => {
    let catId = categories.find(c => c.name === catName && c.zone === zone)?.id ?? null;
    if (!catId) {
      const newId = crypto.randomUUID();
      const { error } = await supabase.from('guide_categories').insert({ id: newId, name: catName, zone });
      if (error) { alert('Error al inicializar categoría: ' + error.message); return; }
      catId = newId;
      setCategories(prev => [...prev, { id: newId, name: catName, zone }]);
    }
    setSelectedCategoryId(catId);
    setEditingPoi(existingPoi ?? null);
    setShowPoiModal(true);
  };

  const handleAddEmergency = async () => {
    if (!newEmergency.name || !newEmergency.phone) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((newEmergency as any).id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { id, ...updateData } = newEmergency as any;
      const { error } = await supabase.from('emergency_numbers').update(updateData).eq('id', id);
      if (!error) {
         setNewEmergency({ name: '', phone: '', icon: 'phone', note: '' });
         fetchEmergencies();
      } else {
        alert("Error: " + error.message);
      }
    } else {
      const { error } = await supabase.from('emergency_numbers').insert([{ ...newEmergency, id: crypto.randomUUID() }]);
      if (!error) {
         setNewEmergency({ name: '', phone: '', icon: 'phone', note: '' });
         fetchEmergencies();
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  const handleDeleteEmergency = async (id: string) => {
    if (window.confirm("¿Eliminar este número de emergencia?")) {
      const { error } = await supabase.from('emergency_numbers').delete().eq('id', id);
      if (!error) fetchEmergencies();
      else alert("Error: " + error.message);
    }
  };

  const isVideo = (url: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes('.mp4') || lower.includes('.mov') || lower.includes('.webm') || lower.includes('video');
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
          <button onClick={() => setActiveTab('rooms')} className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'rooms' ? 'border-gray-900 text-gray-900' : 'border-transparent hover:text-gray-700'}`}>🏠 Habitaciones</button>
          <button onClick={() => setActiveTab('texts')} className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'texts' ? 'border-gray-900 text-gray-900' : 'border-transparent hover:text-gray-700'}`}>📝 Textos Web</button>
          <button onClick={() => setActiveTab('music')} className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'music' ? 'border-gray-900 text-gray-900' : 'border-transparent hover:text-gray-700'}`}>🎵 Música</button>
          <button onClick={() => { setActiveTab('guide'); fetchPois(); }} className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'guide' ? 'border-gray-900 text-gray-900' : 'border-transparent hover:text-gray-700'}`}>🗺️ Guía Huéspedes</button>
          <button onClick={() => { setActiveTab('emergencies'); fetchEmergencies(); }} className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'emergencies' ? 'border-gray-900 text-gray-900' : 'border-transparent hover:text-gray-700'}`}>🚨 Emergencias</button>
        </div>

        {/* =================== ROOMS TAB =================== */}
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
                          isVideo(coverImg) ? (
                            <video
                              src={coverImg}
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="metadata"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
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
                          <div className="flex gap-1.5">
                            <button onClick={() => { setEditingRoom(acc); setShowModal(true); }} className="px-3 py-1.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1.5">✏️ Editar</button>
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

        {/* =================== TEXTS TAB =================== */}
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

        {/* =================== MUSIC TAB =================== */}
        {activeTab === 'music' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6">🎵 Audio de Fondo</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Web Music Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-900">Música en Web</h4>
                  <p className="text-sm text-gray-500">¿Sonará en el inicio de budharooms.com?</p>
                </div>
                <button onClick={handleToggleMusic} className={`w-14 h-8 shrink-0 rounded-full transition-colors flex items-center p-1 ${musicEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`w-6 h-6 bg-white rounded-full transition-transform ${musicEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* App Music Toggle */}
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
                ) : <p className="text-gray-400 text-sm">No hay música configurada aún.</p>}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-bold text-gray-700 text-sm mb-2">Subir nueva canción (MP3)</h4>
                <input
                  type="file"
                  accept="audio/mpeg,audio/mp3,.mp3"
                  onChange={handleUploadMusic}
                  disabled={uploadingMusic}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-black disabled:opacity-50"
                />
                {uploadingMusic && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    Subiendo archivo de música...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =================== GUIDE TAB =================== */}
        {activeTab === 'guide' && (
          <div className="mb-6 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Guía de Huéspedes App</h2>
              <p className="text-gray-500 mt-1">Gestiona los lugares publicados en la App. Los cambios se sincronizan en tiempo real.</p>
            </div>

            {/* ── SECTION 1: RECOMENDACIONES GLOBALES ── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg">🌍 Recomendaciones Globales</h3>
                <p className="text-xs text-gray-500 mt-0.5">Visibles para todos los huéspedes en la app. Selecciona una categoría para gestionarla.</p>
              </div>
              <div className="p-6">
                {/* 7 Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {GLOBAL_CATEGORIES.map(catName => {
                    const catPoisCount = pois.filter(p => {
                      const cat = categories.find(c => c.name === catName && c.zone === GLOBAL_ZONE);
                      return cat && p.category_id === cat.id;
                    }).length;
                    return (
                      <button
                        key={catName}
                        onClick={() => { setActiveGuideSection('global'); setActiveGlobalCatName(catName); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          activeGuideSection === 'global' && activeGlobalCatName === catName
                            ? 'bg-gray-900 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <span>{CAT_ICONS[catName]}</span>
                        {catName}
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeGuideSection === 'global' && activeGlobalCatName === catName ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-600'}`}>
                          {catPoisCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Global Category POIs */}
                {activeGuideSection === 'global' && (() => {
                  const cat = categories.find(c => c.name === activeGlobalCatName && c.zone === GLOBAL_ZONE);
                  const catPois = cat ? pois.filter(p => p.category_id === cat.id) : [];
                  return (
                    <div>
                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                        <div>
                          <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                            <span className="text-xl">{CAT_ICONS[activeGlobalCatName]}</span>
                            {activeGlobalCatName}
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5">{catPois.length} lugares publicados</p>
                        </div>
                        <button
                          onClick={() => openPoiModal(activeGlobalCatName, GLOBAL_ZONE)}
                          className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-black transition-colors"
                        >
                          <Plus className="w-4 h-4" /> Añadir Lugar
                        </button>
                      </div>
                      {loadingPois ? (
                        <p className="text-gray-400 text-sm py-4">Cargando...</p>
                      ) : catPois.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                          <p className="text-gray-400 text-sm">No hay lugares en {activeGlobalCatName} todavía.</p>
                          <button onClick={() => openPoiModal(activeGlobalCatName, GLOBAL_ZONE)} className="mt-3 text-sm underline text-gray-500 hover:text-gray-700">+ Añadir el primero</button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {catPois.map(p => (
                            <div key={p.id} className="border border-gray-100 rounded-xl p-4 flex flex-col bg-gray-50 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-32 object-cover rounded-lg mb-3" />}
                              <h4 className="font-bold text-gray-900 leading-tight">{p.name}</h4>
                              {p.price && <span className="mt-1 text-[10px] font-bold text-white bg-green-600 px-2 py-0.5 rounded-full w-fit">{p.price}</span>}
                              <p className="text-xs text-gray-500 mt-2 line-clamp-2 flex-1">{p.description}</p>
                              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                                {p.maps_link ? (
                                  <a href={p.maps_link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline">
                                    <MapPin className="w-3 h-3" />Mapa
                                  </a>
                                ) : <span />}
                                <div className="flex gap-1.5">
                                  <button onClick={() => openPoiModal(activeGlobalCatName, GLOBAL_ZONE, p)} className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-1 rounded-lg hover:bg-blue-100">✏️ Editar</button>
                                  <button onClick={() => handleDeletePoi(p.id)} className="text-xs text-red-500 font-semibold px-2 py-1 rounded-lg hover:bg-red-50">🗑️</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* ── SECTION 2: ZONES ── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg">📍 Información por Zona</h3>
                <p className="text-xs text-gray-500 mt-0.5">Lugares específicos por zona de Alicante. Selecciona una zona para gestionar sus lugares.</p>
              </div>
              <div className="p-6">
                {/* 5 Zone Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {ZONE_NAMES.map(zone => {
                    const zoneCats = categories.filter(c => c.zone === zone);
                    const zoneCount = pois.filter(p => zoneCats.some(c => c.id === p.category_id)).length;
                    return (
                      <button
                        key={zone}
                        onClick={() => { setActiveGuideSection('zone'); setActiveZone(zone); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          activeGuideSection === 'zone' && activeZone === zone
                            ? 'bg-gray-900 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        📍 {zone}
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeGuideSection === 'zone' && activeZone === zone ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-600'}`}>
                          {zoneCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Zone POIs */}
                {activeGuideSection === 'zone' && (() => {
                  const zoneCats = categories.filter(c => c.zone === activeZone);
                  const zonePois = pois.filter(p => zoneCats.some(c => c.id === p.category_id));
                  return (
                    <div>
                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                        <div>
                          <h4 className="font-bold text-gray-900 text-base">📍 {activeZone}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">{zonePois.length} lugares publicados</p>
                        </div>
                        <button
                          onClick={() => openPoiModal('Lugares', activeZone)}
                          className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-black transition-colors"
                        >
                          <Plus className="w-4 h-4" /> Añadir Lugar
                        </button>
                      </div>
                      {loadingPois ? (
                        <p className="text-gray-400 text-sm py-4">Cargando...</p>
                      ) : zonePois.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                          <p className="text-gray-400 text-sm">No hay lugares registrados en {activeZone} todavía.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {zonePois.map(p => {
                            return (
                              <div key={p.id} className="border border-gray-100 rounded-xl p-4 flex flex-col bg-gray-50 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-32 object-cover rounded-lg mb-3" />}
                                <h4 className="font-bold text-gray-900 leading-tight">{p.name}</h4>
                                {p.price && <span className="mt-1 text-[10px] font-bold text-white bg-green-600 px-2 py-0.5 rounded-full w-fit">{p.price}</span>}
                                <p className="text-xs text-gray-500 mt-2 line-clamp-2 flex-1">{p.description}</p>
                                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                                  {p.maps_link ? (
                                    <a href={p.maps_link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline">
                                      <MapPin className="w-3 h-3" />Mapa
                                    </a>
                                  ) : <span />}
                                  <div className="flex gap-1.5">
                                    <button onClick={() => openPoiModal('Lugares', activeZone, p)} className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-1 rounded-lg hover:bg-blue-100">✏️ Editar</button>
                                    <button onClick={() => handleDeletePoi(p.id)} className="text-xs text-red-500 font-semibold px-2 py-1 rounded-lg hover:bg-red-50">🗑️</button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* =================== EMERGENCIES TAB =================== */}
        {activeTab === 'emergencies' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6">🚨 Teléfonos de Emergencia</h2>

            {/* Form to add/edit */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(newEmergency as any).id && (
                <p className="text-xs text-blue-600 font-semibold mb-3 bg-blue-50 px-3 py-1.5 rounded-lg">
                  ✏️ Editando: {newEmergency.name} — Modifica los campos y pulsa Guardar
                </p>
              )}
              <div className="flex flex-wrap gap-4 items-center">
                <input
                  type="text"
                  value={newEmergency.name}
                  onChange={e => setNewEmergency({...newEmergency, name: e.target.value})}
                  placeholder="Nombre (ej. Ambulancia)"
                  className="border border-gray-300 rounded px-3 py-2 text-sm outline-none flex-1 min-w-[150px]"
                />
                <input
                  type="text"
                  value={newEmergency.phone}
                  onChange={e => setNewEmergency({...newEmergency, phone: e.target.value})}
                  placeholder="Teléfono"
                  className="border border-gray-300 rounded px-3 py-2 text-sm outline-none flex-1 min-w-[120px]"
                />
                <input
                  type="text"
                  value={newEmergency.icon}
                  onChange={e => setNewEmergency({...newEmergency, icon: e.target.value})}
                  placeholder="Icono Material (ej. local_police)"
                  className="border border-gray-300 rounded px-3 py-2 text-sm outline-none w-44"
                />
                <button
                  onClick={() => { setNewEmergency({ name: '', phone: '', icon: 'phone', note: '' }); }}
                  className="text-gray-500 px-3 py-2 text-sm hover:underline"
                >
                  Limpiar
                </button>
                <button
                  onClick={handleAddEmergency}
                  className="bg-red-600 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-red-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4"/>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(newEmergency as any).id ? 'Guardar Cambios' : 'Añadir'}
                </button>
              </div>
            </div>

            {/* Emergency list */}
            {loadingEms ? (
              <p className="text-gray-500">Cargando...</p>
            ) : emergencies.length === 0 ? (
              <p className="text-gray-500 text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                No hay teléfonos de emergencia configurados aún.
              </p>
            ) : (
              <div className="space-y-3">
                {emergencies.map(em => (
                  <div key={em.id} className="flex justify-between items-center bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">{em.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{em.name}</h4>
                        <p className="font-mono text-sm text-gray-500">{em.phone}</p>
                        {em.note && <p className="text-xs text-gray-400">{em.note}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNewEmergency(em)}
                        className="text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-semibold"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteEmergency(em.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5"/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ROOM MODAL */}
      {showModal && (
        <RoomFormModal
          initialData={editingRoom}
          onClose={() => { setShowModal(false); setEditingRoom(null); }}
          onSuccess={() => {
            setShowModal(false);
            setEditingRoom(null);
            fetchAccommodations();
          }}
        />
      )}

      {/* POI MODAL */}
      {showPoiModal && selectedCategoryId && (
        <PoiFormModal
          categoryId={selectedCategoryId}
          zone={activeZone}
          initialData={editingPoi}
          onClose={() => {
            setShowPoiModal(false);
            setSelectedCategoryId(null);
            setEditingPoi(null);
          }}
          onSuccess={() => {
            setShowPoiModal(false);
            setSelectedCategoryId(null);
            setEditingPoi(null);
            fetchPois();
          }}
        />
      )}
    </div>
  );
}
