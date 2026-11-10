import Image from "next/image";
import Link from "next/link";
import { SOLUTIONS } from "@/lib/data";
import { Arrow, Upload } from "@/components/Icons";

export default function SolucionesPage() {
  return (
    <section className="bg-bone py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <p className="tag text-titanium">Especialidades del laboratorio</p>
          <h1 className="font-display text-4xl lg:text-5xl mt-3 leading-[1.05]">Soluciones clínicas y digitales</h1>
          <p className="text-graphite/60 mt-3">Desde la ortodoncia tradicional de laboratorio hasta la planificación 3D sobre microimplantes, alineadores y apnea del sueño.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {SOLUTIONS.map((s) => (
            <Link key={s.slug} href={`/soluciones/${s.slug}`} className="group bg-white rounded-3xl overflow-hidden ring-1 ring-black/5 flex flex-col">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={s.image} alt={s.name} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <span className="absolute top-4 left-4 text-xs font-semibold bg-graphite/90 text-amber px-3.5 py-1.5 rounded-full">{s.short}</span>
              </div>
              <div className="p-7 flex-1 flex flex-col">
                <h2 className="font-display text-2xl lg:text-3xl group-hover:text-amber transition-colors">{s.name}</h2>
                <p className="text-graphite/60 text-sm mt-2 flex-1">{s.intro}</p>
                <div className="mt-6 pt-5 border-t border-graphite/10 flex items-center justify-between text-sm font-semibold">
                  <span>Ver especificaciones y protocolo</span>
                  <Arrow className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 bg-graphite text-white rounded-3xl p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl lg:text-3xl">¿Necesitas combinar varios sistemas en un caso?</h3>
            <p className="text-white/60 text-sm mt-1">Nuestros técnicos revisan tu escaneado y te proponen la opción más predecible.</p>
          </div>
          <Link href="/enviar-caso" className="btn btn-primary shrink-0"><Upload className="w-4 h-4" />Enviar caso</Link>
        </div>
      </div>
    </section>
  );
}
