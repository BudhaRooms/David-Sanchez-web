import { useState } from "react";
import { X, Upload, Save, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function PoiFormModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', description: '', mapLink: '', price: '' });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let thumbUrl = '';
    if (file) {
      const filename = `poi-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('media').upload(filename, file);
      if (!uploadError) {
        thumbUrl = supabase.storage.from('media').getPublicUrl(filename).data.publicUrl;
      }
    }

    const { error } = await supabase.from('guide_pois').insert([{
      name: formData.name,
      category: formData.category,
      description: formData.description,
      mapLink: formData.mapLink,
      price: formData.price,
      thumb: thumbUrl,
    }]);

    setLoading(false);
    if (error) alert("Error: " + error.message);
    else onSuccess();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Añadir Punto de Interés</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="poi-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Sitio</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full border-gray-300 rounded-lg shadow-sm border p-2 text-sm focus:ring-gray-900 focus:border-gray-900 outline-none" placeholder="Ej. El Portal Taberna" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
              <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm border p-2 text-sm focus:ring-gray-900 focus:border-gray-900 outline-none">
                <option value="">Selecciona Categoría...</option>
                <option value="Restaurantes">Restaurantes</option>
                <option value="Playas">Playas</option>
                <option value="Ocio Nocturno">Ocio Nocturno</option>
                <option value="Monumentos">Monumentos</option>
                <option value="Zonas Populares">Zonas Populares</option>
                <option value="Otra">Otra...</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Descripción Breve</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} className="w-full border-gray-300 rounded-lg shadow-sm border p-2 text-sm focus:ring-gray-900 focus:border-gray-900 outline-none" placeholder="Alta Gama - Taberna y Vinos" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Rango Precio</label>
                <input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} type="text" className="w-full border-gray-300 rounded-lg shadow-sm border p-2 text-sm focus:ring-gray-900 outline-none" placeholder="Ej. €€ - €€€" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Link Google Maps</label>
                <input value={formData.mapLink} onChange={e => setFormData({...formData, mapLink: e.target.value})} type="url" className="w-full border-gray-300 rounded-lg shadow-sm border p-2 text-sm focus:ring-gray-900 outline-none" placeholder="https://maps.google.com/..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Foto Principal (Obligatoria)</label>
              <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-xl appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                <span className="flex items-center space-x-2">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="font-medium text-gray-500">{file ? file.name : "Haga clic para seleccionar archivo"}</span>
                </span>
                <input type="file" name="file_upload" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            Cancelar
          </button>
          <button type="submit" form="poi-form" disabled={loading} className="px-5 py-2 font-semibold text-white bg-gray-900 rounded-lg hover:bg-black transition-all shadow-sm flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar POI
          </button>
        </div>
      </div>
    </div>
  );
}
