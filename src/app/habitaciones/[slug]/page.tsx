/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import RoomMediaGallery from '@/components/RoomMediaGallery';
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { getAmenity, ROOM_AMENITIES, GENERAL_AMENITIES } from '@/utils/amenitiesData';

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase
    .from('accommodations')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!data) {
    return <div className="text-white min-h-screen flex items-center justify-center">Room not found</div>;
  }
  
  const room = data;
  const parentZone = room.zone || "Exclusiva";

  // Extraer amenities o un array vacio
  const amenities = room.amenities || [];
  
  // Procesar todo el array de media recogiendo maximo 1 video y 5 imagenes
  const gallery = room.media_gallery || [];
  const videos = gallery.filter((m: string) => m.toLowerCase().includes('.mp4') || m.toLowerCase().includes('.mov') || m.toLowerCase().includes('video')).slice(0, 1);
  const photos = gallery.filter((m: string) => !(m.toLowerCase().includes('.mp4') || m.toLowerCase().includes('.mov') || m.toLowerCase().includes('video'))).slice(0, 5);
  const mediaToShow = [...videos, ...photos];

  // Separate Room and General amenities while maintaining order
  const roomAmenitiesList = amenities.filter((a: string) => ROOM_AMENITIES.some(ra => ra.id === a));
  const generalAmenitiesList = amenities.filter((a: string) => GENERAL_AMENITIES.some(ga => ga.id === a));

  return (
    <main className="min-h-screen bg-background text-on-background font-body">
      <nav className="fixed top-0 w-full z-100 bg-surface/80 backdrop-blur-xl border-b border-surface-container">
          <div className="flex justify-between items-center px-6 md:px-12 py-4 md:py-6 w-full max-w-[1920px] mx-auto">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                  <img src="/logo_stitch.png" alt="Budha Rooms" className="h-5 md:h-6 object-contain" />
              </Link>
              <Link href="/" className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs hover:opacity-80 transition-opacity">
                <ArrowLeft className="w-4 h-4" />
                Ver Catálogo
              </Link>
          </div>
      </nav>

      <section className="pt-[100px] md:pt-[120px] pb-24 md:pb-32 px-6 md:px-12 max-w-[1920px] mx-auto">
          <div className="grid grid-cols-12 gap-8 md:gap-12 lg:gap-24">
              
              {/* Media Column */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-8 order-2 lg:order-1">
                  <RoomMediaGallery mediaList={mediaToShow} roomName={room.name} />
              </div>

              {/* Info Column (Sticky) */}
              <div className="col-span-12 lg:col-span-4 order-1 lg:order-2">
                  <div className="sticky top-[140px] flex flex-col gap-8 md:gap-10">
                      <div>
                          <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs mb-4 block">{parentZone}</span>
                          <h1 className="font-gothic text-4xl sm:text-5xl md:text-6xl text-on-background mb-2 leading-tight tracking-normal">
                              {room.name}
                          </h1>
                          {room.climate_desc && (
                            <span className="text-primary font-bold text-sm tracking-widest uppercase mb-6 block">
                              {room.climate_desc}
                            </span>
                          )}
                          {room.extras_desc && room.extras_desc.trim() !== '' && (
                            <p className="text-on-surface-variant text-base leading-relaxed mb-8">
                                {room.extras_desc}
                            </p>
                          )}
                      </div>

                      {/* Dynamic Amenities */}
                      <div className="flex flex-col gap-6">
                        {roomAmenitiesList.length > 0 && (
                          <div className="bg-surface-container/50 p-6 md:p-8 rounded-lg border border-outline-variant/10">
                              <h3 className="font-headline text-lg md:text-xl text-on-background mb-6 capitalize">Servicios de la Habitación</h3>
                              <ul className="space-y-4">
                                  {roomAmenitiesList.map((amenity: string, idx: number) => {
                                      const amenityInfo = getAmenity(amenity);
                                      const Icon = amenityInfo.icon || CheckCircle2;

                                      return (
                                        <li key={idx} className="flex items-center gap-4 text-on-surface-variant group">
                                            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/10 group-hover:scale-110 transition-transform">
                                              <Icon className="w-4 h-4 text-primary opacity-90" />
                                            </div>
                                            <span className="text-sm tracking-wide">{amenityInfo.label}</span>
                                        </li>
                                      )
                                  })}
                              </ul>
                          </div>
                        )}

                        {generalAmenitiesList.length > 0 && (
                          <div className="bg-surface-container/50 p-6 md:p-8 rounded-lg border border-outline-variant/10">
                              <h3 className="font-headline text-lg md:text-xl text-on-background mb-6 capitalize">Servicios Generales Incluidos</h3>
                              <ul className="space-y-4">
                                  {generalAmenitiesList.map((amenity: string, idx: number) => {
                                      const amenityInfo = getAmenity(amenity);
                                      const Icon = amenityInfo.icon || CheckCircle2;

                                      return (
                                        <li key={idx} className="flex items-center gap-4 text-on-surface-variant group">
                                            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/10 group-hover:scale-110 transition-transform">
                                              <Icon className="w-4 h-4 text-blue-400 opacity-90" />
                                            </div>
                                            <span className="text-sm tracking-wide">{amenityInfo.label}</span>
                                        </li>
                                      )
                                  })}
                              </ul>
                          </div>
                        )}

                        {amenities.length === 0 && (
                            <div className="bg-surface-container/50 p-6 md:p-8 rounded-lg border border-outline-variant/10">
                              <p className="text-sm text-on-surface-variant opacity-60">Consultar comodidades incluidas</p>
                            </div>
                        )}
                      </div>

                      {/* Action */}
                      <a 
                        className="w-full py-5 bg-primary-container text-on-primary font-bold tracking-widest uppercase text-sm rounded-md transition-all hover:bg-primary hover:-translate-y-1 shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]"
                        href="https://wa.me/34698947098" 
                        target="_blank" 
                        rel="noreferrer"
                      >
                          <Lock className="w-5 h-5" />
                          Asegurar Reserva
                      </a>
                  </div>
              </div>
          </div>
      </section>
    </main>
  );
}
