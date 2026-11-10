import Image from "next/image";
import Link from "next/link";
import { Reveal, Counter } from "./Motion";
import FAQ from "./FAQ";
import { SOLUTIONS, SCANNERS, STATS, LABS, TESTIMONIALS } from "@/lib/data";
import { Arrow, Upload, Lock, Cube, Clock, Truck, Box, Headset, Shield, Phone, WhatsApp, File } from "./Icons";

export function ScannerMarquee() {
  const list = [...SCANNERS, ...SCANNERS];
  return (
    <section className="bg-graphite border-y border-white/[0.06] py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-8">
        <p className="hidden md:block shrink-0 text-white/40 text-xs uppercase tracking-[0.2em] leading-relaxed">Recibimos<br />archivos de</p>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-14">
            {list.map((s, i) => (<span key={i} className="font-display text-white/35 text-xl whitespace-nowrap hover:text-white transition-colors">{s}</span>))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function IntentSplit() {
  return (
    <section className="bg-bone py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-5">
        <Reveal>
          <Link href="/enviar-caso" className="group relative block h-full rounded-[28px] bg-graphite p-8 lg:p-10 overflow-hidden">
            <div className="absolute inset-0 grid-tech opacity-60" />
            <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-amber/20 blur-3xl group-hover:bg-amber/30 transition-colors" />
            <div className="relative">
              <span className="w-12 h-12 rounded-2xl bg-amber grid place-items-center text-graphite"><Upload /></span>
              <p className="tag text-amber mt-8">Soy una clínica nueva</p>
              <h2 className="font-display text-white text-3xl lg:text-4xl mt-3 leading-tight">Prueba TCD con tu primer caso</h2>
              <p className="text-white/55 mt-3 max-w-md">Sube el escaneado, elige el aparato y te llamamos para confirmar la prescripción. Sin altas largas ni compromiso.</p>
              <span className="mt-8 inline-flex items-center gap-2 text-amber font-semibold">Empezar en 2 minutos <Arrow className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
            </div>
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <Link href="/acceso" className="group relative block h-full rounded-[28px] bg-white p-8 lg:p-10 ring-1 ring-black/5 overflow-hidden">
            <div className="absolute inset-0 grid-tech-light" />
            <div className="relative">
              <span className="w-12 h-12 rounded-2xl bg-graphite grid place-items-center text-white"><Lock /></span>
              <p className="tag text-titanium mt-8">Ya soy cliente</p>
              <h2 className="font-display text-graphite text-3xl lg:text-4xl mt-3 leading-tight">Tu portal de clínica</h2>
              <p className="text-graphite/55 mt-3 max-w-md">Prescripciones, Aparatología general, Perfect Aligner, tarifas, descargas y recogidas en un solo sitio.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Enviar caso", "Perfect Aligner", "Tarifas", "Recogidas"].map((t) => (<span key={t} className="text-xs px-3 py-1.5 rounded-full bg-silver text-graphite/70">{t}</span>))}
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-graphite font-semibold">Entrar al portal <Arrow className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function Stats() {
  return (
    <section className="bg-bone pb-20 lg:pb-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 border-y border-graphite/10">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className={`py-10 px-2 lg:px-8 ${i % 2 ? "border-l" : "lg:border-l"} ${i === 0 ? "lg:border-l-0" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} border-graphite/10`}>
            <p className="font-display text-5xl lg:text-6xl font-semibold text-graphite"><Counter to={s.value} suffix={s.suffix} plain={s.value === 1997} /></p>
            <p className="text-graphite/55 mt-2 text-sm">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function SolutionsBento() {
  const [a, b, c, d, e] = SOLUTIONS;
  const Card = ({ s, className = "", big = false }: { s: typeof a; className?: string; big?: boolean }) => (
    <Link href={`/soluciones/${s.slug}`} className={`group relative rounded-[24px] overflow-hidden bg-steel min-h-[280px] flex flex-col justify-end ${className}`}>
      <Image src={s.image} alt={s.name} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/50 to-transparent" />
      <div className="relative p-7">
        <p className="text-amber text-xs font-semibold uppercase tracking-[0.18em]">{s.short}</p>
        <h3 className={`font-display text-white mt-2 leading-tight ${big ? "text-3xl lg:text-4xl" : "text-2xl"}`}>{s.name}</h3>
        <p className={`text-white/60 mt-2 text-sm max-w-md ${big ? "" : "line-clamp-2"}`}>{s.claim}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-white text-sm font-medium opacity-80 group-hover:opacity-100">Ver solución <Arrow className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
      </div>
    </Link>
  );
  return (
    <section className="bg-graphite py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 grid-tech opacity-50" />
      <div className="relative max-w-7xl mx-auto px-6">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <p className="tag text-amber">Soluciones</p>
            <h2 className="font-display text-white text-4xl lg:text-5xl mt-4 max-w-2xl leading-[1.05]">Todo lo que tu clínica necesita del laboratorio, en un solo proveedor.</h2>
          </div>
          <Link href="/catalogo" className="btn btn-ghost-dark self-start lg:self-auto">Catálogo completo<Arrow /></Link>
        </Reveal>
        <div className="grid lg:grid-cols-6 gap-4">
          <Reveal className="lg:col-span-4 lg:row-span-2 flex"><Card s={c} big className="flex-1 min-h-[420px] lg:min-h-[580px]" /></Reveal>
          <Reveal delay={0.05} className="lg:col-span-2 flex"><Card s={b} className="flex-1" /></Reveal>
          <Reveal delay={0.1} className="lg:col-span-2 flex"><Card s={d} className="flex-1" /></Reveal>
          <Reveal className="lg:col-span-3 flex"><Card s={a} className="flex-1" /></Reveal>
          <Reveal delay={0.05} className="lg:col-span-3 flex"><Card s={e} className="flex-1" /></Reveal>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  const steps = [
    { icon: <Cube />, t: "Escanea", d: "Desde cualquier escáner intraoral o con modelos físicos." },
    { icon: <File />, t: "Prescribe online", d: "Elige el aparato y adjunta STL, DICOM o fotos en 2 minutos." },
    { icon: <Clock />, t: "Fabricamos en 8 h", d: "Técnicos especialistas validan el diseño y lo producen." },
    { icon: <Truck />, t: "Recibes sin coste", d: "Empaquetado protegido y portes gratis en pedidos +50 €." },
  ];
  return (
    <section className="bg-bone py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="tag text-titanium justify-center">Cómo trabajamos</p>
          <h2 className="font-display text-4xl lg:text-5xl mt-4 leading-[1.05]">Del escáner a tu clínica en 4 pasos</h2>
        </Reveal>
        <div className="relative grid md:grid-cols-4 gap-8">
          <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-px bg-[repeating-linear-gradient(90deg,var(--color-titanium)_0_6px,transparent_6px_12px)] opacity-50" />
          {steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.1} className="relative text-center">
              <div className="relative mx-auto w-14 h-14 rounded-2xl bg-graphite text-amber grid place-items-center shadow-xl">
                {s.icon}
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber text-graphite text-xs font-bold grid place-items-center">{i + 1}</span>
              </div>
              <h3 className="font-display text-xl mt-6">{s.t}</h3>
              <p className="text-graphite/55 text-sm mt-2 max-w-[220px] mx-auto">{s.d}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-14 flex justify-center gap-3 flex-wrap">
          <Link href="/enviar-caso" className="btn btn-primary">Enviar caso ahora<Arrow /></Link>
          <Link href="/flujo-digital" className="btn btn-ghost">Ver flujo digital</Link>
        </Reveal>
      </div>
    </section>
  );
}

export function Advantages() {
  const items = [
    { icon: <Upload />, t: "Plataforma digital propia", d: "Prescripción personalizada y subida de archivos clínicos en un solo paso." },
    { icon: <Truck />, t: "Portes gratuitos", d: "Recogidas y entregas sin cargo en pedidos +50 € a Península y Canarias." },
    { icon: <Cube />, t: "Última tecnología", d: "Impresión 3D, 3Shape y las mejores marcas del sector." },
    { icon: <Clock />, t: "Rapidez real", d: "8 horas de producción para terminar un trabajo." },
    { icon: <Box />, t: "Empaquetado cuidadoso", d: "Protección y estuche de cada aparato sin coste adicional." },
    { icon: <Headset />, t: "Técnico de referencia", d: "Te atendemos personalmente en cada caso. Sin centralitas." },
  ];
  return (
    <section className="bg-white py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.9fr_1.4fr] gap-14">
        <Reveal>
          <p className="tag text-titanium">Por qué TCD</p>
          <h2 className="font-display text-4xl lg:text-5xl mt-4 leading-[1.05]">La relación laboratorio-clínica, bien hecha.</h2>
          <p className="text-graphite/55 mt-5 max-w-md">Más de 35 años formando y formándonos en las últimas tecnologías para que cada aparato llegue a tiempo, ajuste a la primera y tus pacientes lo noten.</p>
          <div className="relative mt-8 aspect-[4/3] rounded-3xl overflow-hidden">
            <Image src="/assets/tcd/laboratorio-tcd.jpg" alt="Equipo de técnicos del laboratorio TCD Ortodoncia en Santander" fill sizes="(min-width:1024px) 35vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-px bg-graphite/10 rounded-3xl overflow-hidden ring-1 ring-graphite/10 self-start">
          {items.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.05} className="bg-white p-8 group hover:bg-bone transition-colors">
              <span className="w-11 h-11 rounded-xl bg-silver text-graphite grid place-items-center group-hover:bg-amber transition-colors">{it.icon}</span>
              <h3 className="font-display text-lg mt-5">{it.t}</h3>
              <p className="text-graphite/55 text-sm mt-1.5">{it.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DamaFeature() {
  return (
    <section className="relative bg-black py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-tech opacity-40" />
      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative aspect-[16/11] rounded-[28px] overflow-hidden ring-1 ring-white/10">
            <Image src="/assets/tcd/IMG_9362-scaled.jpg" alt="Dispositivo de apnea DDBG en nylon diseñado digitalmente" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-6 left-6 right-6 sm:left-auto sm:w-[280px] card-dark bg-graphite/90 backdrop-blur-xl rounded-2xl p-5 glow-amber">
            <p className="text-amber text-xs font-mono tracking-widest">PATENTE</p>
            <p className="text-white font-display text-xl mt-1">D.A.M.A. TCD®</p>
            <p className="text-white/50 text-sm mt-1">Dispositivo de Avance Mandibular Ajustable</p>
          </div>
        </Reveal>
        <Reveal className="order-1 lg:order-2">
          <p className="tag text-amber">Apnea y ronquido</p>
          <h2 className="font-display text-white text-4xl lg:text-5xl mt-4 leading-[1.05]">Pioneros en apnea del sueño desde 1997.</h2>
          <p className="text-white/55 mt-5 text-lg">El SAHS afecta a alrededor del 4 % de los adultos. Diseñamos dispositivos intraorales a medida, con nuestra patente propia y el nuevo DDBG en nylon regulable en protrusión, 100 % digital.</p>
          <ul className="mt-8 space-y-3">
            {["Diseño digital desde escaneado intraoral", "Protrusión regulable y registro de avance preciso", "Protocolo de colocación para tu clínica"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-white/80"><Shield className="w-5 h-5 text-amber shrink-0" />{t}</li>
            ))}
          </ul>
          <Link href="/soluciones/apnea" className="btn btn-primary mt-10">Descubrir la solución de apnea<Arrow /></Link>
        </Reveal>
      </div>
    </section>
  );
}

export function LabsStrip() {
  return (
    <section className="bg-bone py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="tag text-titanium">Laboratorios</p>
            <h2 className="font-display text-4xl lg:text-5xl mt-4 leading-[1.05]">Cerca de ti, en tres sedes.</h2>
          </div>
          <Link href="/laboratorios" className="btn btn-ghost self-start md:self-auto">Ver laboratorios<Arrow /></Link>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {LABS.map((l, i) => (
            <Reveal key={l.id} delay={i * 0.08}>
              <div className="group bg-white rounded-3xl overflow-hidden ring-1 ring-black/5 h-full flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={l.image} alt={`TCD Ortodoncia ${l.city}`} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <span className="absolute top-4 left-4 text-xs font-semibold bg-white/90 backdrop-blur px-3 py-1.5 rounded-full">{l.role}</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-2xl">{l.city}</h3>
                  <p className="text-graphite/55 text-sm mt-1.5">{l.address}</p>
                  <p className="text-graphite/55 text-sm mt-3">{l.hours.map((h) => h.join(": ")).join(" · ")}</p>
                  <div className="mt-auto pt-6 flex gap-2">
                    <a href={`tel:${l.phone.replace(/\s/g, "")}`} className="btn btn-ghost !py-2.5 !px-4 text-sm flex-1 justify-center"><Phone />Llamar</a>
                    <a href={`https://wa.me/${l.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn !py-2.5 !px-4 text-sm flex-1 justify-center bg-[#25D366] text-white hover:brightness-95"><WhatsApp />WhatsApp</a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="bg-white py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-12">
          <p className="tag text-titanium">Clínicas que confían en TCD</p>
          <h2 className="font-display text-4xl lg:text-5xl mt-4 leading-[1.05]">Lo que dicen los doctores.</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="h-full rounded-3xl bg-bone p-8 flex flex-col ring-1 ring-black/5">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-amber" fill="currentColor"><path d="M10 7H6a3 3 0 0 0-3 3v4h4v4H3v-4m18-7h-4a3 3 0 0 0-3 3v4h4v4h-4v-4" /></svg>
                <blockquote className="mt-5 text-graphite/80 leading-relaxed flex-1">“{t.quote}”</blockquote>
                <figcaption className="mt-6 pt-6 border-t border-graphite/10">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-graphite/50">{t.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section className="bg-bone py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
        <Reveal>
          <p className="tag text-titanium">Preguntas frecuentes</p>
          <h2 className="font-display text-4xl lg:text-5xl mt-4 leading-[1.05]">Resolvemos tus dudas antes de empezar.</h2>
          <p className="text-graphite/55 mt-5">¿No encuentras la respuesta? Pregunta a TCD Assist o habla directamente con un técnico.</p>
          <a href="https://wa.me/34652481463" target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-8"><WhatsApp />Hablar con un técnico</a>
        </Reveal>
        <Reveal delay={0.1}><FAQ /></Reveal>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="relative bg-graphite py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-tech mask-fade" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber/15 blur-[120px] rounded-full" />
      <Reveal className="relative max-w-3xl mx-auto px-6 text-center">
        <p className="tag text-amber justify-center">Empieza hoy</p>
        <h2 className="font-display text-white text-4xl sm:text-5xl lg:text-6xl mt-5 leading-[1.02]">Tu próximo caso, fabricado con precisión TCD.</h2>
        <p className="text-white/55 mt-6 text-lg">Envíanos un caso de prueba. Si no es lo que esperas, no pasa nada. Si lo es, ya sabes dónde estamos.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/enviar-caso" className="btn btn-primary !px-8 !py-4 text-base"><Upload className="w-5 h-5" />Enviar mi primer caso</Link>
          <Link href="/contacto" className="btn btn-ghost-dark !px-8 !py-4 text-base">Hablar con el laboratorio</Link>
        </div>
      </Reveal>
    </section>
  );
}
