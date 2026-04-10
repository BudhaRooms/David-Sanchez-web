/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import RoomCard from '@/components/RoomCard';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function ZonePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Traemos TODAS las habitaciones de la BD
  const { data: allRooms } = await supabase.from('accommodations').select('*').order('created_at', { ascending: false });
  
  let zoneName = "Zona Exclusiva";
  let coverImage = "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=1000";
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roomsInZone: any[] = [];

  if (allRooms) {
      for (const room of allRooms) {
          if (!room.zone) continue;
          const zoneSlug = room.zone.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
          if (zoneSlug === slug) {
              zoneName = room.zone;
              if (roomsInZone.length === 0 && room.media_gallery && room.media_gallery.length > 0) {
                 coverImage = room.media_gallery[0];
              }
              roomsInZone.push(room);
          }
      }
  }

  return (
    <main className="min-h-screen bg-background text-on-background font-body">
      <nav className="fixed top-0 w-full z-100 bg-surface/80 backdrop-blur-xl border-b border-surface-container">
          <div className="flex justify-between items-center px-12 py-6 w-full max-w-[1920px] mx-auto">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                  <img src="/logo_stitch.png" alt="Budha Rooms" className="h-5 md:h-6 object-contain" />
              </Link>
              <Link href="/" className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined" data-icon="arrow_back">arrow_back</span>
                Volver
              </Link>
          </div>
      </nav>

      {/* Hero Section for Zone */}
      <section className="relative pt-[150px] pb-24 flex items-center justify-center overflow-hidden bg-surface-container-lowest">
          <div className="absolute inset-0 z-0">
              <img 
                alt={zoneName} 
                className="w-full h-full object-cover opacity-20 grayscale" 
                src={coverImage}
              />
              <div className="absolute inset-0 bg-linear-to-b from-background via-background/40 to-background"></div>
          </div>
          <div className="relative z-10 text-center px-6">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Zona Exclusiva</span>
              <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl tracking-tight text-on-background mb-6 drop-shadow-xl">
                  {zoneName}
              </h1>
          </div>
      </section>

      {/* Rooms under this zone */}
      <section className="py-24 px-12 bg-surface-container-low min-h-[50vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
              {roomsInZone.length > 0 ? (
                roomsInZone.map((room) => (
                    <RoomCard key={room.id} room={room} />
                ))
              ) : (
                <div className="col-span-3 text-center opacity-50 py-20 font-serif tracking-widest text-white">
                  No hay habitaciones cargadas en esta zona todavía.
                </div>
              )}
          </div>
      </section>
    </main>
  );
}
