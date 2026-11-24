"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LABS, PLATFORMS } from "@/lib/data";
import { Lock, Upload, File, Truck, Arrow, Check, Phone, WhatsApp, Cube } from "@/components/Icons";

function PortalContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("modo") === "alta" ? "alta" : "login";

  const [tab, setTab] = useState<"login" | "alta">(initialTab);
  const [selectedCity, setSelectedCity] = useState<"santander" | "las-palmas">("santander");
  const [loggedIn, setLoggedIn] = useState(false);
  const [registered, setRegistered] = useState(false);

  const activeLab = LABS.find((l) => l.id === selectedCity) || LABS[0];

  return (
    <div className="space-y-12">
      {/* Selector superior de sede (Santander / Las Palmas) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-steel/70 border border-white/10 rounded-3xl p-6">
        <div>
          <p className="text-amber text-xs font-semibold uppercase tracking-[0.2em]">1. Selecciona tu centro de producción</p>
          <p className="text-white/60 text-sm mt-1">Conecta con los técnicos y la plataforma de tu laboratorio asignado.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["santander", "las-palmas"] as const).map((id) => {
            const l = LABS.find((x) => x.id === id)!;
            const active = selectedCity === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedCity(id)}
                className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2.5 ${active ? "bg-amber text-graphite shadow-lg" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
              >
                <span className={`w-2 h-2 rounded-full ${active ? "bg-graphite" : "bg-emerald-400"}`} />
                TCD {l.city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accesos directos unificados (sustituyen las antiguas /plataformas/ y /clientes/) */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="card-dark rounded-3xl p-7 flex flex-col">
          <span className="w-11 h-11 rounded-2xl bg-amber/15 text-amber grid place-items-center"><Cube /></span>
          <p className="text-xs uppercase tracking-widest text-amber mt-5 font-semibold">Plataforma 01 · {activeLab.city}</p>
          <h2 className="font-display text-white text-2xl mt-1">Aparatología General</h2>
          <p className="text-white/55 text-sm mt-2 flex-1">
            Subida de archivos STL, DICOM, fotografías y prescripción para aparatología fija, removible, MARPE y apnea.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={PLATFORMS.general} target="_blank" rel="noopener noreferrer" className="btn btn-primary !py-2.5 !px-4 text-sm">
              Entrar a plataforma<Arrow />
            </a>
            <Link href="/enviar-caso" className="btn btn-ghost-dark !py-2.5 !px-4 text-sm">
              Enviar caso rápido
            </Link>
          </div>
        </div>

        <div className="card-dark rounded-3xl p-7 flex flex-col">
          <span className="w-11 h-11 rounded-2xl bg-amber/15 text-amber grid place-items-center"><Upload /></span>
          <p className="text-xs uppercase tracking-widest text-amber mt-5 font-semibold">Plataforma 02 · Alineadores</p>
          <h2 className="font-display text-white text-2xl mt-1">Perfect Aligner</h2>
          <p className="text-white/55 text-sm mt-2 flex-1">
            Planificación de tratamientos de ortodoncia invisible, revisión de setups 3D y seguimiento de casos con nuestra marca aliada.
          </p>
          <div className="mt-6">
            <a href={PLATFORMS.perfectAligner} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark !py-2.5 !px-4 text-sm">
              Abrir Perfect Aligner<Arrow />
            </a>
          </div>
        </div>

        <div className="card-dark rounded-3xl p-7 flex flex-col">
          <span className="w-11 h-11 rounded-2xl bg-amber/15 text-amber grid place-items-center"><File /></span>
          <p className="text-xs uppercase tracking-widest text-amber mt-5 font-semibold">Descargas clínicas</p>
          <h2 className="font-display text-white text-2xl mt-1">Hoja de prescripción</h2>
          <p className="text-white/55 text-sm mt-2 flex-1">
            ¿Envías modelos físicos? Descarga nuestra hoja de prescripción unificada para adjuntarla en la caja de transporte.
          </p>
          <div className="mt-6">
            <Link href="/enviar-caso?tipo=recogida" className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors">
              <span>Descargar Hoja Unificada</span><Arrow className="w-4 h-4 text-amber" />
            </Link>
          </div>
        </div>
      </div>

      {/* Área de cuenta limpia para doctores: Iniciar sesión / Solicitar alta */}
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
        <div className="bg-white text-graphite rounded-[28px] p-7 sm:p-10">
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-bone mb-8">
            {[
              ["login", "Iniciar sesión"],
              ["alta", "Solicitar alta (ver tarifas)"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => { setTab(id as "login" | "alta"); setLoggedIn(false); }}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${tab === id ? "bg-graphite text-white shadow" : "text-graphite/60 hover:text-graphite"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "login" && (
            loggedIn ? (
              <div className="py-6 text-center space-y-4">
                <span className="w-14 h-14 rounded-2xl bg-emerald-500 text-white grid place-items-center mx-auto"><Check className="w-7 h-7" /></span>
                <h3 className="font-display text-2xl">Sesión iniciada (Demo)</h3>
                <p className="text-graphite/60 text-sm max-w-md mx-auto">
                  En producción, estas mismas credenciales unifican tu acceso al catálogo con tarifas privadas y a la plataforma de <strong>TCD {activeLab.city}</strong>.
                </p>
                <Link href="/catalogo" className="btn btn-primary">Ir al catálogo</Link>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setLoggedIn(true); }} className="space-y-5">
                <div>
                  <h3 className="font-display text-2xl">Acceso unificado para clínicas</h3>
                  <p className="text-graphite/60 text-sm mt-1">
                    Introduce tus credenciales de clínica para consultar tarifas privadas, protocolos y casos en <strong>TCD {activeLab.city}</strong>.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Usuario o correo de la clínica</label>
                  <input required placeholder="clinica@ejemplo.com" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Contraseña</label>
                  <input required type="password" placeholder="••••••••" className="input" />
                </div>
                <div className="flex items-center justify-between text-xs text-graphite/60">
                  <label className="flex items-center gap-2"><input type="checkbox" defaultChecked />Recordar mi sesión</label>
                  <button type="button" onClick={() => setTab("alta")} className="text-amber font-semibold hover:underline">¿No tienes cuenta? Solicitar alta</button>
                </div>
                <button type="submit" className="btn btn-primary w-full justify-center">
                  <Lock className="w-4 h-4" />Entrar al área privada
                </button>
              </form>
            )
          )}

          {tab === "alta" && (
            registered ? (
              <div className="py-6 text-center space-y-4">
                <span className="w-14 h-14 rounded-2xl bg-emerald-500 text-white grid place-items-center mx-auto"><Check className="w-7 h-7" /></span>
                <h3 className="font-display text-2xl">Solicitud de alta recibida</h3>
                <p className="text-graphite/60 text-sm max-w-md mx-auto">
                  Validaremos tu nº de colegiado y clínica desde administración. Una vez autorizada la cuenta, verás las tarifas completas en tu portal.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setRegistered(true); }} className="space-y-4">
                <div>
                  <h3 className="font-display text-2xl">Registro de nueva clínica</h3>
                  <p className="text-graphite/60 text-sm mt-1">Exclusivo para profesionales odontólogos. Las tarifas se desbloquean tras validación del administrador.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold mb-1">Clínica dental *</label><input required className="input" placeholder="Nombre de la clínica" /></div>
                  <div><label className="block text-xs font-semibold mb-1">Doctor/a responsable *</label><input required className="input" placeholder="Dr. / Dra. ..." /></div>
                  <div><label className="block text-xs font-semibold mb-1">DNI / NIF *</label><input required className="input" placeholder="12345678A" /></div>
                  <div><label className="block text-xs font-semibold mb-1">Nº de colegiado *</label><input required className="input" placeholder="Ej. 39001234" /></div>
                  <div><label className="block text-xs font-semibold mb-1">Correo profesional *</label><input required type="email" className="input" placeholder="doctor@clinica.com" /></div>
                  <div><label className="block text-xs font-semibold mb-1">Teléfono *</label><input required type="tel" className="input" placeholder="+34 600 000 000" /></div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1">Laboratorio asignado</label>
                    <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value as "santander" | "las-palmas")} className="input">
                      <option value="santander">TCD Santander (Península y Europa)</option>
                      <option value="las-palmas">TCD Las Palmas (Canarias)</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-full justify-center">Solicitar alta y acceso a tarifas<Arrow /></button>
              </form>
            )
          )}
        </div>

        {/* Contacto directo de la sede elegida */}
        <aside className="card-dark rounded-[28px] p-7 space-y-5">
          <p className="tag text-amber">Tu laboratorio seleccionado</p>
          <h3 className="font-display text-white text-3xl">TCD {activeLab.city}</h3>
          <p className="text-white/60 text-sm">{activeLab.address}</p>
          <div className="space-y-1 text-sm text-white/70">
            {activeLab.hours.map(([d, h]) => (
              <p key={d}><span className="text-white/40">{d}:</span> {h}</p>
            ))}
          </div>
          <div className="pt-4 border-t border-white/10 grid gap-2.5">
            <a href={`tel:${activeLab.phone.replace(/\s/g, "")}`} suppressHydrationWarning className="btn btn-ghost-dark justify-center text-sm"><Phone /><span suppressHydrationWarning>{activeLab.phone}</span></a>
            <a href={`https://wa.me/${activeLab.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn justify-center text-sm bg-[#25D366] text-white"><WhatsApp />WhatsApp directo {activeLab.city}</a>
            <Link href="/enviar-caso?tipo=recogida" className="btn btn-ghost-dark justify-center text-sm"><Truck className="w-4 h-4" />Solicitar recogida gratuita</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function AccesoPage() {
  return (
    <section className="bg-graphite text-white py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-tech opacity-50" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-10">
          <p className="tag text-amber">Área de clientes y plataformas</p>
          <h1 className="font-display text-4xl lg:text-5xl mt-3 leading-[1.05]">Portal de clínicas TCD</h1>
          <p className="text-white/60 mt-3">Unificamos tus plataformas digitales, hoja de prescripción, tarifas validadas y contacto directo con Santander y Las Palmas.</p>
        </div>
        <Suspense fallback={<div className="card-dark rounded-3xl p-12 text-center">Cargando portal…</div>}>
          <PortalContent />
        </Suspense>
      </div>
    </section>
  );
}
