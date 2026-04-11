/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

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
  const videos = gallery.filter((m: string) => m.includes('.mp4') || m.includes('video')).slice(0, 1);
  const photos = gallery.filter((m: string) => !m.includes('.mp4') && !m.includes('video')).slice(0, 5);
  const mediaToShow = [...videos, ...photos];

  return (
    <main className="min-h-screen bg-background text-on-background font-body">
      <nav className="fixed top-0 w-full z-100 bg-surface/80 backdrop-blur-xl border-b border-surface-container">
          <div className="flex justify-between items-center px-12 py-6 w-full max-w-[1920px] mx-auto">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                  <img src="/logo_stitch.png" alt="Budha Rooms" className="h-5 md:h-6 object-contain" />
              </Link>
              <Link href="/" className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined" data-icon="arrow_back">arrow_back</span>
                Ver Catálogo
              </Link>
          </div>
      </nav>

      <section className="pt-[120px] pb-32 px-6 md:px-12 max-w-[1920px] mx-auto">
          <div className="grid grid-cols-12 gap-12 lg:gap-24">
              
              {/* Media Column */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-8 order-2 lg:order-1">
                  {mediaToShow.length > 0 ? mediaToShow.map((item: string, idx: number) => {
                      const isVideo = item.includes('.mp4') || item.includes('video');
                      return (
                          <div key={idx} className="w-full bg-surface-container-highest rounded-none md:rounded-lg overflow-hidden border border-outline-variant/10 shadow-[0_40px_60px_rgba(0,0,0,0.4)]">
                              {isVideo ? (
                                <div className="relative w-full aspect-video">
                                  <video 
                                    src={item} 
                                    className="w-full h-full object-cover" 
                                    autoPlay 
                                    muted 
                                    loop 
                                    playsInline
                                    controls
                                  />
                                </div>
                              ) : (
                                <div className="relative w-full aspect-4/3 md:aspect-video">
                                  <img alt={`${room.name} ${idx}`} src={item} className="w-full h-full object-cover" />
                                </div>
                              )}
                          </div>
                      );
                  }) : (
                      <div className="w-full bg-surface-container-highest aspect-video flex items-center justify-center text-on-surface-variant font-serif opacity-50 border border-dashed border-outline-variant/20">
                          Sin archivos multimedia
                      </div>
                  )}
              </div>

              {/* Info Column (Sticky) */}
              <div className="col-span-12 lg:col-span-4 order-1 lg:order-2">
                  <div className="sticky top-[140px] flex flex-col gap-10">
                      <div>
                          <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">{parentZone}</span>
                          <h1 className="font-headline text-4xl md:text-5xl text-on-background mb-6 leading-tight">
                              {room.name}
                          </h1>
                          <p className="text-on-surface-variant text-base leading-relaxed mb-8">
                              {room.extras_desc || "Experimente la serenidad en su máxima expresión. Nuestros espacios están meticulosamente diseñados para ofrecer un retiro lejos del ruido exterior."}
                          </p>
                      </div>

                      {/* Dynamic Amenities */}
                      <div className="bg-surface-container/50 p-8 rounded-lg border border-outline-variant/10">
                          <h3 className="font-headline text-xl text-on-background mb-6">Amenidades del Santuario</h3>
                          <ul className="space-y-4">
                              {amenities.map((amenity: string, idx: number) => {
                                  // Map common amenities to labels and icons
                                  let iconStr = "check_circle";
                                  let label = amenity;
                                  
                                  // Old Room
                                  if(amenity === 'wifi') { iconStr = "wifi"; label = "Conexión Inalámbrica Privada"; }
                                  if(amenity === 'bano_privado') { iconStr = "bathtub"; label = "Baño En Suite"; }
                                  if(amenity === 'tv_size') { iconStr = "tv"; label = "Pantalla Inteligente"; }
                                  if(amenity === 'nevera') { iconStr = "kitchen"; label = "Mini Bar Personal"; }
                                  if(amenity === 'netflix') { iconStr = "movie"; label = "Cine bajo demanda"; }
                                  if(amenity === 'youtube') { iconStr = "smart_display"; label = "Entretenimiento YouTube"; }
                                  if(amenity === 'espejo') { iconStr = "checkroom"; label = "Espejo de Cuerpo Entero"; }
                                  if(amenity === 'luces') { iconStr = "lightbulb"; label = "Iluminación Ambiental Regulable"; }

                                  // Old Apartment
                                  if(amenity === 'ascensor') { iconStr = "elevator"; label = "Acceso por Ascensor"; }
                                  if(amenity === 'cocina') { iconStr = "kitchen"; label = "Cocina Equipada"; }
                                  if(amenity === 'lavadora') { iconStr = "local_laundry_service"; label = "Servicio de Lavandería"; }
                                  if(amenity === 'agua_caliente') { iconStr = "water_drop"; label = "Agua Caliente"; }
                                  if(amenity === 'microondas') { iconStr = "microwave"; label = "Horno Microondas"; }
                                  if(amenity === 'utensilios') { iconStr = "skillet"; label = "Utensilios de Cocina"; }
                                  if(amenity === 'limpieza') { iconStr = "cleaning_services"; label = "Productos de Limpieza"; }

                                  return (
                                    <li key={idx} className="flex items-center gap-4 text-on-surface-variant">
                                        <span className="material-symbols-outlined text-primary" data-icon={iconStr}>{iconStr}</span>
                                        <span className="text-sm tracking-wide">{label}</span>
                                    </li>
                                  )
                              })}
                              {amenities.length === 0 && (
                                  <li className="text-sm text-on-surface-variant opacity-60">Consultar comodidades incluidas</li>
                              )}
                          </ul>
                      </div>

                      {/* Action */}
                      <a 
                        className="w-full py-5 bg-primary-container text-on-primary font-bold tracking-widest uppercase text-sm rounded-md transition-all hover:bg-primary hover:-translate-y-1 shadow-xl flex items-center justify-center gap-3"
                        href="https://wa.me/34698947098" 
                        target="_blank" 
                        rel="noreferrer"
                      >
                          <span className="material-symbols-outlined text-xl" data-icon="lock_open">lock_open</span>
                          Asegurar Reserva
                      </a>
                  </div>
              </div>
          </div>
      </section>
    </main>
  );
}
