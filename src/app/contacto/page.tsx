"use client";
import { useState } from "react";
import { LABS } from "@/lib/data";
import { Phone, WhatsApp, Pin, Check, Arrow } from "@/components/Icons";

export default function ContactoPage() {
  const [sent, setSent] = useState(false);
  const [lab, setLab] = useState("TCD Santander");

  return (
    <section className="bg-bone py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
        <div className="bg-white rounded-[28px] p-8 lg:p-10 ring-1 ring-black/5">
          <p className="tag text-titanium">Contacto directo</p>
          <h1 className="font-display text-4xl mt-3">Habla con nuestro laboratorio</h1>
          <p className="text-graphite/60 text-sm mt-2">Selecciona el centro TCD y te responderá directamente nuestro equipo técnico o de administración.</p>

          {sent ? (
            <div className="py-12 text-center space-y-3">
              <span className="w-14 h-14 rounded-2xl bg-emerald-500 text-white grid place-items-center mx-auto"><Check className="w-7 h-7" /></span>
              <h2 className="font-display text-2xl">Mensaje enviado a {lab}</h2>
              <p className="text-graphite/60 text-sm">Te responderemos en horario de laboratorio.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-8 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold mb-1.5">Nombre y apellidos *</label><input required className="input" placeholder="Dr. / Dra. ..." /></div>
                <div><label className="block text-xs font-semibold mb-1.5">Clínica dental</label><input className="input" placeholder="Nombre de la clínica" /></div>
                <div><label className="block text-xs font-semibold mb-1.5">Correo electrónico *</label><input required type="email" className="input" placeholder="correo@clinica.com" /></div>
                <div><label className="block text-xs font-semibold mb-1.5">Teléfono *</label><input required type="tel" className="input" placeholder="+34 600 000 000" /></div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Elige laboratorio</label>
                <select value={lab} onChange={(e) => setLab(e.target.value)} className="input">
                  <option>TCD Santander</option>
                  <option>TCD Las Palmas</option>
                  <option>TCD Bilbao</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Mensaje *</label>
                <textarea required rows={4} className="input" placeholder="¿En qué podemos ayudarte?" />
              </div>
              <label className="flex items-start gap-2.5 text-xs text-graphite/60">
                <input required type="checkbox" className="mt-1" />
                <span>He leído y acepto la Política de privacidad. Responsable: SIKKER SVAR S.L. (TCD Ortodoncia). Finalidad: atender la solicitud y su seguimiento.</span>
              </label>
              <button type="submit" className="btn btn-primary">Enviar mensaje<Arrow /></button>
            </form>
          )}
        </div>

        <aside className="space-y-4">
          {LABS.map((l) => (
            <div key={l.id} className="bg-white rounded-3xl p-6 ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl">TCD {l.city}</h2>
                <span className="text-xs font-semibold text-graphite/50">{l.role}</span>
              </div>
              <p className="text-graphite/60 text-sm mt-2 flex items-start gap-2"><Pin className="w-4 h-4 shrink-0 mt-0.5" />{l.address}</p>
              <p className="text-graphite/55 text-xs mt-2">{l.hours.map((h) => h.join(": ")).join(" · ")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`tel:${l.phone.replace(/\s/g, "")}`} suppressHydrationWarning className="btn btn-ghost !py-2 !px-3.5 text-xs"><Phone /><span suppressHydrationWarning>{l.phone}</span></a>
                <a href={`https://wa.me/${l.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn !py-2 !px-3.5 text-xs bg-[#25D366] text-white"><WhatsApp />WhatsApp</a>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
