"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Grad, Spark, Plus, Lock, Check, Arrow } from "@/components/Icons";

type PostItem = { id: string; tag: string; date: string; title: string; desc: string };
type AutoNews = { id: string; source: string; title: string; summary: string };
type PendingClinic = { id: string; clinic: string; doctor: string; dni: string; colegiado: string; lab: string; approved: boolean };

const INITIAL_POSTS: PostItem[] = [
  { id: "p1", tag: "Formación", date: "Próxima convocatoria", title: "Taller práctico de flujo digital y MARPE sobre microtornillos", desc: "Sesión clínica presencial y online para equipos de ortodoncia." },
  { id: "p2", tag: "Novedad técnica", date: "Noviembre 2026", title: "Cementado indirecto y directo 3D con cubetas impresas", desc: "Guías de inserción de alta precisión compatibles con 3M APC Flash-Free." },
];

const INITIAL_AUTO: AutoNews[] = [
  { id: "a1", source: "PubMed / Ortodoncia Clínica", title: "Precisión comparativa en férulas quirúrgicas 3D para microimplantes palatinos", summary: "Revisión clínica de estabilidad primaria en protocolos MARPE guiados por CBCT." },
  { id: "a2", source: "Sleep Medicine Reviews", title: "Eficacia a largo plazo de los dispositivos de avance mandibular (DAM) regulables", summary: "Estudio multicéntrico sobre adherencia del paciente en SAHS leve y moderado." },
];

const INITIAL_CLINICS: PendingClinic[] = [
  { id: "c1", clinic: "Clínica Dental Bahía", doctor: "Dra. Elena Ruiz", dni: "72091843K", colegiado: "39001482", lab: "Santander", approved: false },
  { id: "c2", clinic: "Ortodoncia Atlántico", doctor: "Dr. Marcos León", dni: "43812055M", colegiado: "35002190", lab: "Las Palmas", approved: true },
];

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(true);
  const [pin, setPin] = useState("");
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

  if (!unlocked) {
    return (
      <section className="bg-graphite text-white min-h-[75vh] flex items-center justify-center px-6 py-20">
        <form onSubmit={(e) => { e.preventDefault(); setUnlocked(true); }} className="card-dark rounded-3xl p-8 max-w-md w-full space-y-5">
          <span className="w-12 h-12 rounded-2xl bg-amber text-graphite grid place-items-center"><Lock /></span>
          <div>
            <h1 className="font-display text-2xl">Administración TCD</h1>
            <p className="text-white/55 text-sm mt-1">Acceso privado exclusivo para dirección y equipo del laboratorio.</p>
          </div>
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Contraseña de administrador" className="input input-dark" />
          <button type="submit" className="btn btn-primary w-full justify-center">Entrar al panel<Arrow /></button>
        </form>
      </section>
    );
  }

  return (
    <section className="bg-bone py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="tag text-titanium">Zona privada · No visible en menú público</span>
              <span className="text-[11px] font-semibold bg-amber/20 text-graphite px-3 py-1 rounded-full">Demo interactiva</span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl mt-3 leading-[1.05]">Panel interno TCD Ortodoncia</h1>
            <p className="text-graphite/60 mt-2 max-w-2xl">
              Gestiona de forma autónoma vuestros cursos y noticias, aprueba artículos científicos filtrados y autoriza el acceso a tarifas de nuevas clínicas.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/formacion" className="btn btn-ghost text-sm">Ver Formación pública</Link>
            <button onClick={() => setUnlocked(false)} className="btn btn-ghost text-sm"><Lock className="w-4 h-4" />Bloquear vista</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
          {/* Columna izquierda: Editor de Cursos y Noticias */}
          <div className="space-y-6">
            <form onSubmit={handlePublish} className="bg-white rounded-[28px] p-7 sm:p-8 ring-1 ring-black/5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl flex items-center gap-2.5"><Grad className="w-6 h-6 text-amber" />Publicar curso o noticia</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1.5">Título *</label>
                  <input required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Ej. Curso presencial de flujo digital y MARPE en Santander" className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Categoría</label>
                  <select value={newTag} onChange={(e) => setNewTag(e.target.value)} className="input">
                    <option>Formación</option>
                    <option>Congreso</option>
                    <option>Novedad técnica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Fecha o convocatoria</label>
                  <input value={newDate} onChange={(e) => setNewDate(e.target.value)} placeholder="Ej. Marzo 2027" className="input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1.5">Descripción para doctores</label>
                  <textarea rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Detalles del taller, ponentes o novedad..." className="input" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary"><Plus className="w-4 h-4" />Publicar en la web</button>
            </form>

            {/* Listado publicado */}
            <div className="bg-white rounded-[28px] p-7 sm:p-8 ring-1 ring-black/5 space-y-4">
              <h3 className="font-display text-xl">Contenidos publicados en la web ({posts.length})</h3>
              <div className="space-y-3">
                {posts.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-bone flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-amber">{p.tag}</span> · <span className="text-xs text-graphite/50">{p.date}</span>
                      <p className="font-display text-lg mt-0.5">{p.title}</p>
                      <p className="text-xs text-graphite/60 mt-1">{p.desc}</p>
                    </div>
                    <button type="button" onClick={() => savePosts(posts.filter((x) => x.id !== p.id))} className="text-xs font-semibold text-rose-600 hover:underline shrink-0">Eliminar</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha: Noticias automáticas + Validación de Clínicas */}
          <div className="space-y-6">
            <div className="bg-graphite text-white rounded-[28px] p-7 space-y-4">
              <div className="flex items-center gap-2 text-amber text-xs font-semibold uppercase tracking-widest">
                <Spark className="w-4 h-4" />Noticias automáticas del sector
              </div>
              <h2 className="font-display text-2xl">Pendientes de vuestra aprobación</h2>
              <p className="text-white/55 text-xs">Artículos científicos neutrales filtrados automáticamente. También os llegan por email para aprobar con un clic.</p>
              {autoQueue.length === 0 ? (
                <div className="p-4 rounded-2xl bg-white/5 text-xs text-white/60 flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" />No hay noticias pendientes de revisar.</div>
              ) : (
                <div className="space-y-3">
                  {autoQueue.map((a) => (
                    <div key={a.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <span className="text-[11px] text-amber font-semibold">{a.source}</span>
                      <p className="font-display text-base leading-snug">{a.title}</p>
                      <p className="text-xs text-white/55">{a.summary}</p>
                      <div className="pt-2 flex gap-2">
                        <button type="button" onClick={() => approveAuto(a)} className="px-3.5 py-1.5 rounded-full bg-amber text-graphite text-xs font-bold">Aprobar y publicar</button>
                        <button type="button" onClick={() => setAutoQueue((q) => q.filter((x) => x.id !== a.id))} className="px-3.5 py-1.5 rounded-full bg-white/10 text-white/70 text-xs">Descartar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-[28px] p-7 ring-1 ring-black/5 space-y-4">
              <p className="tag text-titanium">Control de acceso y tarifas</p>
              <h2 className="font-display text-2xl">Validación de clínicas nuevas</h2>
              <p className="text-xs text-graphite/60">Solo las clínicas autorizadas por administración pueden ver precios en el catálogo.</p>
              <div className="space-y-3">
                {clinics.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-bone flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm">{c.clinic}</p>
                      <p className="text-xs text-graphite/60">{c.doctor} · {c.lab}</p>
                      <p className="text-[11px] text-graphite/50 mt-0.5">DNI: {c.dni} · Col.: {c.colegiado}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setClinics((list) => list.map((x) => x.id === c.id ? { ...x, approved: !x.approved } : x))}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold shrink-0 transition-colors ${c.approved ? "bg-emerald-100 text-emerald-800" : "bg-graphite text-white hover:bg-amber hover:text-graphite"}`}
                    >
                      {c.approved ? "Tarifas activas ✓" : "Autorizar precios"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
