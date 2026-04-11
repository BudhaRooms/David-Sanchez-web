import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface-variant font-body py-32 px-6">
      <div className="max-w-4xl mx-auto bg-surface-container-low p-8 md:p-16 rounded-xl border border-white/5">
        <Link href="/" className="text-primary hover:text-white transition-colors mb-8 inline-flex items-center gap-2 uppercase tracking-widest text-xs font-bold">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al Inicio
        </Link>
        <h1 className="text-3xl md:text-5xl font-headline text-white mb-8 mt-4 uppercase tracking-widest">Política de Privacidad</h1>
        
        <div className="space-y-8 text-sm md:text-base leading-relaxed font-light">
          <section>
            <p>
              En <strong>Budha Rooms Alicante</strong>, valoramos profundamente su privacidad y nos comprometemos a proteger los datos personales que nos comparta, conforme al Reglamento General de Protección de Datos (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline text-primary mb-4">1. Identidad del Responsable</h2>
            <p>
              El responsable del tratamiento de los datos recabados a través de esta web es:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 opacity-80">
              <li><strong>Titular:</strong> [NOMBRE DE LA EMPRESA O AUTÓNOMO]</li>
              <li><strong>NIF/CIF:</strong> [CIF DE LA EMPRESA]</li>
              <li><strong>Email de Protección de Datos:</strong> [EMAIL DE CONTACTO]</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-headline text-primary mb-4">2. Finalidad del Tratamiento de los Datos</h2>
            <p>
              Recopilamos y tratamos su información exclusivamente con los siguientes fines:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 opacity-80">
              <li>Gestionar y dar respuesta a las solicitudes de información, reserva o contacto enviadas a través de WhatsApp.</li>
              <li>Mejorar la experiencia de usuario dentro del sitio web a través de datos anónimos de navegación.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-headline text-primary mb-4">3. Comunicaciones por WhatsApp</h2>
            <p>
              Tenga en cuenta que al hacer clic en el botón de contacto de "WhatsApp", usted abandona nuestra web y accederá a una plataforma externa. En ese entorno, se aplicarán directamente la Política de Privacidad de WhatsApp LLC. Nosotros únicamente trataremos su número de teléfono y nombre para resolver la consulta de reserva que haya planteado. No almacenamos este número en bases de datos comerciales sin su explícito permiso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline text-primary mb-4">4. Derechos de los Usuarios (Derechos ARCO)</h2>
            <p>
              El interesado podrá ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición (y otros como la portabilidad o el derecho al olvido), dirigiendo su solicitud mediante correo electrónico al email de contacto proporcionado, acompañando una prueba válida de identidad (DNI o Pasaporte) e indicando en el asunto "PROTECCIÓN DE DATOS".
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline text-primary mb-4">5. Seguridad de los Datos</h2>
            <p>
              Budha Rooms Alicante se compromete al cumplimiento de su obligación de secreto de los datos de carácter personal y guarda altos estándares de seguridad (implementando tecnología SSL en nuestra web y protocolos de cifrado internos) para evitar su alteración, pérdida, o acceso no autorizado.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
