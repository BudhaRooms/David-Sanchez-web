/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { CheckCircle2, Droplets, Wifi, Bath, Tv, Refrigerator, Sparkles } from 'lucide-react';
import { getAmenity } from '@/utils/amenitiesData';
import { AudioPlayer } from '@/components/AudioPlayer';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: accommodationsraw } = await supabase
    .from('accommodations')
    .select('*');

  const { data: globalSettings } = await supabase.from('global_settings').select('*').limit(1).maybeSingle();
  const heroText1 = globalSettings?.hero_text_1 || 'Las mejores habitaciones de Alicante';
  const heroText2 = globalSettings?.hero_text_2 || 'En Budha Rooms, cada detalle ha sido orquestado para ofrecerte una experiencia de lujo.';

  const allAccommodations = accommodationsraw?.sort((a, b) => {
    const orderA = a.size ? parseInt(a.size, 10) : Number.MAX_SAFE_INTEGER;
    const orderB = b.size ? parseInt(b.size, 10) : Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  }) || [];

  // ZONAS (Generadas dinámicamente según la ubicación puesta a cada habitación)
  const dynamicZones: { id: string; slug: string; name: string; coverImage: string; desc: string; }[] = [];
  
  if (allAccommodations.length > 0) {
      const map = new Map();
      for (const room of allAccommodations) {
          if (!room.zone) continue;
          const slug = room.zone.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
          if (!map.has(slug)) {
              map.set(slug, {
                  id: room.id,
                  slug,
                  name: room.zone,
                  coverImage: room.media_gallery?.[0] || 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=1000',
                  desc: `Alojamiento exclusivo en ${room.zone}.`
              });
          }
      }
      dynamicZones.push(...Array.from(map.values()).slice(0, 6)); // máximo 6
  }

  // ROOMS DEMO FALLBACKS
  const showFallbackZones = dynamicZones.length === 0;
  
  // HABITACIONES DESTACADAS
  const featuredRooms = allAccommodations.slice(0, 4);
  const showFallbackRooms = featuredRooms.length === 0;

  return (
    <main className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary overflow-x-hidden">
      <AudioPlayer url={globalSettings?.music_url} enabled={globalSettings?.music_enabled !== false} />
      {/* ----------------- NAVBAR ----------------- */}
      <nav className="fixed top-0 w-full z-100 bg-black/90 backdrop-blur-xl flex justify-between items-center px-4 md:px-20 py-4 md:py-6 border-b border-primary/20">
          <Link href="/" className="font-headline text-primary-container tracking-widest uppercase">
              <img 
                alt="Budha Rooms Logo" 
                className="h-8 md:h-10 w-auto brightness-110" 
                src="/logo_stitch.png"
              />
          </Link>
          <div className="hidden md:flex items-center space-x-16 font-headline tracking-[0.3em] uppercase text-[11px]">
              <a className="text-primary border-b border-primary-container pb-1" href="#">Inicio</a>
              <a className="text-neutral-500 hover:text-primary transition-colors" href="#zonas">Zonas</a>
              <a className="text-neutral-500 hover:text-primary transition-colors" href="#experiencia"><br/></a>
              <a className="text-neutral-500 hover:text-primary transition-colors" href="#faq"><br/><br/></a>
          </div>
          <div className="flex items-center gap-4">
              <a href="https://budharoomsapp.web.app/" target="_blank" rel="noreferrer" className="hidden md:flex border border-primary text-primary px-5 py-2.5 md:py-3 text-[10px] md:text-[11px] font-headline font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-all backdrop-blur-sm">Guía para Huéspedes</a>
              <a href="https://wa.me/34698947098" target="_blank" rel="noreferrer" className="gold-gradient-bg text-on-primary px-6 md:px-10 py-2.5 md:py-3 text-[10px] md:text-[11px] font-headline font-black uppercase tracking-[0.2em] md:tracking-[0.4em] hover:brightness-110 transition-all shadow-lg leading-none">Reservar</a>
          </div>
      </nav>

      {/* ----------------- HERO ----------------- */}
      <header className="relative min-h-[884px] md:min-h-screen flex items-center justify-center overflow-hidden black-marble">
          <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/40 to-black z-10"></div>
              <img 
                alt="Hero Parallax" 
                className="absolute top-0 left-0 w-full h-full object-cover opacity-20 scale-110" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuApzdiI06xGx3kg9lTW6G-fREHM6m5sFFIkY5usjIwsRPMgmJ0zZm-h4oyAh_mlMmZv1ObmXNhaVXbiHBsoyzr2_7SjlV_9gQ8-ZAnY6gOF7pKAYG9NuS5IYTWtOO-XNyC7lezbC40aF5O1BhdU9v_4wuwQZeTZqhWtyoRRoqwWb4kH8z6Q5DidQ0d8cEY_o30BPf1j5u-LLeCHOBTL7qC62lmvtuPNjKKndnAAhZV-Y8NIJLnVBt9FpQn1dMe-iRJzNDM6qVw2g3w"
              />
          </div>
          <div className="relative z-10 text-center px-6 flex flex-col items-center mt-20">
              <div className="mb-12 md:mb-16 relative">
                  <div className="absolute inset-0 aura-glow rounded-full"></div>
                  <img 
                    alt="Budha Rooms Centerpiece" 
                    className="w-auto h-48 md:h-80 relative z-10 drop-shadow-[0_0_30px_rgba(212,175,55,0.4)] animate-pulse-slow" 
                    src="/logo_stitch.png"
                  />
              </div>
              <h1 className="font-headline text-5xl md:text-[9rem] text-primary font-black mb-8 md:mb-10 leading-tight md:leading-none uppercase gold-glow">
                  Budha <br className="md:hidden"/> Rooms
              </h1>
              <div className="relative py-6 md:py-8 px-6 md:px-12 overflow-hidden group">
                  <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent"></div>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent"></div>
                  <p className="font-serif-headline text-lg md:text-2xl text-primary-container italic tracking-[0.2em] md:tracking-[0.4em] uppercase max-w-4xl leading-normal text-balance">
                      {heroText1}
                  </p>
              </div>
              <div className="mt-12 md:mt-20 flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center w-full max-w-xs md:max-w-none flex-wrap px-4">
                  <a href="#rooms" className="w-full md:w-auto gold-gradient-bg text-on-primary px-8 md:px-12 py-5 md:py-6 font-headline font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-[11px] hover:scale-105 transition-all shadow-2xl text-center leading-none">Explorar habitaciones</a>
                  <a href="#zonas" className="w-full md:w-auto border border-primary/40 text-primary px-8 md:px-12 py-5 md:py-6 font-headline font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-[11px] hover:bg-primary/5 transition-all backdrop-blur-sm text-center">Buscar por zona</a>
                  <a href="https://budharoomsapp.web.app/" target="_blank" rel="noreferrer" className="w-full md:w-auto border border-primary text-primary px-8 md:px-12 py-5 md:py-6 font-headline font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-[11px] hover:bg-primary hover:text-on-primary hover:scale-105 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] text-center backdrop-blur-md">Guía para Huéspedes</a>
              </div>
          </div>
      </header>

      {/* ----------------- ZONAS EXCLUSIVAS ----------------- */}
      <section id="zonas" className="py-24 md:py-48 bg-surface-container-low px-6 lg:px-12 relative overflow-hidden dark-wood-texture border-t border-primary/20">
        <img alt="watermark" className="watermark-logo -right-40 top-20 w-[400px] md:w-[600px]" src="/logo_stitch.png"/>
        <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20 md:mb-36">
                <span className="text-primary font-headline font-bold tracking-[0.5em] md:tracking-[0.8em] uppercase text-[10px] mb-6 md:mb-10 block opacity-80">Ubicaciones Estratégicas</span>
                <h2 className="font-headline text-4xl md:text-8xl mb-8 md:mb-12 uppercase text-white gold-glow leading-tight">Zonas Exclusivas</h2>
                <div className="flex items-center justify-center gap-6 md:gap-10">
                    <div className="h-px w-16 md:w-32 bg-linear-to-r from-transparent to-primary/60"></div>
                    <div className="w-6 h-6 md:w-8 md:h-8 border border-primary rotate-45 flex items-center justify-center">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-primary/60"></div>
                    </div>
                    <div className="h-px w-16 md:w-32 bg-linear-to-l from-transparent to-primary/60"></div>
                </div>
                <p className="text-on-surface-variant mt-10 md:mt-16 max-w-3xl mx-auto text-lg md:text-2xl font-serif-headline italic font-light leading-relaxed px-4 md:px-0"><br/></p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {showFallbackZones ? (
                 <>
                   {/* FALLBACK ZONE 1 */}
                   <div className="group relative card-hover-reveal bg-black/40 backdrop-blur-md border border-white/5 overflow-hidden">
                       <div className="p-8 md:p-12 text-center h-full flex flex-col justify-between">
                           <div>
                               <h3 className="text-2xl font-headline text-white mb-6 uppercase tracking-widest group-hover:text-primary transition-colors">Corte Inglés</h3>

                           </div>
                           <button className="font-headline text-[10px] uppercase tracking-[0.4em] text-primary border-b border-primary/30 pb-2 hover:border-primary transition-all mt-auto mx-auto inline-block">Ver Disponibilidad</button>
                       </div>
                   </div>
                   {/* FALLBACK ZONE 2 */}
                   <div className="group relative card-hover-reveal bg-black/40 backdrop-blur-md border border-white/5 overflow-hidden">
                       <div className="p-8 md:p-12 text-center h-full flex flex-col justify-between">
                           <div>
                               <h3 className="text-2xl font-headline text-white mb-6 uppercase tracking-widest group-hover:text-primary transition-colors">Mercado Central</h3>

                           </div>
                           <button className="font-headline text-[10px] uppercase tracking-[0.4em] text-primary border-b border-primary/30 pb-2 hover:border-primary transition-all mt-auto mx-auto inline-block">Ver Disponibilidad</button>
                       </div>
                   </div>
                   {/* FALLBACK ZONE 3 */}
                   <div className="group relative card-hover-reveal bg-black/40 backdrop-blur-md border border-white/5 overflow-hidden">
                       <div className="p-8 md:p-12 text-center h-full flex flex-col justify-between">
                           <div>
                               <h3 className="text-2xl font-headline text-white mb-6 uppercase tracking-widest group-hover:text-primary transition-colors">Auditorio</h3>

                           </div>
                           <button className="font-headline text-[10px] uppercase tracking-[0.4em] text-primary border-b border-primary/30 pb-2 hover:border-primary transition-all mt-auto mx-auto inline-block">Ver Disponibilidad</button>
                       </div>
                   </div>
                 </>
              ) : (
                dynamicZones.map((z) => (
                    <div key={z.id} className="group relative card-hover-reveal bg-black/40 backdrop-blur-md border border-white/5 overflow-hidden">
                       <div className="p-8 md:p-12 text-center h-full flex flex-col justify-between">
                           <div>
                               <h3 className="text-2xl font-headline text-white mb-6 uppercase tracking-widest group-hover:text-primary transition-colors">{z.name}</h3>

                           </div>
                           <Link href={`/zonas/${z.slug}`} className="font-headline text-[10px] uppercase tracking-[0.4em] text-primary border-b border-primary/30 pb-2 hover:border-primary transition-all mt-auto mx-auto inline-block">Ver Disponibilidad</Link>
                       </div>
                   </div>
                ))
              )}
            </div>
        </div>
      </section>

      {/* ----------------- HABITACIONES ROOMS ----------------- */}
      <section id="rooms" className="py-24 md:py-48 bg-black relative overflow-hidden border-t border-primary/10">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 md:mb-36 gap-10">
                <div className="border-l-[6px] md:border-l-12 border-primary pl-6 md:pl-12 max-w-4xl">
                    <p className="text-on-surface-variant font-body text-sm md:text-lg leading-relaxed mb-6 md:mb-8 font-light text-pretty opacity-90">
                      &quot;A nivel espiritual, Budha es el máximo exponente del equilibrio humano. Hemos convertido su rostro en nuestra identidad porque creemos en el poder de los espacios en los que estamos. Su imagen transmite una energía silenciosa pero poderosa que purifica la energía del lugar. Somos Budha porque nuestro mayor propósito es que, al cruzar nuestras puertas, te encuentres con un lugar donde la buena energía y las vibras positivas las puedas sentir en cada momento de tu estancia.&quot;
                    </p>
                    <p className="text-primary text-xl md:text-3xl italic font-serif-headline font-light tracking-wide opacity-80">Diseño de vanguardia, confort y lujo.</p>
                </div>
                <Link href="#zonas" className="font-headline text-[11px] md:text-[12px] text-primary font-black border-b-2 border-primary pb-3 md:pb-4 hover:text-white hover:border-white transition-all uppercase tracking-[0.3em] md:tracking-[0.5em]">Catálogo Completo</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                {showFallbackRooms ? (
                    <>
                    {/* ROOM FALLBACK 1 */}
                    <div className="group bg-surface-container-lowest border border-white/5 hover:border-primary/40 transition-all duration-700">
                        <div className="relative h-[400px] md:h-[550px] overflow-hidden">
                            <img alt="Suite Zen Gold" className="w-full h-full object-cover transition-transform duration-10000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsh6XO_m6NhoL8Khkssn5m-PwGHI9wEiXNm6yDIenEMzWM0OcxF2QD_-4AGUEHla5CazY_8gWMPAg5ljjSCKX2fWnoxRWzQJYHYF_d002ui1kEjA3GNEtFWhSrf8i3TY_020BligPB5iK8IzXKWv5I_1Wx51lMKBjJX4nPd06JOQZ1FT43jGzMBo8R96IIuv2muoaZLpBhtkOHZ5KMAEzjaWLS0TeVnC-fAk9hVT5TTZjwTytwipf1tDLrqXYCn1g-uW6cx9D6Ers"/>
                            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80 z-10"></div>
                        </div>
                        <div className="p-8 md:p-14 border-t border-white/5">
                            <h3 className="font-headline text-2xl md:text-3xl mb-8 md:mb-10 text-white uppercase tracking-[0.15em] md:tracking-[0.2em]">Suite Zen Gold</h3>
                            <div className="flex justify-between md:justify-start gap-8 mb-10 md:mb-14 text-[11px] md:text-[12px] font-headline uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary/60 border-y border-white/10 py-5 md:py-6">
                                <Wifi className="w-5 h-5 text-primary/80" />
                                <Droplets className="w-5 h-5 text-primary/80" />
                            </div>
                            <button className="w-full py-5 md:py-6 bg-transparent border border-primary/50 text-primary font-headline font-black text-[11px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.5em] hover:bg-primary hover:text-on-primary transition-all">ver disponibilidad</button>
                        </div>
                    </div>
                    {/* ROOM FALLBACK 2 */}
                    <div className="group bg-surface-container-lowest border border-white/5 hover:border-primary/40 transition-all duration-700">
                        <div className="relative h-[400px] md:h-[550px] overflow-hidden">
                            <img alt="Deluxe Urban" className="w-full h-full object-cover transition-transform duration-10000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmqRZktc56JLcNtglo9PJEQthjMx4XrtXwfQwg8HklS-EuKUCynsTz3vIfa-lK08-_p1Qhyt9yiH9wkuyGYC_LKdjJtit7mqdhTtw3pKxEjTnPfpPou6RxsttvIWNvoI_5Ek4qx23PbferzlO4CoqpXhwqUVJ09SUstmK20HFBqfQgivI-kWDu1eICZw3TdCjyIl8YOj-poEpvo1h9V5sZHFn3eZ8vQjGUqU6bdO_P1J5Ehm948x2lS-68UVh-cNyty2q_7QQ3yFY"/>
                            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80 z-10"></div>
                        </div>
                        <div className="p-8 md:p-14 border-t border-white/5">
                            <h3 className="font-headline text-2xl md:text-3xl mb-8 md:mb-10 text-white uppercase tracking-[0.15em] md:tracking-[0.2em]">Deluxe Urban</h3>
                            <div className="flex justify-between md:justify-start gap-8 mb-10 md:mb-14 text-[11px] md:text-[12px] font-headline uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary/60 border-y border-white/10 py-5 md:py-6">
                                <Tv className="w-5 h-5 text-primary/80" />
                                <Refrigerator className="w-5 h-5 text-primary/80" />
                            </div>
                            <button className="w-full py-5 md:py-6 bg-transparent border border-primary/50 text-primary font-headline font-black text-[11px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.5em] hover:bg-primary hover:text-on-primary transition-all">ver disponibilidad</button>
                        </div>
                    </div>
                    {/* ROOM FALLBACK 3 */}
                    <div className="group bg-surface-container-lowest border border-white/5 hover:border-primary/40 transition-all duration-700">
                        <div className="relative h-[400px] md:h-[550px] overflow-hidden">
                            <img alt="Budha Loft" className="w-full h-full object-cover transition-transform duration-10000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIRf65LI1ju1vQE6HUpqwU24vRFfOk5Szfehn1O0GOjE22p3trAiCMa8iE6Odcs3ntJ-rdyhSMW9HB0AUBLP1wKe0lUnUED5lMDboI3oovXILcyijORg9YRd7cD3kaSIlhqYJddDjjyHj7j0YJg7vlYdr79agkibAY_FZwLuucivpgoRJ4juZokopjaJW2bDer99T-ek12TGvUCRv5FCMZqSEUPRDIrEhH1FEVeF90jkL3krlCQzanB_Rv0ATZLnM4Ro4Kw-yEbp0"/>
                            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80 z-10"></div>
                        </div>
                        <div className="p-8 md:p-14 border-t border-white/5">
                            <h3 className="font-headline text-2xl md:text-3xl mb-8 md:mb-10 text-white uppercase tracking-[0.15em] md:tracking-[0.2em]">Budha Loft</h3>
                            <div className="flex justify-between md:justify-start gap-8 mb-10 md:mb-14 text-[11px] md:text-[12px] font-headline uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary/60 border-y border-white/10 py-5 md:py-6">
                                <Bath className="w-5 h-5 text-primary/80" />
                                <Sparkles className="w-5 h-5 text-primary/80" />
                            </div>
                            <button className="w-full py-5 md:py-6 bg-transparent border border-primary/50 text-primary font-headline font-black text-[11px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.5em] hover:bg-primary hover:text-on-primary transition-all">ver disponibilidad</button>
                        </div>
                    </div>
                    </>
                ) : (
                    featuredRooms.map((room: { id: string; name: string; slug: string; media_gallery?: string[]; climate_desc?: string; size?: string; amenities?: string[] }) => {
                        const heroMedia = room.media_gallery && room.media_gallery.length > 0 ? room.media_gallery[0] : "https://lh3.googleusercontent.com/aida-public/AB6AXuCmqRZktc56JLcNtglo9PJEQthjMx4XrtXwfQwg8HklS-EuKUCynsTz3vIfa-lK08-_p1Qhyt9yiH9wkuyGYC_LKdjJtit7mqdhTtw3pKxEjTnPfpPou6RxsttvIWNvoI_5Ek4qx23PbferzlO4CoqpXhwqUVJ09SUstmK20HFBqfQgivI-kWDu1eICZw3TdCjyIl8YOj-poEpvo1h9V5sZHFn3eZ8vQjGUqU6bdO_P1J5Ehm948x2lS-68UVh-cNyty2q_7QQ3yFY";
                        const isVideo = heroMedia.toLowerCase().includes('.mp4') || heroMedia.toLowerCase().includes('.mov') || heroMedia.toLowerCase().includes('.webm');

                        // Extraer 5 amenities max para mostrarlos aquí
                        const listAmenities = (room.amenities || []).slice(0, 5);

                        return (
                          <div key={room.id} className="group bg-surface-container-lowest border border-white/5 hover:border-primary/40 transition-all duration-700">
                              <div className="relative h-[400px] md:h-[550px] overflow-hidden">
                                  {isVideo ? (
                                      <video src={heroMedia} autoPlay muted loop playsInline className="w-full h-full object-cover transition-transform duration-10000 group-hover:scale-105"/>
                                  ) : (
                                      <img alt={room.name} className="w-full h-full object-cover transition-transform duration-10000 group-hover:scale-105" src={heroMedia}/>
                                  )}
                                  <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80 z-10"></div>
                              </div>
                              <div className="p-8 md:p-14 border-t border-white/5 flex flex-col justify-between h-auto">
                                  <h3 className="font-gothic text-3xl sm:text-4xl mb-1 text-white hover:text-primary transition-colors tracking-normal">{room.name}</h3>
                                  {room.climate_desc && (
                                    <span className="text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-8 block">
                                      {room.climate_desc}
                                    </span>
                                  )}
                                  <div className="flex justify-between md:justify-start gap-6 md:gap-8 mb-10 md:mb-14 text-[11px] md:text-[12px] font-headline uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary/60 border-y border-white/10 py-5 md:py-6 flex-wrap">
                                      {listAmenities.map((am: string, i: number) => {
                                          const amenityInfo = getAmenity(am);
                                          const Icon = amenityInfo.icon || CheckCircle2;
                                          return <div key={i} title={amenityInfo.label}><Icon className="w-5 h-5 text-primary/80 transition-all hover:text-white" /></div>;
                                      })}
                                  </div>
                                  <Link href={`/habitaciones/${room.slug}`} className="w-full py-5 md:py-6 bg-transparent border border-primary/50 text-center text-primary font-headline font-black text-[11px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.5em] hover:bg-primary hover:text-on-primary transition-all inline-block mt-auto">
                                      Ver Detalles
                                  </Link>
                              </div>
                          </div>
                      );
                    })
                )}
            </div>
        </div>
      </section>

      {/* ----------------- EXPERIENCIA ----------------- */}
      <section id="experiencia" className="py-24 md:py-48 bg-black black-marble relative overflow-hidden">
        <img alt="watermark" className="watermark-logo -left-40 bottom-20 w-[400px] md:w-[800px] rotate-12" src="/logo_stitch.png"/>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 md:gap-40 items-center">
                <div className="relative order-2 lg:order-1">
                    <div className="p-4 bg-linear-to-br from-primary/30 to-transparent">
                        <div className="p-1 bg-black">
                            <img alt="Majestic Experience" className="w-full h-[500px] md:h-[800px] object-cover grayscale brightness-75 sepia-[0.2] contrast-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApzdiI06xGx3kg9lTW6G-fREHM6m5sFFIkY5usjIwsRPMgmJ0zZm-h4oyAh_mlMmZv1ObmXNhaVXbiHBsoyzr2_7SjlV_9gQ8-ZAnY6gOF7pKAYG9NuS5IYTWtOO-XNyC7lezbC40aF5O1BhdU9v_4wuwQZeTZqhWtyoRRoqwWb4kH8z6Q5DidQ0d8cEY_o30BPf1j5u-LLeCHOBTL7qC62lmvtuPNjKKndnAAhZV-Y8NIJLnVBt9FpQn1dMe-iRJzNDM6qVw2g3w"/>
                        </div>
                    </div>
                    <div className="absolute -bottom-6 md:-bottom-12 -right-6 md:-right-12 w-32 md:w-64 h-32 md:h-64 border border-primary/20 pointer-events-none hidden sm:block"></div>
                    <div className="absolute -top-6 md:-top-12 -left-6 md:-left-12 w-32 md:w-64 h-32 md:h-64 border border-primary/20 pointer-events-none hidden sm:block"></div>
                </div>
                <div className="order-1 lg:order-2 space-y-10 md:space-y-16 relative z-20">
                    <div className="inline-block border-y border-primary/40 py-4 md:py-6 px-6 md:px-10 bg-black/40 backdrop-blur-sm rounded-lg">
                        <span className="font-headline text-primary tracking-[0.4em] md:tracking-[0.7em] uppercase text-[9px] md:text-[10px] font-black drop-shadow-md">Auténtico Lujo en Alicante</span>
                    </div>
                    <h2 className="font-headline text-2xl sm:text-4xl lg:text-6xl text-white leading-tight lg:leading-[1.1] uppercase gold-glow text-balance w-full drop-shadow-xl">+15 Años de Experiencia</h2>
                    <p className="text-white font-serif-headline text-lg md:text-2xl leading-relaxed italic border-l-4 md:border-l-8 border-primary pl-6 md:pl-12 drop-shadow-lg font-medium bg-black/20 p-2 rounded-r-lg">
                        {heroText2}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-16 pt-8 md:pt-16">
                        <div className="flex items-start gap-6 md:gap-10 group bg-black/10 p-4 rounded-xl backdrop-blur-xs">
                            <div className="w-16 md:w-20 h-16 md:h-20 shrink-0 flex items-center justify-center border border-primary/50 bg-black/40 rotate-45 group-hover:bg-primary/20 transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="-rotate-45 w-8 h-8 md:w-10 md:h-10 text-primary drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 22l10-10"/>
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-headline font-black text-primary uppercase tracking-[0.2em] md:tracking-[0.3em] text-[13px] md:text-sm mb-2 md:mb-4 drop-shadow-md">Confort</h4>
                                <p className="text-white font-body text-base md:text-lg font-medium leading-relaxed drop-shadow-sm"><br/></p>
                            </div>
                        </div>
                        <div className="flex items-start gap-6 md:gap-10 group bg-black/10 p-4 rounded-xl backdrop-blur-xs">
                            <div className="w-16 md:w-20 h-16 md:h-20 shrink-0 flex items-center justify-center border border-primary/50 bg-black/40 rotate-45 group-hover:bg-primary/20 transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="-rotate-45 w-8 h-8 md:w-10 md:h-10 text-primary drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-headline font-black text-primary uppercase tracking-[0.2em] md:tracking-[0.3em] text-[13px] md:text-sm mb-2 md:mb-4 drop-shadow-md">Privacidad</h4>
                                <p className="text-white font-body text-base md:text-lg font-medium leading-relaxed drop-shadow-sm"><br/></p>
                            </div>
                        </div>
                        <div className="flex items-start gap-6 md:gap-10 group bg-black/10 p-4 rounded-xl backdrop-blur-xs">
                            <div className="w-16 md:w-20 h-16 md:h-20 shrink-0 flex items-center justify-center border border-primary/50 bg-black/40 rotate-45 group-hover:bg-primary/20 transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="-rotate-45 w-8 h-8 md:w-10 md:h-10 text-primary drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13"/><path d="M13 3l3 6-4 13"/>
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-headline font-black text-primary uppercase tracking-[0.2em] md:tracking-[0.3em] text-[13px] md:text-sm mb-2 md:mb-4 drop-shadow-md">Experiencia</h4>
                                <p className="text-white font-body text-base md:text-lg font-medium leading-relaxed drop-shadow-sm"><br/></p>
                            </div>
                        </div>
                        <div className="flex items-start gap-6 md:gap-10 group bg-black/10 p-4 rounded-xl backdrop-blur-xs">
                            <div className="w-16 md:w-20 h-16 md:h-20 shrink-0 flex items-center justify-center border border-primary/50 bg-black/40 rotate-45 group-hover:bg-primary/20 transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="-rotate-45 w-8 h-8 md:w-10 md:h-10 text-primary drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-headline font-black text-primary uppercase tracking-[0.2em] md:tracking-[0.3em] text-[13px] md:text-sm mb-2 md:mb-4 drop-shadow-md">Ubicación</h4>
                                <p className="text-white font-body text-base md:text-lg font-medium leading-relaxed drop-shadow-sm"><br/></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="w-full py-16 md:py-28 px-6 md:px-20 bg-black flex flex-col md:flex-row justify-between items-center border-t border-primary/30 font-headline text-[10px] md:text-[11px] tracking-[0.3em] md:tracking-[0.4em] uppercase text-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 dark-wood-texture pointer-events-none"></div>
          <div className="mb-12 md:mb-0 relative z-10 flex flex-col items-center md:items-start gap-6">
              <img alt="Budha Rooms Logo Small" className="h-8 md:h-10 w-auto mb-4 opacity-70 grayscale brightness-110" src="/logo_stitch.png"/>
              <p className="opacity-50 text-neutral-400 text-center md:text-left leading-relaxed">© 2024 Budha Rooms Alicante. <br className="md:hidden"/> El Silencio es el Nuevo Lujo.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-14 relative z-10">
              <Link className="hover:text-white transition-all border-b border-transparent hover:border-white pb-2" href="/aviso-legal">Aviso Legal</Link>
              <Link className="hover:text-white transition-all border-b border-transparent hover:border-white pb-2" href="/privacidad">Privacidad</Link>
              <Link className="hover:text-white transition-all border-b border-transparent hover:border-white pb-2" href="/cookies">Cookies</Link>
              <a className="hover:text-white transition-all border-b border-transparent hover:border-white pb-2" href="https://wa.me/34698947098" target="_blank" rel="noreferrer">Contacto</a>
          </div>
      </footer>
    </main>
  );
}
