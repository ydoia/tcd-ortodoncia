import Image from "next/image";
import Link from "next/link";
import { STATS } from "@/lib/data";
import { Arrow, Phone } from "@/components/Icons";

export default function NosotrosPage() {
  return (
    <>
      <section className="bg-graphite text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-tech opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="tag text-amber">Quiénes somos</p>
            <h1 className="font-display text-4xl lg:text-6xl mt-3 leading-[1.03]">Más de 35 años de oficio y tecnología ortodóntica.</h1>
            <p className="text-white/65 text-lg mt-5 leading-relaxed">
              Somos especialistas en ortodoncia de laboratorio, apnea, ATM y ortodoncia digital 3D. Nuestros esfuerzos van dirigidos a que cada doctor encuentre un soporte sólido y cercano que responda a los casos más exigentes, desde Santander, Las Palmas y Bilbao hacia España, Europa, Reino Unido y Canadá.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-[28px] overflow-hidden ring-1 ring-white/10">
            <Image src="/assets/tcd/TCD-Las-Palmas-001.jpeg" alt="Equipo humano de TCD Ortodoncia" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-bone py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white rounded-3xl p-7 ring-1 ring-black/5">
                <p className="font-display text-4xl lg:text-5xl">{s.value}{s.suffix}</p>
                <p className="text-graphite/55 text-sm mt-2">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden">
              <Image src="/assets/tcd/laboratorio-tcd.jpg" alt="Laboratorio TCD en Santander" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden">
              <Image src="/assets/tcd/11-foto-trabajando.jpg" alt="Técnicos especialistas en plena fabricación" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
            </div>
          </div>

          {/* Trabaja con nosotros */}
          <div id="empleo" className="bg-white rounded-[28px] p-8 lg:p-12 ring-1 ring-black/5 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <p className="tag text-titanium">Trabaja con nosotros</p>
              <h2 className="font-display text-3xl lg:text-4xl mt-3">¿Eres técnico dental especialista en ortodoncia o CAD/CAM?</h2>
              <p className="text-graphite/60 mt-3">
                Buscamos perfiles con experiencia en elaboración de aparatología y diseño digital para nuestros centros de producción de Santander y Las Palmas. Envíanos tu currículum directamente al laboratorio que te interese.
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-5 rounded-2xl bg-bone">
                <p className="font-display text-lg">TCD Santander</p>
                <a href="mailto:administracion@tcdortodoncia.com" className="text-amber font-semibold hover:underline block mt-1">administracion@tcdortodoncia.com</a>
                <a href="tel:+34942231236" suppressHydrationWarning className="text-graphite/60 flex items-center gap-1.5 mt-1"><Phone /><span suppressHydrationWarning>+34 942 23 12 36</span></a>
              </div>
              <div className="p-5 rounded-2xl bg-bone">
                <p className="font-display text-lg">TCD Las Palmas</p>
                <a href="mailto:administracionlaspalmas@tcdortodoncia.com" className="text-amber font-semibold hover:underline block mt-1">administracionlaspalmas@tcdortodoncia.com</a>
                <a href="tel:+34928272686" suppressHydrationWarning className="text-graphite/60 flex items-center gap-1.5 mt-1"><Phone /><span suppressHydrationWarning>+34 928 27 26 86</span></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
