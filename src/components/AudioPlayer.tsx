"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function AudioPlayer({ url, enabled }: { url?: string; enabled?: boolean }) {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && enabled && url) {
      // Auto-play is restricted by browsers unless muted, so we start muted.
      audioRef.current.play().catch(e => console.log('Audio autoplay blocked', e));
    }
  }, [enabled, url]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!enabled || !url) return null;

  return (
    <>
      <audio ref={audioRef} src={url} loop muted={isMuted} />
      <button
      onClick={toggleMute}
      className={`fixed bottom-6 right-6 w-12 h-12 rounded-full focus:outline-none transition-all duration-300 flex items-center justify-center z-100 shadow-lg ${
        isMuted
          ? 'bg-gray-800/80 text-gray-400 border border-gray-700/50 hover:bg-gray-700/80'
          : 'bg-[#d2b86b]/90 text-gray-900 border border-[#d2b86b]/40 hover:bg-[#d2b86b]'
      }`}
      style={{ backdropFilter: 'blur(8px)' }}
    >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </>
  );
}
