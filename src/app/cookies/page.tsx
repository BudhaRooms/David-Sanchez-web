import React from "react";
import Link from "next/link";

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface-variant font-body py-32 px-6">
      <div className="max-w-4xl mx-auto bg-surface-container-low p-8 md:p-16 rounded-xl border border-white/5">
        <Link href="/" className="text-primary hover:text-white transition-colors mb-8 inline-flex items-center gap-2 uppercase tracking-widest text-xs font-bold">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al Inicio
        </Link>
        <h1 className="text-3xl md:text-5xl font-headline text-white mb-8 mt-4 uppercase tracking-widest">Política de Cookies</h1>
        
        <div className="space-y-8 text-sm md:text-base leading-relaxed font-light">
          <section>
            <p>
              Esta Política de Cookies explica qué son las cookies, cómo las utilizamos en <strong>budharooms.es</strong>, los tipos de cookies que utilizamos (es decir, la información que recopilamos utilizando cookies y cómo se utiliza esa información) y cómo controlar las preferencias de cookies. 
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline text-primary mb-4">¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se utilizan para almacenar pequeñas piezas de información. Se almacenan en su dispositivo cuando la página web se carga en su navegador. Estas cookies nos ayudan a hacer que el sitio web funcione correctamente, hacerlo más seguro, proporcionar una mejor experiencia de usuario y comprender cómo funciona el sitio web para analizar lo que funciona y dónde necesita mejorar.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline text-primary mb-4">¿Cómo usamos las cookies?</h2>
            <p>
              Como la mayoría de los servicios en línea, nuestro sitio web utiliza cookies propias y de terceros para varios propósitos. 
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 opacity-80">
              <li><strong>Cookies propias:</strong> Son las estrictamente necesarias para que el sitio web funcione de la manera correcta, y no recopilan ninguno de sus datos de identificación personal.</li>
              <li><strong>Cookies de terceros:</strong> Se utilizan principalmente para comprender cómo funciona el sitio web, cómo interactúa con nuestra página, mantener nuestros servicios seguros, entregar pautas relevantes para usted y, en general, brindarle una experiencia de usuario mejorada.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-headline text-primary mb-4">¿Qué tipos de cookies usamos?</h2>
            <ul className="list-disc pl-6 space-y-4 opacity-80">
              <li>
                <strong>Esenciales:</strong> Estas cookies son fundamentales para que pueda experimentar la funcionalidad completa de nuestro sitio web. Nos permiten mantener sesiones de usuarios y evitar amenazas de seguridad. No recogen ni guardan ninguna información personal.
              </li>
              <li>
                <strong>Consentimiento:</strong> Utilizamos la cookie <code>cookieConsent</code> para recordar su elección en nuestro aviso de cookies inferor, evitando molestias en visitas futuras.
              </li>
              <li>
                <strong>Estadística y Analítica:</strong> Estas cookies almacenan información como el número de visitantes del sitio web, el número de visitantes únicos, qué páginas han sido visitadas, la fuente de la visita, etc. (Ej: Google Analytics).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-headline text-primary mb-4">¿Cómo puedo controlar sus preferencias de cookies?</h2>
            <p>
              Usted puede gestionar sus preferencias de cookies directamente desde la configuración de su navegador web, bloqueando o eliminando las cookies utilizadas por cualquier sitio web. Sin embargo, advertimos de que deshabilitar cookies podría entorpecer el funcionamiento correcto del sitio web. 
            </p>
            <div className="mt-4 opacity-80 space-y-2">
              <p>Ayuda para configurar cookies por navegadores:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><a href="https://support.google.com/chrome/answer/95647?hl=es" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
                <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer" className="text-primary hover:underline">Apple Safari</a></li>
                <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
