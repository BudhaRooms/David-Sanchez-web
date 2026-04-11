"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Add a slight delay to avoid synchronous setState inside useEffect and make the entrance smoother
    const timer = setTimeout(() => {
      const consent = localStorage.getItem("cookieConsent");
      if (!consent) {
        setShow(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShow(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-100 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm"
        >
          <div className="bg-surface-container-low/95 backdrop-blur-xl border-t sm:border border-white/10 sm:rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="text-white font-headline text-lg">🍪 Aviso de Cookies</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed font-body font-light">
              Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar nuestro tráfico y personalizar el contenido. Si continúas navegando, consideramos que aceptas su uso.
            </p>
            <div className="flex flex-row justify-between items-center mt-2">
              <Link href="/cookies" className="text-xs text-primary underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity">
                Política de cookies
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={rejectCookies}
                  className="px-4 py-2 rounded border border-white/10 text-on-surface-variant text-xs uppercase tracking-widest hover:bg-white/5 transition-colors font-bold"
                >
                  Rechazar
                </button>
                <button
                  onClick={acceptCookies}
                  className="px-4 py-2 rounded bg-primary text-on-primary text-xs uppercase tracking-widest hover:bg-opacity-80 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] font-black"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
