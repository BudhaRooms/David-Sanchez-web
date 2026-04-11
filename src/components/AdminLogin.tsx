"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function AdminLogin() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      setIsSuccess(false);
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Send them back to this URL
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) throw error;
      
      setIsSuccess(true);
      setMessage("✅ ¡Revisa tu correo! Te hemos enviado un enlace de acceso seguro. Puedes cerrar esta ventana.");
    } catch (error) {
      console.error("Auth error:", error);
      setMessage("Ocurrió un error al enviar el correo. Verifica tu dirección o intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans text-gray-900 selection:bg-gray-200">
      <div className="w-full max-w-[420px] bg-white border border-gray-200/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] p-8 sm:p-10 rounded-3xl flex flex-col items-center text-center">
        
        <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm transform -rotate-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Panel Dashboard</h2>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          Para mayor comodidad y seguridad, ingresa tu correo y te enviaremos un <b>enlace mágico</b>. Quedarás iniciado en este dispositivo.
        </p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="text-left">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
              Tu Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budharoomsalicante@gmail.com"
              required
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all font-medium"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || isSuccess}
            className="w-full bg-gray-900 hover:bg-black text-white font-semibold p-4 rounded-xl mt-2 transition-all disabled:opacity-50 disabled:scale-100 hover:scale-[1.02] shadow-xl shadow-gray-900/10 active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? "Enviando enlace..." : "Enviar Enlace Seguro"}
          </button>

          {message && (
            <div className={`mt-4 p-4 rounded-xl text-sm font-medium border flex gap-3 text-left leading-relaxed ${isSuccess ? 'bg-green-50 text-green-800 border-green-100' : 'bg-red-50 text-red-800 border-red-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
