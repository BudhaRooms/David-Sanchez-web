import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  // Esta función intercepta cada petición y usa el helper que creamos
  // para mantener la sesión del administrador activa usando Cookies seguras (SSR).
  return await createClient(request)
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto a archivos estáticos y API para optimizar el rendimiento:
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
