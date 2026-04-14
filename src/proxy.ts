import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''

  // Is it Firebase? (The Guia App domain)
  const isFirebaseApp = hostname.includes('budharoomsapp.web.app') || hostname.includes('budharoomsapp.firebaseapp.com')

  // LOGICA PARA LA APP DE HUÉSPEDES (Firebase)
  if (isFirebaseApp) {
    // Si intenta acceder a rutas prohibidas de Vercel (hotel web), forzarlo a /guia transparentemente
    if (url.pathname === '/' || url.pathname.startsWith('/habitaciones') || url.pathname.startsWith('/admin') || url.pathname.startsWith('/zonas') || url.pathname.startsWith('/aviso-legal') || url.pathname.startsWith('/privacidad') || url.pathname.startsWith('/cookies')) {
      url.pathname = '/guia'
      return NextResponse.rewrite(url)
    }
    // Otras rutas de Firebase, permitirlas sin cargar cosas pesadas de Supabase
    return NextResponse.next()
  }

  // LOGICA PARA EL HOTEL WEB (Vercel)
  // Esta función intercepta cada petición y usa el helper que creamos
  // para mantener la sesión del administrador activa usando Cookies seguras (SSR).
  return await createClient(request)
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto a archivos estáticos y API para optimizar el rendimiento:
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
