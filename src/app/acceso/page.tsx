"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LABS, PLATFORMS, PRODUCTS } from "@/lib/data";
import { Lock, Upload, File, Truck, Arrow, Check, Phone, WhatsApp, Cube, Plus, Grad, Spark } from "@/components/Icons";

type PostItem = { id: string; tag: string; date: string; title: string; desc: string };
type AutoNews = { id: string; source: string; title: string; summary: string };
type PendingClinic = { id: string; clinic: string; doctor: string; dni: string; colegiado: string; lab: string; approved: boolean };

const INITIAL_POSTS: PostItem[] = [
  { id: "p1", tag: "Formación", date: "Próxima convocatoria", title: "Taller práctico de flujo digital y MARPE sobre microtornillos", desc: "Sesión clínica presencial y online para equipos de ortodoncia." },
  { id: "p2", tag: "Novedad", date: "Noviembre 2026", title: "Cementado indirecto y directo 3D con cubetas impresas", desc: "Guías de inserción de alta precisión compatibles con 3M APC Flash-Free." },
];

const INITIAL_AUTO: AutoNews[] = [
  { id: "a1", source: "PubMed / Ortodoncia Clínica", title: "Precisión comparativa en férulas quirúrgicas 3D para microimplantes palatinos", summary: "Revisión clínica de estabilidad primaria en protocolos MARPE guiados por CBCT." },
  { id: "a2", source: "Sleep Medicine Reviews", title: "Eficacia a largo plazo de los dispositivos de avance mandibular (DAM) regulables", summary: "Estudio multicéntrico sobre adherencia del paciente en SAHS leve y moderado." },
];

const INITIAL_CLINICS: PendingClinic[] = [
  { id: "c1", clinic: "Clínica Dental Bahía", doctor: "Dra. Elena Ruiz", dni: "72091843K", colegiado: "39001482", lab: "Santander", approved: false },
  { id: "c2", clinic: "Ortodoncia Atlántico", doctor: "Dr. Marcos León", dni: "43812055M", colegiado: "35002190", lab: "Las Palmas", approved: true },
];

function PortalContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("modo") === "alta" ? "alta" : "login";

  const [tab, setTab] = useState<"login" | "alta" | "demo" | "admin">(initialTab);
  const [selectedCity, setSelectedCity] = useState<"santander" | "las-palmas">("santander");
  const [registered, setRegistered] = useState(false);

  // Estado del Panel Admin (Editor visual Formación/Noticias + Aprobación + Validación de tarifas)
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [autoQueue, setAutoQueue] = useState<AutoNews[]>(INITIAL_AUTO);
  const [clinics, setClinics] = useState<PendingClinic[]>(INITIAL_CLINICS);
  const [newTitle, setNewTitle] = useState("");
  const [newTag, setNewTag] = useState("Formación");
  const [newDate, setNewDate] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tcd_admin_posts");
      if (saved) setPosts(JSON.parse(saved));
    } catch {}
  }, []);

  const savePosts = (next: PostItem[]) => {
    setPosts(next);
    try { localStorage.setItem("tcd_admin_posts", JSON.stringify(next)); } catch {}
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const item: PostItem = {
      id: Date.now().toString(),
      tag: newTag,
      date: newDate || "Publicado hoy",
      title: newTitle.trim(),
      desc: newDesc.trim() || "Nueva publicación técnica del equipo TCD Ortodoncia.",
    };
    savePosts([item, ...posts]);
    setNewTitle("");
    setNewDate("");
    setNewDesc("");
  };

  const approveAuto = (item: AutoNews) => {
    savePosts([{ id: item.id, tag: "Actualidad científica", date: item.source, title: item.title, desc: item.summary }, ...posts]);
    setAutoQueue((q) => q.filter((x) => x.id !== item.id));
  };

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

      {/* Accesos directos a Plataformas */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="card-dark rounded-3xl p-7 flex flex-col">
          <span className="w-11 h-11 rounded-2xl bg-amber/15 text-amber grid place-items-center"><Cube /></span>
          <p className="text-xs uppercase tracking-widest text-amber mt-5 font-semibold">Plataforma 01 · {activeLab.city}</p>
          <h2 className="font-display text-white text-2xl mt-1">Aparatología General</h2>
          <p className="text-white/55 text-sm mt-2 flex-1">
            Subida de archivos STL, DICOM, fotografías y prescripción unificada para aparatología fija, removible, MARPE y apnea.
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
          <p className="text-xs uppercase tracking-widest text-amber mt-5 font-semibold">Descargas públicas</p>
          <h2 className="font-display text-white text-2xl mt-1">Hojas de prescripción</h2>
          <p className="text-white/55 text-sm mt-2 flex-1">
            ¿Envías modelos físicos? Descarga la hoja unificada oficial para adjuntar en la caja de transporte.
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <Link href="/enviar-caso?tipo=recogida" className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
              <span>Hoja Unificada Aparatología</span><Arrow className="w-4 h-4 text-amber" />
            </Link>
            <Link href="/enviar-caso?aparato=Cubetas%20de%20cementado%20indirecto" className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
              <span>Hoja Cementado 3D / MARPE</span><Arrow className="w-4 h-4 text-amber" />
            </Link>
          </div>
        </div>
      </div>

      {/* Área de cuenta + Panel Admin (Formación y Noticias) */}
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
        <div className="bg-white text-graphite rounded-[28px] p-7 sm:p-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-bone mb-8">
            {[
              ["login", "Iniciar sesión"],
              ["alta", "Alta clínica"],
              ["demo", "Visor Demo"],
              ["admin", "Panel Cursos / Admin"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id as "login" | "alta" | "demo" | "admin")}
                className={`py-2.5 px-2.5 rounded-xl text-xs font-semibold transition-all ${tab === id ? "bg-graphite text-white shadow" : "text-graphite/60 hover:text-graphite"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "login" && (
            <form onSubmit={(e) => { e.preventDefault(); setTab("demo"); }} className="space-y-5">
              <div>
                <h3 className="font-display text-2xl">Acceso unificado para clínicas</h3>
                <p className="text-graphite/60 text-sm mt-1">
                  Las mismas credenciales te dan acceso a tus tarifas privadas, protocolo D.A.M.A. TCD® y casos en <strong>TCD {activeLab.city}</strong>.
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
                <h3 className="font-display text-2xl">Solicitud de alta recibida</h3>
                <p className="text-graphite/60 text-sm max-w-md mx-auto">
                  Validaremos tu nº de colegiado y clínica desde administración. Una vez autorizada la cuenta, verás las tarifas completas en tu portal.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setRegistered(true); }} className="space-y-4">
                <div>
                  <h3 className="font-display text-2xl">Registro de nueva clínica</h3>
                  <p className="text-graphite/60 text-sm mt-1">Solo para profesionales odontólogos. Las tarifas se desbloquean tras validación del administrador.</p>
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

          {tab === "demo" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Visor Demo limitado · TCD {activeLab.city}</span>
                  <h3 className="font-display text-2xl">Panel de clínica</h3>
                </div>
                <Link href="/enviar-caso" className="btn btn-primary !py-2 !px-4 text-xs">+ Nuevo caso</Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <div className="p-4 rounded-2xl bg-bone"><p className="text-xs text-graphite/50">Casos en curso</p><p className="font-display text-2xl mt-1">2 activos</p></div>
                <div className="p-4 rounded-2xl bg-bone"><p className="text-xs text-graphite/50">Producción estándar</p><p className="font-display text-2xl mt-1">8 horas</p></div>
                <div className="p-4 rounded-2xl bg-bone"><p className="text-xs text-graphite/50">Tarifas</p><p className="font-display text-2xl mt-1 text-amber">Solo validados</p></div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-titanium mb-2">Aparatología rápida (ejemplo de sesión validada)</p>
                <div className="divide-y divide-graphite/10 border rounded-2xl border-graphite/10 max-h-56 overflow-y-auto text-sm">
                  {PRODUCTS.slice(0, 6).map((p) => (
                    <div key={p.name} className="px-4 py-2.5 flex items-center justify-between">
                      <div><p className="font-medium">{p.name}</p><p className="text-xs text-graphite/50">{p.cat} · Plazo {p.days}</p></div>
                      <Link href={`/enviar-caso?aparato=${encodeURIComponent(p.name)}`} className="text-xs font-semibold text-amber hover:underline">Prescribir →</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "admin" && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber bg-graphite px-3 py-1 rounded-full">Maqueta Panel Interno TCD</span>
                  <span className="text-xs text-graphite/50">Editor visual sin código</span>
                </div>
                <h3 className="font-display text-2xl mt-3">Gestor de Formación, Noticias y Altas</h3>
                <p className="text-graphite/60 text-xs mt-1">Publica cursos cada 3–4 meses, aprueba noticias automáticas del sector y valida clínicas nuevas.</p>
              </div>

              {/* Editor rápido de Formación / Noticias */}
              <form onSubmit={handlePublish} className="p-4 rounded-2xl bg-bone space-y-3 border border-graphite/10">
                <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Grad className="w-4 h-4 text-amber" />Publicar nuevo curso o noticia</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Título del curso o noticia..." className="input !py-2 text-xs sm:col-span-2" />
                  <select value={newTag} onChange={(e) => setNewTag(e.target.value)} className="input !py-2 text-xs">
                    <option>Formación</option>
                    <option>Congreso</option>
                    <option>Novedad técnica</option>
                  </select>
                  <input value={newDate} onChange={(e) => setNewDate(e.target.value)} placeholder="Fecha (ej. Marzo 2027)" className="input !py-2 text-xs" />
                  <textarea rows={2} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Resumen breve para doctores..." className="input !py-2 text-xs sm:col-span-2" />
                </div>
                <button type="submit" className="btn btn-primary !py-2 !px-4 text-xs"><Plus className="w-3.5 h-3.5" />Publicar en la web</button>
              </form>

              {/* Publicaciones activas */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-titanium mb-2">Publicaciones visibles ({posts.length})</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {posts.map((p) => (
                    <div key={p.id} className="p-3 rounded-xl border border-graphite/10 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <span className="font-semibold text-amber">{p.tag}</span> · <span className="text-graphite/45">{p.date}</span>
                        <p className="font-semibold text-graphite mt-0.5">{p.title}</p>
                      </div>
                      <button type="button" onClick={() => savePosts(posts.filter((x) => x.id !== p.id))} className="text-rose-600 hover:underline shrink-0">Quitar</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cola de noticias automáticas del sector */}
              {autoQueue.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-titanium mb-2 flex items-center gap-1.5"><Spark className="w-3.5 h-3.5 text-amber" />Noticias automáticas pendientes de aprobar ({autoQueue.length})</p>
                  <div className="space-y-2">
                    {autoQueue.map((a) => (
                      <div key={a.id} className="p-3 rounded-xl bg-amber/10 border border-amber/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-semibold text-graphite/60">{a.source}</span>
                          <p className="font-semibold text-graphite">{a.title}</p>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button type="button" onClick={() => approveAuto(a)} className="px-2.5 py-1 rounded-lg bg-graphite text-white font-semibold">Aprobar</button>
                          <button type="button" onClick={() => setAutoQueue((q) => q.filter((x) => x.id !== a.id))} className="px-2.5 py-1 rounded-lg bg-white text-graphite/70 border border-graphite/15">Descartar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Validación de clínicas para tarifas */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-titanium mb-2">Clínicas pendientes de validar tarifas</p>
                <div className="space-y-2">
                  {clinics.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl border border-graphite/10 flex items-center justify-between gap-2 text-xs">
                      <div>
                        <p className="font-semibold">{c.clinic} <span className="font-normal text-graphite/55">({c.doctor})</span></p>
                        <p className="text-[11px] text-graphite/50">DNI: {c.dni} · Col.: {c.colegiado} · {c.lab}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setClinics((list) => list.map((x) => x.id === c.id ? { ...x, approved: !x.approved } : x))}
                        className={`px-3 py-1.5 rounded-full font-semibold ${c.approved ? "bg-emerald-100 text-emerald-800" : "bg-amber text-graphite"}`}
                      >
                        {c.approved ? "Tarifas activas ✓" : "Autorizar precios"}
                      </button>
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
          <p className="tag text-amber">Área de clientes y administración</p>
          <h1 className="font-display text-4xl lg:text-5xl mt-3 leading-[1.05]">Portal de clínicas TCD</h1>
          <p className="text-white/60 mt-3">Unificamos tus plataformas digitales, hojas de prescripción, tarifas validadas y gestión de formación en un único espacio.</p>
        </div>
        <Suspense fallback={<div className="card-dark rounded-3xl p-12 text-center">Cargando portal…</div>}>
          <PortalContent />
        </Suspense>
      </div>
    </section>
  );
}
