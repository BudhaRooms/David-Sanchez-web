"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

const PREF_KEY = "budha_music_unmuted";

export function AudioPlayer({ url, enabled }: { url?: string; enabled?: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!enabled || !url) return;

    const audio = audioRef.current;
    if (!audio) return;

    const prefUnmuted = localStorage.getItem(PREF_KEY) === "1";

    // canplay fires when enough data is loaded to play
    const onCanPlay = () => {
      setIsReady(true);
      audio.play()
        .then(() => {
          if (prefUnmuted) {
            // Returning visitor who previously unmuted: start with sound
            audio.muted = false;
            setIsMuted(false);
          } else {
            // First visitor: start muted, show banner invitation
            setShowBanner(true);
          }
        })
        .catch(() => {
          // Some browsers block even muted autoplay — show banner anyway
          setShowBanner(true);
        });
    };

    audio.addEventListener("canplay", onCanPlay, { once: true });

    // Fallback if canplay doesn't fire
    const fallback = setTimeout(() => {
      audio.play()
        .then(() => {
          setIsReady(true);
          if (localStorage.getItem(PREF_KEY) === "1") {
            audio.muted = false;
            setIsMuted(false);
          } else {
            setShowBanner(true);
          }
        })
        .catch(() => setShowBanner(true));
    }, 1500);

    return () => {
      audio.removeEventListener("canplay", onCanPlay);
      clearTimeout(fallback);
    };
  }, [enabled, url]);

  // When user clicks the banner → unmute + remember preference
  const handleBannerClick = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const doUnmute = () => {
      audio.muted = false;
      setIsMuted(false);
      setShowBanner(false);
      localStorage.setItem(PREF_KEY, "1");
    };

    if (audio.paused) {
      audio.play().then(doUnmute).catch(() => {});
    } else {
      doUnmute();
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !isMuted;
    audio.muted = next;
    setIsMuted(next);
    localStorage.setItem(PREF_KEY, next ? "0" : "1");
  };

  if (!enabled || !url) return null;

  return (
    <>
      {/* autoPlay + muted: browsers ALWAYS allow this combination */}
      <audio ref={audioRef} src={url} loop autoPlay muted />

      {/* ── "Tap to listen" banner ── */}
      {showBanner && (
        <button
          id="audio-tap-banner"
          onClick={handleBannerClick}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-9999 flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-[#d2b86b]/50 bg-black/90 shadow-2xl shadow-[#d2b86b]/10 transition-all hover:border-[#d2b86b] hover:shadow-[#d2b86b]/20 animate-in slide-in-from-bottom-4 duration-700"
          style={{ backdropFilter: "blur(20px)" }}
          aria-label="Toca para escuchar la música"
        >
          {/* Animated icon */}
          <div className="relative w-10 h-10 shrink-0">
            <div className="absolute inset-0 rounded-full bg-[#d2b86b]/20 animate-ping" />
            <div className="relative w-10 h-10 rounded-full bg-[#d2b86b]/15 border border-[#d2b86b]/40 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-[#d2b86b]" />
            </div>
          </div>
          {/* Text */}
          <div className="text-left flex-1 min-w-0">
            <p className="text-white text-[11px] font-black uppercase tracking-[0.2em] leading-tight">
              Música Ambiente
            </p>
            <p className="text-[#d2b86b]/80 text-[10px] tracking-widest mt-0.5">
              Toca para escuchar ♪
            </p>
          </div>
          {/* Arrow */}
          <span className="text-[#d2b86b]/60 text-xl font-light shrink-0">›</span>
        </button>
      )}

      {/* ── Compact mute toggle (shown after user has interacted) ── */}
      {isReady && !showBanner && (
        <button
          id="audio-mute-toggle"
          onClick={toggleMute}
          title={isMuted ? "Activar música" : "Silenciar música"}
          className={`fixed bottom-6 right-6 w-12 h-12 rounded-full focus:outline-none transition-all duration-300 flex items-center justify-center z-9999 shadow-lg ${
            isMuted
              ? "bg-gray-800/80 text-gray-400 border border-gray-700/50 hover:bg-gray-700/80"
              : "bg-[#d2b86b]/90 text-gray-900 border border-[#d2b86b]/40 hover:bg-[#d2b86b]"
          }`}
          style={{ backdropFilter: "blur(8px)" }}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}
    </>
  );
}
