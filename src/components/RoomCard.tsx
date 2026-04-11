/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

interface RoomCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  room: any;
  href?: string;
}

export default function RoomCard({ room, href }: RoomCardProps) {
  // Use the first media item as the cover
  const gallery = room.media_gallery || [];
  const coverUrl = gallery.length > 0 ? gallery[0] : "/placeholder.jpg";
  const isVideo = coverUrl.includes('.mp4') || coverUrl.includes('video');
  const url = href || `/habitaciones/${room.slug}`;
  
  // Try to grab parent zone if it came nested in Supabase (room.parent.zone)
  const zoneName = room.parent?.zone || "Exclusiva";

  const price = room.climate_desc || "Consultar"; // previously mapped climate_desc to price in our form
  const amenities = room.amenities || [];

  return (
    <div className="flex flex-col bg-surface-container-high rounded-lg overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-700">
      <Link href={url} className="relative aspect-video overflow-hidden block">
        {isVideo ? (
          <video 
            src={coverUrl} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
            autoPlay 
            muted 
            loop 
            playsInline
          />
        ) : (
          <img 
            alt={room.name} 
            src={coverUrl} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" 
          />
        )}
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-primary font-bold z-10 border border-outline-variant/30">
          {zoneName}
        </div>
      </Link>
      
      <div className="p-8 flex flex-col flex-1">
        <Link href={url}>
          <h3 className="font-headline text-2xl text-on-background mb-4 hover:text-primary transition-colors">{room.name}</h3>
        </Link>
        <p className="text-on-surface-variant text-sm leading-relaxed mb-6 flex-1 line-clamp-2">
          {room.extras_desc || "Una hermosa habitación equipada con los mejores lujos de la zona para su máximo descanso."}
        </p>
        
        <div className="flex gap-4 mb-8">
          {amenities.slice(0, 4).map((amenity: string, idx: number) => {
            // Map common amenities to icons
            let iconStr = "check_circle";
            if(amenity === 'wifi') iconStr = "wifi";
            if(amenity === 'bano_privado') iconStr = "bathtub";
            if(amenity === 'tv_size') iconStr = "tv";
            if(amenity === 'nevera') iconStr = "kitchen";
            if(amenity === 'netflix') iconStr = "movie";
            if(amenity === 'youtube') iconStr = "smart_display";
            if(amenity === 'espejo') iconStr = "checkroom";
            if(amenity === 'luces') iconStr = "lightbulb";

            return <span key={idx} className="material-symbols-outlined text-outline text-lg" data-icon={iconStr}>{iconStr}</span>
          })}
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-on-surface-variant uppercase tracking-widest">Desde</span>
            <div className="text-xl font-headline text-primary">{price}</div>
          </div>
          <a 
            className="flex items-center gap-2 text-xs font-bold text-on-background hover:text-primary transition-colors uppercase tracking-widest" 
            href="https://wa.me/34698947098" 
            target="_blank" 
            rel="noreferrer"
          >
            <span className="material-symbols-outlined text-xl" data-icon="chat">chat</span>
            Book via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
