"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Upload, Phone, WhatsApp } from "./Icons";

export default function MobileBar() {
  const path = usePathname();
  if (path.startsWith("/portal") || path.startsWith("/acceso")) return null;
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(12px,env(safe-area-inset-bottom))] bg-gradient-to-t from-black/70 to-transparent">
      <div className="grid grid-cols-[1fr_auto_auto] gap-2 bg-graphite/95 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-2xl">
        <Link href="/enviar-caso" className="btn btn-primary justify-center !py-3 text-sm"><Upload className="w-4 h-4" />Enviar caso</Link>
        <a href="https://wa.me/34652481463" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-12 grid place-items-center rounded-full bg-[#25D366] text-white"><WhatsApp className="w-5 h-5" /></a>
        <a href="tel:+34942231236" aria-label="Llamar" className="w-12 grid place-items-center rounded-full bg-white/10 text-white"><Phone className="w-5 h-5" /></a>
      </div>
    </div>
  );
}
