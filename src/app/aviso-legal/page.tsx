import React from "react";
import Link from "next/link";

export default function LegalNoticePage() {
  return (
    <div className="min-h-screen bg-background text-on-surface-variant font-body py-32 px-6">
      <div className="max-w-4xl mx-auto bg-surface-container-low p-8 md:p-16 rounded-xl border border-white/5">
        <Link href="/" className="text-primary hover:text-white transition-colors mb-8 inline-flex items-center gap-2 uppercase tracking-widest text-xs font-bold">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al Inicio
        </Link>
        <h1 className="text-3xl md:text-5xl font-headline text-white mb-8 mt-4 uppercase tracking-widest">Aviso Legal</h1>
        
        <div className="space-y-8 text-sm md:text-base leading-relaxed font-light">
          <section>
            <h2 className="text-xl font-headline text-primary mb-4">[DATOS IDENTIFICATIVOS]</h2>
            <p className="mb-4">
              En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSICE), a continuación se reflejan los siguientes datos:
            </p>
            <ul className="list-disc pl-6 space-y-2 opacity-80">
              <li><strong>Titular de la web:</strong> [NOMBRE O RAZÓN SOCIAL DE LA EMPRESA]</li>
              <li><strong>CIF / NIF:</strong> [NÚMERO DE IDENTIFICACIÓN FISCAL]</li>
              <li><strong>Dirección:</strong> [DIRECCIÓN FÍSICA COMPLETA DE LA EMPRESA O NEGOCIO]</li>
              <li><strong>Correo electrónico de contacto:</strong> [EMAIL DE CONTACTO]</li>
              <li><strong>Teléfono:</strong> +34 698 94 70 98</li>
              <li><strong>Sitio Web:</strong> https://budharooms.es</li>
            </ul>
            <p className="mt-4 italic opacity-70">
              (Nota para el propietario: Sustituye los campos entre corchetes por tus datos fiscales reales).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline text-primary mb-4">Uso del Portal</h2>
            <p>
              budharooms.es proporciona el acceso a multitud de informaciones, servicios, programas o datos (en adelante, "los contenidos") en Internet pertenecientes a Budha Rooms Alicante creadora del sitio web o a sus licenciantes a los que el USUARIO pueda tener acceso.
              <br/><br/>
              El USUARIO asume la responsabilidad del uso del portal. Dicha responsabilidad se extiende al registro que fuese necesario para acceder a determinados servicios o contenidos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline text-primary mb-4">Propiedad Intelectual y Privacidad</h2>
            <p>
              Budha Rooms Alicante es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma. Todos los derechos reservados.
              <br/><br/>
              Quedan expresamente prohibidas la reproducción, la distribución y la comunicación pública, incluida su modalidad de puesta a disposición, de la totalidad o parte de los contenidos de esta página web, con fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización de la empresa autora.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline text-primary mb-4">Exclusión de Garantías y Responsabilidad</h2>
            <p>
              Budha Rooms Alicante no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-headline text-primary mb-4">Legislación Aplicable y Jurisdicción</h2>
            <p>
              La relación entre Budha Rooms Alicante y el USUARIO se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y tribunales de la ciudad de Alicante, España.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
