import Link from "next/link";
import Logo from "./Logo";
import { LABS, SOLUTIONS } from "@/lib/data";
import { Arrow, Phone, Pin } from "./Icons";

export default function Footer() {
  return (
    <footer className="bg-black text-white/60 pb-24 lg:pb-0">
      {/* Pre-footer CTA */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-display text-white text-2xl md:text-3xl">¿Tienes un caso encima de la mesa?</p>
            <p className="text-white/50 mt-1">Envíalo hoy. Lo revisamos y te confirmamos plazo en menos de 2 horas laborables.</p>
          </div>
          <Link href="/enviar-caso" className="btn btn-primary shrink-0">Enviar caso<Arrow /></Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.6fr]">
        <div>
          <Logo />
          <p className="mt-5 text-sm leading-relaxed max-w-xs">Laboratorio especialista en ortodoncia, apnea, ATM y ortodoncia digital 3D. Más de 35 años al lado de las clínicas.</p>
          <div className="flex gap-3 mt-6 text-sm">
            {[["LinkedIn", "https://linkedin.com/company/tcd-ortodoncia"], ["Facebook", "https://www.facebook.com/TCDORTO/"], ["YouTube", "https://www.youtube.com/channel/UCaMY_sFyJD5FtFuhrvH6hBQ"], ["Vimeo", "https://vimeo.com/user102517318"]].map(([n, h]) => (
              <a key={n} href={h} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full border border-white/10 hover:border-amber hover:text-amber transition-colors text-xs">{n}</a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-white text-sm font-semibold mb-4">Soluciones</p>
          <ul className="space-y-2.5 text-sm">
            {SOLUTIONS.map((s) => (<li key={s.slug}><Link href={`/soluciones/${s.slug}`} className="hover:text-white transition-colors">{s.name}</Link></li>))}
          </ul>
        </div>
        <div>
          <p className="text-white text-sm font-semibold mb-4">TCD</p>
          <ul className="space-y-2.5 text-sm">
            {[["Catálogo", "/catalogo"], ["Flujo digital", "/flujo-digital"], ["Formación y noticias", "/formacion"], ["Nosotros", "/nosotros"], ["Trabaja con nosotros", "/nosotros#empleo"], ["Acceso clínicas", "/acceso"], ["Contacto", "/contacto"]].map(([l, h]) => (
              <li key={h}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-5">
          {LABS.map((l) => (
            <div key={l.id} className="text-sm">
              <p className="text-white font-medium">{l.city} <span className="text-white/35 font-normal">· {l.role}</span></p>
              <p className="flex gap-2 mt-1"><Pin className="w-4 h-4 mt-0.5 shrink-0 text-white/30" />{l.address}</p>
              <a href={`tel:${l.phone.replace(/\s/g, "")}`} suppressHydrationWarning className="flex gap-2 mt-1 hover:text-amber"><Phone className="w-4 h-4 text-white/30" /><span suppressHydrationWarning>{l.phone}</span></a>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-white/35">
          <p>© {new Date().getFullYear()} SIKKER SVAR S.L. · TCD Ortodoncia</p>
          <div className="flex gap-5">
            <Link href="/legal/privacidad" className="hover:text-white">Privacidad</Link>
            <Link href="/legal/cookies" className="hover:text-white">Cookies</Link>
            <Link href="/legal/aviso-legal" className="hover:text-white">Aviso legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
