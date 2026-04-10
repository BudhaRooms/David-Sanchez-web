"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function AdminLogin() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });

      if (error) throw error;
      setMessage("¡Correo enviado! Revisa tu bandeja de entrada para entrar de forma segura.");
    } catch (error) {
      const err = error as { error_description?: string; message: string };
      setMessage(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans text-gray-900 selection:bg-gray-200">
      <div className="w-full max-w-[420px] bg-white border border-gray-200/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] p-8 sm:p-10 rounded-3xl flex flex-col items-center text-center">
        
        <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm transform -rotate-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-fingerprint"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M9 6.8a6 6 0 0 1 9 5.2v2"/></svg>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Panel Dashboard</h2>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          Ingresa de forma segura con tu correo. <br/>Te enviaremos un "Magic Link".
        </p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="text-left">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
              Tu Correo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@proyecto.com"
              required
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all font-medium"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-black text-white font-semibold p-4 rounded-xl mt-2 transition-all disabled:opacity-50 disabled:scale-100 hover:scale-[1.02] shadow-xl shadow-gray-900/10 active:scale-95"
          >
            {loading ? "Verificando..." : "Continuar Seguro"}
          </button>

          {message && (
            <div className="mt-4 p-4 rounded-xl bg-green-50 text-green-800 text-sm font-medium border border-green-100 flex gap-3 text-left leading-relaxed">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-check shrink-0 mt-0.5"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="m16 19 2 2 4-4"/></svg>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
