"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LABS, PLATFORMS, PRODUCTS } from "@/lib/data";
import { Lock, Upload, File, Truck, Arrow, Check, Phone, WhatsApp, Cube } from "@/components/Icons";

function PortalContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("modo") === "alta" ? "alta" : "login";

  const [tab, setTab] = useState<"login" | "alta" | "demo">(initialTab);
  const [selectedCity, setSelectedCity] = useState<"santander" | "las-palmas">("santander");
  const [registered, setRegistered] = useState(false);

  const activeLab = LABS.find((l) => l.id === selectedCity) || LABS[0];

  return (
    <div className="space-y-12">
      {/* Selector superior de sede (Santander / Las Palmas) + conmutador de vista */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-steel/70 border border-white/10 rounded-3xl p-6">
        <div>
          <p className="text-amber text-xs font-semibold uppercase tracking-[0.2em]">1. Selecciona tu centro de trabajo</p>
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

      {/* Accesos directos a Plataformas (lo que antes estaba en /plataformas/ y /clientes/) */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="card-dark rounded-3xl p-7 flex flex-col">
          <span className="w-11 h-11 rounded-2xl bg-amber/15 text-amber grid place-items-center"><Cube /></span>
          <p className="text-xs uppercase tracking-widest text-amber mt-5 font-semibold">Plataforma 01 · {activeLab.city}</p>
          <h2 className="font-display text-white text-2xl mt-1">Aparatología General</h2>
          <p className="text-white/55 text-sm mt-2 flex-1">
            Subida de archivos STL, DICOM, fotografías y prescripción digital para aparatología fija, removible, MARPE, lingual y apnea.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={PLATFORMS.general} target="_blank" rel="noopener noreferrer" className="btn btn-primary !py-2.5 !px-4 text-sm">
              Entrar a plataforma<Arrow />
            </a>
            <Link href="/enviar-caso" className="btn btn-ghost-dark !py-2.5 !px-4 text-sm">
              Prescripción rápida
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
          <p className="text-xs uppercase tracking-widest text-amber mt-5 font-semibold">Descargas públicas</p>
          <h2 className="font-display text-white text-2xl mt-1">Hojas de prescripción</h2>
          <p className="text-white/55 text-sm mt-2 flex-1">
            ¿Envías modelos físicos? Descarga las hojas oficiales de prescripción para adjuntar en la caja de transporte.
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <Link href="/enviar-caso?tipo=recogida" className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
              <span>Hoja Aparatología General</span><Arrow className="w-4 h-4 text-amber" />
            </Link>
            <Link href="/enviar-caso?aparato=Cubetas%20de%20cementado%20indirecto" className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
              <span>Hoja Ortodoncia Lingual</span><Arrow className="w-4 h-4 text-amber" />
            </Link>
          </div>
        </div>
      </div>

      {/* Área de cuenta: Login / Alta de clínica / Vista previa del portal */}
      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
        <div className="bg-white text-graphite rounded-[28px] p-7 sm:p-10">
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-bone mb-8">
            {[
              ["login", "Iniciar sesión"],
              ["alta", "Darme de alta (ver tarifas)"],
              ["demo", "Ver portal por dentro (Demo)"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id as "login" | "alta" | "demo")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${tab === id ? "bg-graphite text-white shadow" : "text-graphite/60 hover:text-graphite"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "login" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTab("demo");
              }}
              className="space-y-5"
            >
              <div>
                <h3 className="font-display text-2xl">Acceso para clínicas registradas</h3>
                <p className="text-graphite/60 text-sm mt-1">
                  Consulta la lista completa de precios, el protocolo de apnea D.A.M.A. TCD® y el histórico de tus pedidos en <strong>TCD {activeLab.city}</strong>.
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
          )}

          {tab === "alta" && (
            registered ? (
              <div className="py-6 text-center space-y-4">
                <span className="w-14 h-14 rounded-2xl bg-emerald-500 text-white grid place-items-center mx-auto"><Check className="w-7 h-7" /></span>
                <h3 className="font-display text-2xl">Solicitud de alta enviada</h3>
                <p className="text-graphite/60 text-sm max-w-md mx-auto">
                  Nuestro administrador validará tu clínica en unas horas y recibirás por correo tus claves para consultar las tarifas y el área privada de Apnea.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setRegistered(true); }} className="space-y-4">
                <div>
                  <h3 className="font-display text-2xl">Alta de nueva clínica</h3>
                  <p className="text-graphite/60 text-sm mt-1">Regístrate para acceder a la lista de precios de todos los productos y a la documentación exclusiva.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold mb-1">Clínica dental *</label><input required className="input" placeholder="Nombre de la clínica" /></div>
                  <div><label className="block text-xs font-semibold mb-1">Doctor/a / Colegiado *</label><input required className="input" placeholder="Nombre y nº colegiado" /></div>
                  <div><label className="block text-xs font-semibold mb-1">Correo profesional *</label><input required type="email" className="input" placeholder="doctor@clinica.com" /></div>
                  <div><label className="block text-xs font-semibold mb-1">Teléfono *</label><input required type="tel" className="input" placeholder="+34 600 000 000" /></div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1">Laboratorio de referencia</label>
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

          {tab === "demo" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Sesión activa · TCD {activeLab.city}</span>
                  <h3 className="font-display text-2xl">Panel de clínica</h3>
                </div>
                <Link href="/enviar-caso" className="btn btn-primary !py-2 !px-4 text-xs">+ Nuevo caso</Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <div className="p-4 rounded-2xl bg-bone"><p className="text-xs text-graphite/50">Casos en curso</p><p className="font-display text-2xl mt-1">2 activos</p></div>
                <div className="p-4 rounded-2xl bg-bone"><p className="text-xs text-graphite/50">Tiempo medio</p><p className="font-display text-2xl mt-1">8 h prod.</p></div>
                <div className="p-4 rounded-2xl bg-bone"><p className="text-xs text-graphite/50">Portes</p><p className="font-display text-2xl mt-1 text-emerald-600">Bonificados</p></div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-titanium mb-2">Tarifa rápida de referencia (clínica verificada)</p>
                <div className="divide-y divide-graphite/10 border rounded-2xl border-graphite/10 max-h-56 overflow-y-auto text-sm">
                  {PRODUCTS.slice(0, 8).map((p) => (
                    <div key={p.name} className="px-4 py-2.5 flex items-center justify-between">
                      <div><p className="font-medium">{p.name}</p><p className="text-xs text-graphite/50">{p.cat} · Plazo {p.days}</p></div>
                      <Link href={`/enviar-caso?aparato=${encodeURIComponent(p.name)}`} className="text-xs font-semibold text-amber hover:underline">Prescribir →</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
          <p className="text-white/60 mt-3">Unificamos tus plataformas digitales, hojas de prescripción, tarifas y contacto con Santander y Las Palmas en un único espacio.</p>
        </div>
        <Suspense fallback={<div className="card-dark rounded-3xl p-12 text-center">Cargando portal…</div>}>
          <PortalContent />
        </Suspense>
      </div>
    </section>
  );
}
