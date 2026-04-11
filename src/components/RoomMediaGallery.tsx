"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
/* eslint-disable @next/next/no-img-element */

interface RoomMediaGalleryProps {
  mediaList: string[];
  roomName: string;
}

export default function RoomMediaGallery({ mediaList, roomName }: RoomMediaGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (mediaList.length === 0) {
    return (
      <div className="w-full bg-surface-container-highest aspect-video flex items-center justify-center text-on-surface-variant font-serif opacity-50 border border-dashed border-outline-variant/20">
        Sin archivos multimedia
      </div>
    );
  }

  const handleOpen = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const nextMedia = (e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  };

  const prevMedia = (e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const checkIsVideo = (url: string) => {
    const urlLower = url.toLowerCase();
    return urlLower.includes('.mp4') || urlLower.includes('.mov') || urlLower.includes('.webm') || urlLower.includes('video');
  };

  return (
    <>
      {/* Grilla visual de imágenes en la página */}
      <div className="flex flex-col gap-8">
        {mediaList.map((item, idx) => {
          const isVideo = checkIsVideo(item);
          return (
            <div 
              key={idx} 
              onClick={() => handleOpen(idx)}
              className="group relative w-full bg-surface-container-highest rounded-none md:rounded-lg overflow-hidden border border-outline-variant/10 shadow-[0_40px_60px_rgba(0,0,0,0.4)] cursor-pointer"
            >
              {isVideo ? (
                <div className="relative w-full aspect-4/5 sm:aspect-video pointer-events-none">
                  <video 
                    src={item} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    muted 
                    loop 
                    playsInline
                  />
                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                     <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                     </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full aspect-4/5 md:aspect-video overflow-hidden">
                  <img 
                    alt={`${roomName} foto ${idx + 1}`} 
                    src={item} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox / Galería Pantalla Completa */}
      {isOpen && (
        <div className="fixed inset-0 z-999 bg-black/95 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
          
          {/* Botón Cerrar */}
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Flecha Anterior (solo si hay más de 1 media) */}
          {mediaList.length > 1 && (
            <button 
              onClick={prevMedia}
              className="absolute left-4 sm:left-12 z-50 p-3 sm:p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* Flecha Siguiente (solo si hay más de 1 media) */}
          {mediaList.length > 1 && (
            <button 
              onClick={nextMedia}
              className="absolute right-4 sm:right-12 z-50 p-3 sm:p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors active:scale-95"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* Contenedor del contenido */}
          <div 
            className="relative w-full max-w-6xl h-[80vh] flex items-center justify-center p-4 select-none"
            onClick={() => setIsOpen(false)} // Cerrar al cliquear fondo
          >
            <div onClick={(e) => e.stopPropagation()} className="w-full h-full flex items-center justify-center relative">
               {checkIsVideo(mediaList[currentIndex]) ? (
                 <video 
                   src={mediaList[currentIndex]} 
                   className="w-full h-full object-contain shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300"
                   autoPlay
                   controls
                   playsInline
                 />
               ) : (
                 <img 
                   src={mediaList[currentIndex]} 
                   alt={`Gallery ${currentIndex}`}
                   className="w-full h-full object-contain shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300"
                 />
               )}
            </div>
          </div>

          {/* Indicador de posición */}
          {mediaList.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest font-mono">
              {currentIndex + 1} / {mediaList.length}
            </div>
          )}

        </div>
      )}
    </>
  );
}
