"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { X, Images, XCircle, Home, MapPin, Building2, CheckCircle2 } from "lucide-react";
/* eslint-disable @next/next/no-img-element */

interface RoomFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ALL_AMENITIES = [
  { id: "ascensor", label: "Ascensor", icon: "elevator" },
  { id: "cocina", label: "Cocina", icon: "kitchen" },
  { id: "lavadora", label: "Lavadora", icon: "local_laundry_service" },
  { id: "agua_caliente", label: "Agua Caliente", icon: "water_drop" },
  { id: "microondas", label: "Microondas", icon: "microwave" },
  { id: "utensilios", label: "Utensilios", icon: "skillet" },
  { id: "limpieza", label: "Prod. Limpieza", icon: "cleaning_services" },
  { id: "wifi", label: "Wifi Rápido", icon: "wifi" },
  { id: "bano_privado", label: "Baño Privado", icon: "bathtub" },
  { id: "tv_size", label: "Smart TV", icon: "tv" },
  { id: "nevera", label: "Mini Nevera", icon: "kitchen" },
  { id: "netflix", label: "Netflix", icon: "movie" },
  { id: "youtube", label: "YouTube", icon: "smart_display" },
  { id: "espejo", label: "Espejo", icon: "checkroom" },
  { id: "luces", label: "Luces Regulables", icon: "lightbulb" }
];

export function RoomFormModal({ onClose, onSuccess }: RoomFormModalProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    zone: "",
    description: "",
  });

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      
      setMediaFiles(prev => [...prev, ...filesArray]);
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (id: string) => {
    const newAnenities = new Set(selectedAmenities);
    if (newAnenities.has(id)) {
      newAnenities.delete(id);
    } else {
      newAnenities.add(id);
    }
    setSelectedAmenities(newAnenities);
  };



  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const media_gallery: string[] = [];

      for (const file of mediaFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("rooms-images").upload(fileName, file);
        if (uploadError) throw new Error("Error subiendo archivos multimedia: " + uploadError.message);
        
        const { data: { publicUrl } } = supabase.storage.from("rooms-images").getPublicUrl(fileName);
        media_gallery.push(publicUrl);
      }

      const slug = generateSlug(formData.name);

      const payload = {
        name: formData.name,
        type: "room",
        zone: formData.zone,
        parent_id: null,
        size: null,
        extras_desc: formData.description,
        climate_desc: null,
        slug,
        media_gallery,
        amenities: Array.from(selectedAmenities),
      };

      const { error: insertError } = await supabase.from("accommodations").insert([payload]);
      if (insertError) throw new Error("Error guardando datos en la BD: " + insertError.message);

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const currentAmenitiesList = ALL_AMENITIES;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/60 backdrop-blur-sm sm:p-6 overflow-hidden font-sans">
      <div className="relative w-full max-w-3xl bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col h-[90vh] sm:h-auto sm:max-h-[85vh] animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-4 duration-300">
        
        {/* Header Fijo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white rounded-t-3xl shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Nueva Propiedad</h2>
            <p className="text-xs text-gray-500 mt-1">Completa los detalles y sube el contenido.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors active:scale-95 bg-gray-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
          {error && <div className="p-4 mb-6 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">{error}</div>}

          <form id="roomForm" onSubmit={handleSubmit} className="flex flex-col gap-8 pb-10">
            
            {/* Detalles Básicos */}
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Home className="w-4 h-4 text-gray-400" /> Nombre de la Habitación
                </label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 p-3.5 rounded-xl flex-1 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all" placeholder="Ej. Zen Suite Mágica" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-primary" /> Ubicación / Zona
                </label>
                <select required value={formData.zone} onChange={(e) => setFormData({...formData, zone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:border-blue-500 focus:bg-white outline-none text-sm transition-all appearance-none">
                  <option value="" disabled>Selecciona la nueva ubicación...</option>
                  <option value="Corte Inglés">Corte Inglés</option>
                  <option value="Mercado Central">Mercado Central</option>
                  <option value="Auditorio">Auditorio</option>
                  <option value="Plaza de Toros">Plaza de Toros</option>
                  <option value="Puente Rojo">Puente Rojo</option>
                </select>
              </div>
            </div>

            {/* Checklists Dinámicos (Amenities) */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Servicios Disponibles
              </label>
              <p className="text-xs text-gray-500 mb-4">Toca para marcar o desmarcar lo que ofrece.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentAmenitiesList.map((amenity) => {
                  const isSelected = selectedAmenities.has(amenity.id);
                  return (
                    <div 
                      key={amenity.id} 
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`relative flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all active:scale-95 ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                      <span className={`text-xs font-semibold ${isSelected ? 'text-primary-container' : 'text-gray-600'}`}>
                        {amenity.label}
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300'}`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Descripción Larga */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Breve Descripción</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white border border-gray-200 p-3.5 rounded-xl outline-none focus:border-blue-500 min-h-[100px] resize-none" placeholder="Cuenta un poco sobre la esencia del lugar..." />
            </div>

            {/* Multimedia */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <label className="block text-sm font-bold text-gray-900 mb-3">Contenido (Fotos y Vídeo)</label>
              <div onClick={() => fileInputRef.current?.click()} className="relative flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed border-gray-300 rounded-2xl hover:border-black hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100">
                <div className="flex flex-col items-center p-6 text-center pointer-events-none">
                  <Images className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="text-sm font-semibold text-gray-900">Toca para galería</p>
                  <p className="text-xs text-gray-500 mt-1">Soporta JPG, PNG y Videos MP4.</p>
                </div>
              </div>
              <input type="file" multiple ref={fileInputRef} onChange={handleMediaChange} accept="image/*,video/mp4" className="hidden" />

              {previews.length > 0 && (
                <div className="flex overflow-x-auto gap-3 mt-4 pb-2 snap-x">
                  {previews.map((preview, index) => {
                    const fileType = mediaFiles[index]?.type || "";
                    const isVideo = fileType.includes('video');
                    return (
                        <div key={index} className="relative w-24 h-24 shrink-0 bg-gray-100 rounded-xl overflow-hidden shadow-sm snap-center group">
                          {isVideo ? (
                             <video src={preview} className="w-full h-full object-cover" muted />
                          ) : (
                             <img src={preview} alt="preview" className="w-full h-full object-cover" />
                          )}
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeMedia(index); }} className="absolute -top-1 -right-1 bg-white text-gray-800 p-1.5 rounded-full shadow-md scale-75 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all hover:text-red-600">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                    )
                  })}
                </div>
              )}
            </div>

          </form>
        </div>

        {/* Footer actions Fijo */}
        <div className="px-6 py-5 bg-white border-t border-gray-100 shrink-0 rounded-b-3xl sm:rounded-b-3xl">
          <button type="submit" form="roomForm" disabled={loading} className="w-full flex items-center justify-center bg-gray-900 text-white text-sm font-bold py-4 rounded-xl disabled:opacity-50 hover:bg-black transition-all shadow-lg active:scale-[0.98]">
            {loading ? (
              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Procesando...</span>
            ) : "Publicar Habitación"}
          </button>
        </div>

      </div>
    </div>
  );
}
