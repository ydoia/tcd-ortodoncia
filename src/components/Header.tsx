"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Logo from "./Logo";
import { SOLUTIONS, LABS } from "@/lib/data";
import { Arrow, Lock, Menu, X, Phone, Upload } from "./Icons";

const NAV = [
  { href: "/soluciones", label: "Soluciones", mega: true },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/flujo-digital", label: "Flujo digital" },
  { href: "/laboratorios", label: "Laboratorios" },
  { href: "/formacion", label: "Formación" },
  { href: "/nosotros", label: "Nosotros" },
];

export default function Header() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { setOpen(false); setMega(false); }, [path]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  return (
    <>
      {/* Top bar */}
      <div className="hidden lg:block bg-black text-white/60 text-[12px]">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between">
          <div className="flex gap-6">
            {LABS.map((l) => (
              <a key={l.id} href={`tel:${l.phone.replace(/\s/g, "")}`} suppressHydrationWarning className="hover:text-amber transition-colors flex items-center gap-1.5">
                <span className="text-white/35">{l.city}</span> <span suppressHydrationWarning>{l.phone}</span>
              </a>
            ))}
          </div>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Portes gratis Península y Canarias en pedidos +50 €</span>
        </div>
      </div>

      <header
        onMouseLeave={() => setMega(false)}
        className={`sticky top-0 z-50 transition-all duration-500 ${scrolled || mega ? "bg-graphite/90 backdrop-blur-xl border-b border-white/[0.06]" : "bg-graphite border-b border-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between gap-6">
          <Logo />
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => {
              const active = path.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onMouseEnter={() => setMega(!!n.mega)}
                  className={`relative px-3.5 py-2 text-[14px] rounded-full transition-colors ${active ? "text-white" : "text-white/60 hover:text-white"}`}
                >
                  {n.label}
                  {active && <motion.span layoutId="nav-dot" className="absolute left-1/2 -bottom-0.5 w-1 h-1 -translate-x-1/2 rounded-full bg-amber" />}
                </Link>
              );
            })}
          </nav>
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/acceso" className="btn btn-ghost-dark !py-2.5 !px-4 text-sm"><Lock className="w-4 h-4" />Acceso clínicas</Link>
            <Link href="/enviar-caso" className="btn btn-primary !py-2.5 !px-5 text-sm">Enviar caso<Arrow /></Link>
          </div>
          <button onClick={() => setOpen(true)} className="lg:hidden text-white p-2 -mr-2" aria-label="Abrir menú"><Menu /></button>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {mega && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
              className="hidden lg:block absolute inset-x-0 top-full bg-graphite/95 backdrop-blur-xl border-b border-white/[0.06]"
            >
              <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-[1fr_320px] gap-10">
                <div className="grid grid-cols-2 gap-2">
                  {SOLUTIONS.map((s) => (
                    <Link key={s.slug} href={`/soluciones/${s.slug}`} className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/[0.04] transition-colors">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/10">
                        <Image src={s.image} alt="" fill sizes="64px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-[15px] group-hover:text-amber transition-colors">{s.name}</p>
                        <p className="text-white/45 text-[13px]">{s.short}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="card-dark rounded-3xl p-6 flex flex-col">
                  <p className="tag text-amber mb-3">Nuevo cliente</p>
                  <p className="font-display text-white text-xl leading-tight mb-2">Envía tu primer caso y conoce nuestro estándar.</p>
                  <p className="text-white/50 text-sm mb-6">Sube el STL desde cualquier escáner. Te llamamos para confirmar la prescripción.</p>
                  <Link href="/enviar-caso" className="btn btn-primary mt-auto self-start !py-2.5 text-sm"><Upload className="w-4 h-4" />Enviar caso</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-graphite lg:hidden flex flex-col">
            <div className="h-[72px] px-6 flex items-center justify-between border-b border-white/[0.06]">
              <Logo />
              <button onClick={() => setOpen(false)} className="text-white p-2 -mr-2" aria-label="Cerrar menú"><X className="w-6 h-6" /></button>
            </div>
            <nav className="flex-1 overflow-y-auto px-6 py-6">
              {NAV.map((n, i) => (
                <motion.div key={n.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <Link href={n.href} className="flex items-center justify-between py-4 border-b border-white/[0.06] text-white font-display text-2xl">
                    {n.label}<Arrow className="w-5 h-5 text-white/30" />
                  </Link>
                </motion.div>
              ))}
              <Link href="/contacto" className="flex items-center justify-between py-4 text-white font-display text-2xl">Contacto<Arrow className="w-5 h-5 text-white/30" /></Link>
            </nav>
            <div className="p-6 grid gap-3 border-t border-white/[0.06]">
              <Link href="/enviar-caso" className="btn btn-primary justify-center">Enviar caso<Arrow /></Link>
              <Link href="/acceso" className="btn btn-ghost-dark justify-center"><Lock className="w-4 h-4" />Acceso clínicas</Link>
              <a href="tel:+34942231236" className="text-white/50 text-sm flex items-center justify-center gap-2 pt-2"><Phone />942 23 12 36</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
