"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

export function AdminLogin() {
  const supabase = createClient();
  const [email, setEmail] = useState("budharoomsalicante@gmail.com");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setError("Contraseña incorrecta. Verifica tus credenciales.");
      } else {
        setError(error.message);
      }
    }
    // On success, onAuthStateChange in parent will detect the session automatically
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans text-gray-900 selection:bg-gray-200">
      <div className="w-full max-w-[420px] bg-white border border-gray-200/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] p-8 sm:p-10 rounded-3xl flex flex-col items-center text-center">

        <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm transform -rotate-3">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Acceso Seguro</h2>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          Panel de administración de Budha Rooms Alicante.
        </p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="text-left">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budharoomsalicante@gmail.com"
              required
              autoComplete="email"
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all font-medium"
            />
          </div>

          <div className="text-left">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-4 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-gray-900 hover:bg-black text-white font-semibold p-4 rounded-xl mt-2 transition-all disabled:opacity-50 hover:scale-[1.02] shadow-xl shadow-gray-900/10 active:scale-95"
          >
            {loading ? "Verificando..." : "Entrar al Panel"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-800 text-sm font-medium border border-red-100 flex gap-3 text-left leading-relaxed w-full">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
