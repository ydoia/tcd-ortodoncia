import { notFound } from "next/navigation";

const PAGES: Record<string, { title: string; body: string[] }> = {
  privacidad: {
    title: "Política de Privacidad de Datos",
    body: [
      "Responsable del tratamiento: SIKKER SVAR S.L. (TCD ORTODONCIA).",
      "Finalidad: atender las solicitudes de información, altas de clínicas, prescripciones digitales y seguimiento de la relación profesional con los centros odontológicos clientes.",
      "Legitimación: consentimiento del interesado y ejecución de la relación precontractual o contractual de laboratorio.",
      "Destinatarios: no se prevén cesiones de datos a terceros salvo obligación legal o servicios de transporte para la recogida y entrega de aparatología.",
      "Derechos: puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad enviando una solicitud a administracion@tcdortodoncia.com, así como presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).",
    ],
  },
  cookies: {
    title: "Política de Cookies",
    body: [
      "Este sitio web utiliza cookies técnicas necesarias para el funcionamiento del portal de clínicas y la selección de laboratorio.",
      "Puede configurar su navegador para bloquear o eliminar las cookies en cualquier momento sin que ello afecte al acceso a la información pública del catálogo.",
    ],
  },
  "aviso-legal": {
    title: "Aviso Legal",
    body: [
      "Titular: SIKKER SVAR S.L. (TCD ORTODONCIA).",
      "Sedes: Avenida Pedro San Martín 16, 39007 Santander (Cantabria) · Calle Costa Rica 3, 35010 Las Palmas de Gran Canaria · Portuko Markesaren kalea 10, 48008 Bilbao.",
      "Contacto: administracion@tcdortodoncia.com · Tel. +34 942 23 12 36.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  return (
    <section className="bg-bone py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-6 bg-white rounded-3xl p-8 lg:p-12 ring-1 ring-black/5">
        <p className="tag text-titanium">Información legal</p>
        <h1 className="font-display text-3xl lg:text-4xl mt-3">{page.title}</h1>
        <div className="mt-6 space-y-4 text-graphite/75 leading-relaxed text-sm">
          {page.body.map((p, i) => (<p key={i}>{p}</p>))}
        </div>
      </div>
    </section>
  );
}
