import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SOLUTIONS } from "@/lib/data";
import { Arrow, Check, Upload, Phone } from "@/components/Icons";

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export default async function SolutionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sol = SOLUTIONS.find((s) => s.slug === slug);
  if (!sol) notFound();

  return (
    <>
      <section className="bg-graphite text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-tech opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Link href="/soluciones" className="text-xs text-white/50 hover:text-amber uppercase tracking-widest">← Todas las soluciones</Link>
            <p className="tag text-amber mt-4">{sol.short}</p>
            <h1 className="font-display text-4xl lg:text-6xl mt-3 leading-[1.03]">{sol.name}</h1>
            <p className="text-white/65 text-lg mt-5 leading-relaxed">{sol.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/enviar-caso?aparato=${encodeURIComponent(sol.name)}`} className="btn btn-primary">
                <Upload className="w-4 h-4" />Prescribir este servicio
              </Link>
              <a href="tel:+34942231236" className="btn btn-ghost-dark"><Phone />Consultar con un técnico</a>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-[28px] overflow-hidden ring-1 ring-white/10">
            <Image src={sol.image} alt={sol.name} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-bone py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
          <div className="bg-white rounded-3xl p-8 lg:p-10 ring-1 ring-black/5">
            <h2 className="font-display text-2xl lg:text-3xl">Qué incluye en TCD Ortodoncia</h2>
            <ul className="mt-6 space-y-4">
              {sol.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-graphite/80">
                  <span className="w-6 h-6 rounded-full bg-amber/20 text-graphite grid place-items-center shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" /></span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {sol.slug === "apnea" && (
              <div className="mt-8 pt-8 border-t border-graphite/10 space-y-3">
                <p className="tag text-titanium">Protocolo clínico D.A.M.A. TCD®</p>
                <h3 className="font-display text-xl">Toma de registros y colocación</h3>
                <p className="text-sm text-graphite/65">
                  Enviamos junto con cada dispositivo D.A.M.A. TCD® y DDBG en nylon las pautas de ajuste protrusivo y control evolutivo para la clínica. Si necesitas asesoramiento en el registro de mordida constructiva, nuestro equipo técnico te guía paso a paso.
                </p>
              </div>
            )}
          </div>

          <aside className="bg-white rounded-3xl p-8 ring-1 ring-black/5 space-y-5">
            <h3 className="font-display text-xl">Especificaciones</h3>
            <dl className="divide-y divide-graphite/10 text-sm">
              {sol.specs.map(([k, v]) => (
                <div key={k} className="py-3 flex justify-between gap-4">
                  <dt className="text-graphite/55">{k}</dt>
                  <dd className="font-semibold text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <Link href={`/enviar-caso?aparato=${encodeURIComponent(sol.name)}`} className="btn btn-primary w-full justify-center">
              Enviar caso ahora<Arrow />
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
