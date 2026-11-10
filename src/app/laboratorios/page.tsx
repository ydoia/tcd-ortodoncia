import Image from "next/image";
import Link from "next/link";
import { LABS } from "@/lib/data";
import { Phone, WhatsApp, Pin, Truck } from "@/components/Icons";

export default function LaboratoriosPage() {
  return (
    <section className="bg-bone py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="max-w-2xl">
          <p className="tag text-titanium">Centros de trabajo</p>
          <h1 className="font-display text-4xl lg:text-5xl mt-3 leading-[1.05]">Santander, Las Palmas y Bilbao</h1>
          <p className="text-graphite/60 mt-3">
            Suministramos a clínicas y hospitales de toda España, Europa, Reino Unido y Canadá. Recogidas y entregas gratuitas en pedidos superiores a 50 € en Península y Canarias.
          </p>
        </div>

        <div className="space-y-8">
          {LABS.map((l) => (
            <div key={l.id} className="bg-white rounded-[28px] overflow-hidden ring-1 ring-black/5 grid lg:grid-cols-[1fr_1.1fr]">
              <div className="p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber bg-graphite px-3 py-1 rounded-full">{l.role}</span>
                  <h2 className="font-display text-3xl lg:text-4xl mt-4">TCD {l.city}</h2>
                  <p className="text-graphite/65 text-sm mt-3 flex items-start gap-2"><Pin className="w-4 h-4 shrink-0 mt-0.5" />{l.address}</p>
                  <div className="mt-5 space-y-1 text-sm text-graphite/70">
                    {l.hours.map(([d, h]) => (
                      <p key={d}><strong className="text-graphite">{d}:</strong> {h}</p>
                    ))}
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-graphite/10 flex flex-wrap gap-2.5">
                  <a href={`tel:${l.phone.replace(/\s/g, "")}`} suppressHydrationWarning className="btn btn-ghost !py-2.5 !px-4 text-sm"><Phone /><span suppressHydrationWarning>{l.phone}</span></a>
                  {l.mobile && <a href={`tel:${l.mobile.replace(/\s/g, "")}`} suppressHydrationWarning className="btn btn-ghost !py-2.5 !px-4 text-sm"><Phone /><span suppressHydrationWarning>{l.mobile}</span></a>}
                  <a href={`https://wa.me/${l.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn !py-2.5 !px-4 text-sm bg-[#25D366] text-white"><WhatsApp />WhatsApp</a>
                  <Link href="/enviar-caso?tipo=recogida" className="btn btn-primary !py-2.5 !px-4 text-sm"><Truck className="w-4 h-4" />Pedir recogida</Link>
                </div>
              </div>
              <div className="relative min-h-[260px] lg:min-h-full">
                <Image src={l.image} alt={`Laboratorio TCD ${l.city}`} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
