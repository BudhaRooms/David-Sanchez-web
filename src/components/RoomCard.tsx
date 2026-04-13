/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { getAmenity } from '@/utils/amenitiesData';

interface RoomCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  room: any;
  href?: string;
}

export default function RoomCard({ room, href }: RoomCardProps) {
  // Use the first media item as the cover
  const gallery = room.media_gallery || [];
  const coverUrl = gallery.length > 0 ? gallery[0] : "/placeholder.jpg";
  const urlLower = coverUrl.toLowerCase();
  const isVideo = urlLower.includes('.mp4') || urlLower.includes('.mov') || urlLower.includes('.webm') || urlLower.includes('video');
  const url = href || `/habitaciones/${room.slug}`;
  
  // Try to grab parent zone if it came nested in Supabase (room.parent.zone)
  const zoneName = room.parent?.zone || "Exclusiva";

  const amenities = room.amenities || [];

  return (
    <div className="flex flex-col bg-surface-container-high rounded-lg overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-700 border border-outline-variant/10">
      <Link href={url} className="relative aspect-4/5 sm:aspect-3/4 overflow-hidden block bg-surface-container-highest">
        {isVideo ? (
           <video 
           src={coverUrl} 
           className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
           autoPlay 
           muted 
           loop 
           playsInline
         />
        ) : (
          <img 
            alt={room.name} 
            src={coverUrl} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        )}
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-primary font-bold z-10 border border-outline-variant/30 shadow-sm">
          {zoneName}
        </div>
      </Link>
      
      <div className="p-8 flex flex-col flex-1">
        <Link href={url}>
          <h3 className="font-gothic text-3xl sm:text-4xl text-on-background mb-1 hover:text-primary transition-colors">{room.name}</h3>
        </Link>
        {room.climate_desc && (
          <span className="text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-3 block">
            {room.climate_desc}
          </span>
        )}
        <p className="text-on-surface-variant text-xs leading-relaxed mb-6 flex-1 line-clamp-3">
          {room.extras_desc || "Una hermosa habitación equipada con los mejores lujos de la zona para su máximo descanso."}
        </p>
        
        <div className="flex gap-4 mb-8 flex-wrap">
          {amenities.slice(0, 5).map((amenityId: string, idx: number) => {
            const amenityInfo = getAmenity(amenityId);
            const Icon = amenityInfo.icon || CheckCircle2;

            return (
              <div key={idx} className="flex flex-col items-center gap-1 group/icon" title={amenityInfo.label}>
                <Icon className="w-5 h-5 text-outline opacity-70 group-hover/icon:opacity-100 transition-opacity" />
              </div>
            )
          })}
        </div>
        
        <div className="mt-auto pt-4 text-center">
          <a 
            className="flex items-center justify-center gap-2 text-xs font-bold text-background bg-primary hover:bg-primary/90 transition-colors uppercase tracking-widest px-6 py-3.5 rounded-xl w-full hover:scale-[1.02] active:scale-[0.98]" 
            href="https://wa.me/34698947098" 
            target="_blank" 
            rel="noreferrer"
          >
            Comprobar Disponibilidad
          </a>
        </div>
      </div>
    </div>
  );
}
