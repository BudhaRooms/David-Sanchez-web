import Link from "next/link";
import { Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 separator-line">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo mock */}
          <span className="text-xl font-bold tracking-widest text-gold uppercase">
            Budha Rooms
          </span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium tracking-wide text-gray-300">
          <Link href="#habitaciones" className="hover:text-gold transition-colors">Habitaciones</Link>
          <Link href="#ubicacion" className="hover:text-gold transition-colors">Ubicación</Link>
          <Link href="#contacto" className="hover:text-gold transition-colors">Contacto</Link>
        </nav>
        <button className="md:hidden text-gold p-2 -mr-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
