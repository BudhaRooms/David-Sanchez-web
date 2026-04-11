"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Mail, KeyRound, AlertCircle } from "lucide-react";

export function AdminLogin() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
      });

      if (error) throw error;
      
      setStep("code");
      setMessage("");
    } catch (error) {
      console.error("Auth error:", error);
      setMessage("Ocurrió un error al enviar el correo. Verifica tu dirección o intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });

      if (error) throw error;
      // Una vez validado, onAuthStateChange en el componente padre actualizará y mostrará el dashboard
    } catch (error) {
      console.error("Verify error:", error);
      setMessage("El código o el formato es incorrecto, o ha expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans text-gray-900 selection:bg-gray-200">
      <div className="w-full max-w-[420px] bg-white border border-gray-200/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] p-8 sm:p-10 rounded-3xl flex flex-col items-center text-center">
        
        <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm transform -rotate-3">
          {step === "email" ? <Mail className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
          {step === "email" ? "Acceso Seguro" : "Código de Verificación"}
        </h2>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          {step === "email" 
            ? "Para mayor seguridad, accede mediante un código rápido sin usar contraseñas."
            : "Revisa tu bandeja de entrada o spam. Ingresa el código numérico de 6 dígitos que te enviamos."}
        </p>

        {step === "email" ? (
          <form onSubmit={handleSendEmail} className="w-full flex flex-col gap-4">
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
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white font-semibold p-4 rounded-xl mt-2 transition-all disabled:opacity-50 disabled:scale-100 hover:scale-[1.02] shadow-xl shadow-gray-900/10 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? "Enviando código..." : "Enviar Código"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="w-full flex flex-col gap-4">
            <div className="text-left">
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                Código de 6 dígitos
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="000000"
                required
                maxLength={6}
                className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all font-medium text-center text-lg tracking-[0.2em]"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white font-semibold p-4 rounded-xl mt-2 transition-all disabled:opacity-50 disabled:scale-100 hover:scale-[1.02] shadow-xl shadow-gray-900/10 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? "Verificando..." : "Entrar al Panel"}
            </button>
            
            <button
              type="button"
              onClick={() => setStep("email")}
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 mt-2 transition-colors"
            >
              ← Usar otro correo
            </button>
          </form>
        )}

        {message && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-800 text-sm font-medium border border-red-100 flex gap-3 text-left leading-relaxed w-full">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
