import Link from "next/link";
import { Grad, Arrow } from "@/components/Icons";

const NEWS = [
  {
    date: "Formación continua",
    tag: "Innovak Academy & TCD",
    title: "Talleres prácticos de ortodoncia digital, MARPE y cementado indirecto",
    desc: "Nuestros equipos participan en cursos, ponencias y grupos nacionales e internacionales de investigación, y organizamos talleres avanzados junto a doctores y clínicas colaboradoras.",
  },
  {
    date: "Congresos",
    tag: "SEDO Bilbao",
    title: "Participación y taller práctico en el Congreso de la Sociedad Española de Ortodoncia",
    desc: "Presentación de flujos digitales completos desde escaneado intraoral, alineación con CBCT y aparatología sobre microimplantes.",
  },
  {
    date: "I+D Materiales",
    tag: "Nuevo material",
    title: "Resina High Torque Soft Memory e impresión en Nylon PA12 para apnea",
    desc: "Incorporamos nuevas resinas con memoria elástica y dispositivos DDBG en nylon biocompatible de alta resistencia y ajuste suave.",
  },
];

export default function FormacionPage() {
  return (
    <section className="bg-bone py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="max-w-2xl">
          <p className="tag text-titanium">Actualización permanente</p>
          <h1 className="font-display text-4xl lg:text-5xl mt-3 leading-[1.05]">Formación, cursos y novedades</h1>
          <p className="text-graphite/60 mt-3">
            Colaboramos en el desarrollo de nuevas técnicas ortodónticas y dispositivos intraorales, y organizamos grupos de trabajo para ortodoncistas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {NEWS.map((n) => (
            <article key={n.title} className="bg-white rounded-3xl p-7 ring-1 ring-black/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full bg-bone font-semibold">{n.tag}</span>
                  <span className="text-graphite/45">{n.date}</span>
                </div>
                <h2 className="font-display text-2xl mt-4 leading-snug">{n.title}</h2>
                <p className="text-graphite/60 text-sm mt-3 leading-relaxed">{n.desc}</p>
              </div>
              <Link href="/contacto" className="mt-6 pt-4 border-t border-graphite/10 inline-flex items-center justify-between text-sm font-semibold hover:text-amber">
                Solicitar información / inscripción <Arrow />
              </Link>
            </article>
          ))}
        </div>

        <div className="bg-graphite text-white rounded-3xl p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-2xl bg-amber text-graphite grid place-items-center shrink-0"><Grad /></span>
            <div>
              <h3 className="font-display text-2xl">¿Quieres organizar una sesión clínica o taller con TCD?</h3>
              <p className="text-white/60 text-sm mt-1">Preparamos formaciones a medida sobre flujo digital, cementado indirecto y apnea para equipos clínicos.</p>
            </div>
          </div>
          <Link href="/contacto" className="btn btn-primary shrink-0">Proponer formación<Arrow /></Link>
        </div>
      </div>
    </section>
  );
}
