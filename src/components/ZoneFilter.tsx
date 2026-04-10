/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

interface ZoneFilterProps {
  zones: {
    id: string;
    slug: string;
    name: string;
    coverImage: string;
    roomCount?: string;
  }[];
}

export default function ZoneFilter({ zones }: ZoneFilterProps) {
  return (
    <section className="py-32 px-12 bg-background" id="zones">
        <div className="max-w-7xl mx-auto text-center mb-20">
            <h2 className="font-headline text-4xl md:text-6xl mb-4">Discover Your Zone</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
            <p className="text-on-surface-variant max-w-xl mx-auto">Select a sanctuary within Alicante&apos;s most iconic neighborhoods.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {zones.map((zone) => (
                <Link href={`/zonas/${zone.slug}`} key={zone.id} className="group relative aspect-3/4 overflow-hidden cursor-pointer rounded-lg bg-surface-container block hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-700">
                    <img 
                      alt={zone.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
                      src={zone.coverImage} 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-2xl font-headline text-white mb-2">{zone.name}</h3>
                        <p className="text-primary text-sm tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                            {zone.roomCount}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    </section>
  );
}
