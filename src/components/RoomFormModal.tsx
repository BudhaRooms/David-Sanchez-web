"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { X, Images, XCircle, Home, MapPin, CheckCircle2, AlignLeft, Hash } from "lucide-react";
import { ROOM_AMENITIES, GENERAL_AMENITIES } from "@/utils/amenitiesData";
/* eslint-disable @next/next/no-img-element */

interface RoomFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export function RoomFormModal({ onClose, onSuccess, initialData }: RoomFormModalProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    zone: initialData?.zone || "",
    description: initialData?.extras_desc || "",
    shortDescription: initialData?.climate_desc || "",
    order: initialData?.size || "0",
  });

  const [existingMedia, setExistingMedia] = useState<string[]>(initialData?.media_gallery || []);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  // Maintain order of selection
  const [selectedRoomAmenities, setSelectedRoomAmenities] = useState<string[]>(
    initialData?.amenities?.filter((a: string) => ROOM_AMENITIES.some(ra => ra.id === a)) || []
  );
  const [selectedGeneralAmenities, setSelectedGeneralAmenities] = useState<string[]>(
    initialData?.amenities?.filter((a: string) => GENERAL_AMENITIES.some(ga => ga.id === a)) || []
  );

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      
      setMediaFiles(prev => [...prev, ...filesArray]);
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeExistingMedia = (index: number) => {
    setExistingMedia(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRoomAmenity = (id: string) => {
    setSelectedRoomAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleGeneralAmenity = (id: string) => {
    setSelectedGeneralAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const newMediaUrls: string[] = [];

      for (const file of mediaFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("rooms-images").upload(fileName, file);
        if (uploadError) throw new Error("Error subiendo archivos multimedia: " + uploadError.message);
        
        const { data: { publicUrl } } = supabase.storage.from("rooms-images").getPublicUrl(fileName);
        newMediaUrls.push(publicUrl);
      }

      const slug = isEdit ? initialData.slug : generateSlug(formData.name);
      
      // Combine room + general amenities maintaining their respective ordered arrays combined
      const finalAmenities = [...selectedRoomAmenities, ...selectedGeneralAmenities];

      const payload = {
        name: formData.name,
        type: "room",
        zone: formData.zone,
        parent_id: null,
        size: formData.order.toString(),
        extras_desc: formData.description,
        climate_desc: formData.shortDescription,
        slug,
        media_gallery: [...existingMedia, ...newMediaUrls],
        amenities: finalAmenities,
      };

      if (isEdit) {
        const { error: updateError } = await supabase.from("accommodations").update(payload).eq('id', initialData.id);
        if (updateError) throw new Error("Error actualizando: " + updateError.message);
      } else {
        const { error: insertError } = await supabase.from("accommodations").insert([payload]);
        if (insertError) throw new Error("Error guardando datos: " + insertError.message);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/60 backdrop-blur-sm sm:p-6 overflow-hidden font-sans">
      <div className="relative w-full max-w-3xl bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col h-[90vh] sm:h-auto sm:max-h-[85vh] animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-4 duration-300">
        
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white rounded-t-3xl shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEdit ? "Editar Propiedad" : "Nueva Propiedad"}</h2>
            <p className="text-xs text-gray-500 mt-1">{isEdit ? "Edita los detalles y guarda los cambios." : "Completa los detalles y sube el contenido."}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors active:scale-95 bg-gray-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
          {error && <div className="p-4 mb-6 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">{error}</div>}

          <form id="roomForm" onSubmit={handleSubmit} className="flex flex-col gap-8 pb-10">
            
            <div className="space-y-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Home className="w-4 h-4 text-gray-400" /> Nombre de la Habitación
                </label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl flex-1 outline-none focus:border-blue-500 transition-all" placeholder="Ej. Zen Suite Mágica" />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <AlignLeft className="w-4 h-4 text-gray-400" /> Pequeña Descripción (Bajo el título)
                </label>
                <input type="text" value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl flex-1 outline-none focus:border-blue-500 transition-all" placeholder="Ej. Una habitación mágica y exótica..." />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-primary" /> Ubicación / Zona
                  </label>
                  <select required value={formData.zone} onChange={(e) => setFormData({...formData, zone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:border-blue-500 outline-none text-sm transition-all appearance-none">
                    <option value="" disabled>Selecciona la ubicación...</option>
                    <option value="Corte Inglés">Corte Inglés</option>
                    <option value="Mercado Central">Mercado Central</option>
                    <option value="Auditorio">Auditorio</option>
                    <option value="Plaza de Toros">Plaza de Toros</option>
                    <option value="Puente Rojo">Puente Rojo</option>
                  </select>
                </div>

                <div className="w-32">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Hash className="w-4 h-4 text-gray-400" /> Orden
                  </label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl text-center outline-none focus:border-blue-500 transition-all" />
                </div>
              </div>
            </div>

            {/* Room Amenities */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Servicios Incluidos en la Habitación</label>
              <p className="text-xs text-gray-500 mb-4">Toca para marcar el servicio. Se mostrarán en este orden.</p>
              <div className="flex flex-wrap gap-2">
                {ROOM_AMENITIES.map((amenity) => {
                  const isSelected = selectedRoomAmenities.includes(amenity.id);
                  const index = selectedRoomAmenities.indexOf(amenity.id);
                  return (
                    <div 
                      key={amenity.id} 
                      onClick={() => toggleRoomAmenity(amenity.id)}
                      className={`relative flex items-center gap-2 px-3 py-2 border rounded-full cursor-pointer select-none transition-all active:scale-95 ${isSelected ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                      <span className={`text-xs font-semibold ${isSelected ? 'text-primary-container' : 'text-gray-600'}`}>{amenity.label}</span>
                      {isSelected && <span className="bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full leading-none">{index + 1}</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* General Amenities */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Servicios Generales Incluidos</label>
              <div className="flex flex-wrap gap-2 mt-4">
                {GENERAL_AMENITIES.map((amenity) => {
                  const isSelected = selectedGeneralAmenities.includes(amenity.id);
                  const index = selectedGeneralAmenities.indexOf(amenity.id);
                  return (
                    <div 
                      key={amenity.id} 
                      onClick={() => toggleGeneralAmenity(amenity.id)}
                      className={`relative flex items-center gap-2 px-3 py-2 border rounded-full cursor-pointer select-none transition-all active:scale-95 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                      <span className={`text-xs font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>{amenity.label}</span>
                      {isSelected && <span className="bg-blue-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full leading-none">{index + 1}</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Descripción Completa</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white border border-gray-200 p-3.5 rounded-xl outline-none focus:border-blue-500 min-h-[100px] resize-none" placeholder="Cuenta un poco sobre la esencia del lugar..." />
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <label className="block text-sm font-bold text-gray-900 mb-3">Contenido (Fotos y Vídeo)</label>
              <div onClick={() => fileInputRef.current?.click()} className="relative flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed border-gray-300 rounded-2xl hover:border-black hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100">
                <div className="flex flex-col items-center p-6 text-center pointer-events-none">
                  <Images className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="text-sm font-semibold text-gray-900">Añadir nueva galería</p>
                  <p className="text-xs text-gray-500 mt-1">Soporta JPG, PNG y Videos MP4.</p>
                </div>
              </div>
              <input type="file" multiple ref={fileInputRef} onChange={handleMediaChange} accept="image/*,video/mp4" className="hidden" />

              {(existingMedia.length > 0 || previews.length > 0) && (
                <div className="flex overflow-x-auto gap-3 mt-4 pb-2 snap-x">
                  {existingMedia.map((url, index) => {
                    const isVideo = url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('video');
                    return (
                        <div key={`exist-${index}`} className="relative w-24 h-24 shrink-0 bg-gray-100 rounded-xl overflow-hidden shadow-sm snap-center group">
                          {isVideo ? (
                             <video src={url} className="w-full h-full object-cover" muted />
                          ) : (
                             <img src={url} alt="exist" className="w-full h-full object-cover" />
                          )}
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeExistingMedia(index); }} className="absolute -top-1 -right-1 bg-white text-gray-800 p-1.5 rounded-full shadow-md scale-75 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all hover:text-red-600">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                    )
                  })}
                  {previews.map((preview, index) => {
                    const fileType = mediaFiles[index]?.type || "";
                    const isVideo = fileType.includes('video');
                    return (
                        <div key={`new-${index}`} className="relative w-24 h-24 shrink-0 bg-gray-100 border-[3px] border-primary/50 rounded-xl overflow-hidden shadow-md snap-center group">
                          {isVideo ? (
                             <video src={preview} className="w-full h-full object-cover" muted />
                          ) : (
                             <img src={preview} alt="preview" className="w-full h-full object-cover" />
                          )}
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeNewMedia(index); }} className="absolute -top-1 -right-1 bg-white text-gray-800 p-1.5 rounded-full shadow-md scale-75 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all hover:text-red-600">
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

        <div className="px-6 py-5 bg-white border-t border-gray-100 shrink-0 rounded-b-3xl sm:rounded-b-3xl">
          <button type="submit" form="roomForm" disabled={loading} className="w-full flex items-center justify-center bg-gray-900 text-white text-sm font-bold py-4 rounded-xl disabled:opacity-50 hover:bg-black transition-all shadow-lg active:scale-[0.98]">
            {loading ? (
              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Procesando...</span>
            ) : (isEdit ? "Guardar Cambios" : "Publicar Habitación")}
          </button>
        </div>

      </div>
    </div>
  );
}
