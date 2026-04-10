"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { AdminLogin } from "@/components/AdminLogin";
import { LogOut, Plus, Trash2, LayoutGrid, Eye, Images, MapPin } from "lucide-react";
import { RoomFormModal } from "@/components/RoomFormModal";

export default function AdminPage() {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) fetchAccommodations();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchAccommodations();
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAccommodations() {
    setLoadingData(true);
    const { data, error } = await supabase
      .from("accommodations")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAccommodations(data);
    }
    setLoadingData(false);
  };

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
              <h1 className="font-bold tracking-tight text-gray-900 leading-none">Dashboard</h1>
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
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Tus Propiedades</h2>
            <p className="text-gray-500 mt-1">Gestiona el contenido, precios y fotos multimedia de tus catálogos.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-black hover:shadow-md hover:-translate-y-0.5 transition-all w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" /> Nueva Propiedad
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingData ? (
            // Skeletons
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
              <button onClick={() => setShowModal(true)} className="bg-white border border-gray-200 text-gray-900 font-semibold px-6 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                Crear Propiedad
              </button>
            </div>
          ) : (
            accommodations.map((acc) => {
              // Calcular cuantas fotos tiene la galería
              // Asumimos que ahora guardamos un array en 'media_gallery' o seguimos simulando main_image_url
              const gallery = acc.media_gallery || [];
              const hasOldImage = acc.main_image_url && gallery.length === 0;
              const photoCount = hasOldImage ? 1 : gallery.length;
              
              // Cover
              const coverImg = gallery.length > 0 ? gallery[0] : acc.main_image_url;

              return (
                <div key={acc.id} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-lg transition-shadow overflow-hidden group flex flex-col">
                  {/* Imagen Cover (Thumb) */}
                  <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                    {coverImg ? (
                      <img src={coverImg} alt={acc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300"><Images className="w-10 h-10" /></div>
                    )}
                    
                    {/* Badge Zona */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-900 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary" />
                      {acc.zone || 'Sin Zona'}
                    </div>

                    {/* Quick Stat fotos */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <Images className="w-3.5 h-3.5" />
                      {photoCount}
                    </div>
                  </div>
                  
                  {/* Meta */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{acc.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{acc.extras_desc || 'Sin descripción'}</p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <a 
                        href={`/habitaciones/${acc.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" /> Ver Preview
                      </a>
                      
                      <button 
                        onClick={() => handleDelete(acc.id, acc.name)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar alojamiento"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {showModal && (
        <RoomFormModal 
          onClose={() => setShowModal(false)} 
          onSuccess={() => {
            setShowModal(false);
            fetchAccommodations();
          }} 
        />
      )}
    </div>
  );
}
