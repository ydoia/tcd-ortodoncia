"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { Grad, Spark, Plus, Lock, Check, Arrow, File, Upload, Shield, User } from "@/components/Icons";

type Section = "overview" | "editor" | "rss" | "clinics";
type PostItem = { id: string; tag: string; date: string; title: string; html: string; image?: string; visible: boolean };
type AutoNews = { id: string; source: string; date: string; title: string; summary: string };
type PendingClinic = { id: string; clinic: string; doctor: string; email: string; dni: string; colegiado: string; lab: string; approved: boolean };

const INITIAL_POSTS: PostItem[] = [
  {
    id: "p1",
    tag: "Formación",
    date: "Marzo 2027",
    title: "Taller práctico de flujo digital y MARPE sobre microtornillos",
    html: "<p>Sesión clínica presencial y online para equipos de ortodoncia. Revisaremos alineación de escaneado intraoral con CBCT y diseño de férulas de inserción guiada.</p>",
    visible: true,
  },
  {
    id: "p2",
    tag: "Novedad técnica",
    date: "Noviembre 2026",
    title: "Cementado indirecto y directo 3D con cubetas impresas",
    html: "<p>Guías de inserción de alta precisión compatibles con <strong>3M APC Flash-Free</strong> y cualquier sistema de brackets.</p>",
    visible: true,
  },
  {
    id: "p3",
    tag: "Congreso",
    date: "SEDO",
    title: "Participación y taller práctico en el Congreso de Ortodoncia",
    html: "<p>Presentación de flujos digitales completos y dispositivos intraorales de apnea D.A.M.A. TCD®.</p>",
    visible: true,
  },
];

const INITIAL_RSS: AutoNews[] = [
  {
    id: "r1",
    source: "PubMed · Ortodoncia Clínica",
    date: "Hace 2 días",
    title: "Precisión comparativa en férulas quirúrgicas 3D para microimplantes palatinos",
    summary: "Estudio clínico sobre estabilidad primaria y menor desviación angular en protocolos MARPE guiados por CBCT.",
  },
  {
    id: "r2",
    source: "Sleep Medicine Reviews",
    date: "Hace 4 días",
    title: "Eficacia a largo plazo de los dispositivos de avance mandibular (DAM) regulables",
    summary: "Revisión multicéntrica sobre adherencia y confort en pacientes con apnea leve y moderada.",
  },
];

const INITIAL_CLINICS: PendingClinic[] = [
  { id: "c1", clinic: "Clínica Dental Bahía", doctor: "Dra. Elena Ruiz", email: "elena@clinicabahia.es", dni: "72091843K", colegiado: "39001482", lab: "Santander", approved: false },
  { id: "c2", clinic: "Ortodoncia Atlántico", doctor: "Dr. Marcos León", email: "mleon@ortodonciaatlantico.es", dni: "43812055M", colegiado: "35002190", lab: "Las Palmas", approved: true },
  { id: "c3", clinic: "Instituto Dental Norte", doctor: "Dr. Pablo Sáez", email: "direccion@dentalnorte.es", dni: "13940218P", colegiado: "39002011", lab: "Santander", approved: false },
];

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [emailInput, setEmailInput] = useState("alberto@tcdortodoncia.com");
  const [passInput, setPassInput] = useState("");
  const [section, setSection] = useState<Section>("overview");

  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [rssQueue, setRssQueue] = useState<AutoNews[]>(INITIAL_RSS);
  const [clinics, setClinics] = useState<PendingClinic[]>(INITIAL_CLINICS);
  const [notifyOnApprove, setNotifyOnApprove] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // WYSIWYG state
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("Formación");
  const [date, setDate] = useState("");
  const [coverImg, setCoverImg] = useState<string>("");
  const [previewHtml, setPreviewHtml] = useState("<p>Escribe aquí el contenido del curso o noticia...</p>");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tcd_backoffice_posts");
      if (saved) setPosts(JSON.parse(saved));
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const savePosts = (next: PostItem[]) => {
    setPosts(next);
    try { localStorage.setItem("tcd_backoffice_posts", JSON.stringify(next)); } catch {}
  };

  const execCmd = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    if (editorRef.current) setPreviewHtml(editorRef.current.innerHTML);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCoverImg(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const html = editorRef.current?.innerHTML || previewHtml;
    const item: PostItem = {
      id: Date.now().toString(),
      tag,
      date: date || "Publicado hoy",
      title: title.trim(),
      html,
      image: coverImg || undefined,
      visible: true,
    };
    savePosts([item, ...posts]);
    setTitle("");
    setDate("");
    setCoverImg("");
    if (editorRef.current) editorRef.current.innerHTML = "<p>Escribe aquí el contenido del curso o noticia...</p>";
    setPreviewHtml("<p>Escribe aquí el contenido del curso o noticia...</p>");
    showToast("Publicado correctamente en la sección Formación y Noticias.");
    setSection("overview");
  };

  const approveRss = (item: AutoNews) => {
    savePosts([{ id: item.id, tag: "Actualidad científica", date: item.source, title: item.title, html: `<p>${item.summary}</p>`, visible: true }, ...posts]);
    setRssQueue((q) => q.filter((x) => x.id !== item.id));
    showToast("Noticia aprobada y publicada en la web.");
  };

  const editRssInWysiwyg = (item: AutoNews) => {
    setTitle(item.title);
    setTag("Actualidad científica");
    setDate(item.source);
    const html = `<p>${item.summary}</p>`;
    setPreviewHtml(html);
    setSection("editor");
    setTimeout(() => {
      if (editorRef.current) editorRef.current.innerHTML = html;
    }, 50);
  };

  const toggleClinicApproval = (id: string) => {
    setClinics((list) =>
      list.map((c) => {
        if (c.id !== id) return c;
        const nextApproved = !c.approved;
        if (nextApproved && notifyOnApprove) {
          showToast(`Tarifas autorizadas. Aviso enviado a ${c.email}`);
        } else {
          showToast(nextApproved ? "Tarifas autorizadas." : "Acceso a tarifas revocado.");
        }
        return { ...c, approved: nextApproved };
      })
    );
  };

  // PANTALLA DE LOGIN PRIVADA (AISLADA DE LA WEB PÚBLICA)
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#0d1014] text-white flex flex-col justify-between p-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-tech opacity-40 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between max-w-6xl w-full mx-auto">
          <div className="flex items-center gap-3">
            <LogoMark className="h-6" forceColors />
            <span className="font-display font-bold tracking-tight text-lg">TCD <span className="text-white/40 font-normal text-xs tracking-[0.22em] ml-1">BACKOFFICE</span></span>
          </div>
          <Link href="/" className="text-xs text-white/50 hover:text-amber transition-colors">← Volver a web pública</Link>
        </div>

        <div className="relative z-10 max-w-md w-full mx-auto bg-[#161a20] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-amber text-graphite grid place-items-center shrink-0"><Lock className="w-5 h-5" /></span>
            <div>
              <h1 className="font-display text-2xl leading-none">Administración TCD</h1>
              <p className="text-white/50 text-xs mt-1">Acceso privado para dirección y equipo</p>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setUnlocked(true); }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Correo de administrador</label>
              <input required type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="input input-dark text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Contraseña</label>
              <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="••••••••" className="input input-dark text-sm" />
            </div>
            <button type="submit" className="btn btn-primary w-full justify-center text-sm">Acceder al panel privado<Arrow /></button>
          </form>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/45">
            <span>Entorno de demostración</span>
            <button type="button" onClick={() => setUnlocked(true)} className="text-amber font-semibold hover:underline">Entrar directo (Demo) →</button>
          </div>
        </div>

        <p className="relative z-10 text-center text-[11px] text-white/30">SIKKER SVAR S.L. · Uso interno exclusivo</p>
      </div>
    );
  }

  const pendingClinicsCount = clinics.filter((c) => !c.approved).length;

  return (
    <div className="min-h-screen bg-[#f2f4f7] text-graphite flex flex-col lg:flex-row">
      {/* Toast flotante */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-graphite text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber/40 text-xs font-semibold flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white grid place-items-center"><Check className="w-3 h-3" /></span>
          {toast}
        </div>
      )}

      {/* SIDEBAR PRIVADA FIJA */}
      <aside className="lg:w-68 bg-[#12151a] text-white flex flex-col shrink-0 border-r border-white/5">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <LogoMark className="h-5" forceColors />
          <div>
            <p className="font-display font-bold text-sm leading-none">TCD BACKOFFICE</p>
            <p className="text-[10px] text-amber tracking-[0.18em] uppercase mt-1">Gestión interna</p>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 flex-1">
          {[
            { id: "overview", label: "Resumen y Publicado", icon: <File className="w-4 h-4" /> },
            { id: "editor", label: "Editor Cursos / Noticias", icon: <Grad className="w-4 h-4" /> },
            { id: "rss", label: "Noticias RSS Auto", icon: <Spark className="w-4 h-4" />, badge: rssQueue.length },
            { id: "clinics", label: "Validar Clínicas", icon: <User className="w-4 h-4" />, badge: pendingClinicsCount },
          ].map((item) => {
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id as Section)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${active ? "bg-amber text-graphite shadow" : "text-white/65 hover:bg-white/5 hover:text-white"}`}
              >
                <span className="flex items-center gap-3">{item.icon}{item.label}</span>
                {item.badge ? (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? "bg-graphite text-white" : "bg-amber/20 text-amber"}`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2 text-xs">
          <Link href="/" target="_blank" className="flex items-center justify-between px-3 py-2 rounded-lg text-white/60 hover:bg-white/5 hover:text-white">
            <span>Ver web pública</span><span>↗</span>
          </Link>
          <button onClick={() => setUnlocked(false)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10">
            <Lock className="w-3.5 h-3.5" />Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ÁREA DE TRABAJO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-black/5 px-6 lg:px-10 h-16 flex items-center justify-between">
          <p className="font-display font-semibold text-base">
            {section === "overview" && "Resumen de contenido público"}
            {section === "editor" && "Editor WYSIWYG · Formación y Noticias"}
            {section === "rss" && "Curación automática RSS del sector"}
            {section === "clinics" && "Control de altas y tarifas privadas"}
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline-block text-graphite/50">{emailInput}</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">Admin activo</span>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-6xl w-full space-y-8">
          {/* 1. RESUMEN Y CONTENIDO PUBLICADO */}
          {section === "overview" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  ["Publicaciones activas", posts.filter((p) => p.visible).length, "En /formacion"],
                  ["Noticias RSS en cola", rssQueue.length, "Pendientes de aprobar"],
                  ["Clínicas por validar", pendingClinicsCount, "Esperando tarifas"],
                  ["Clínicas autorizadas", clinics.filter((c) => c.approved).length, "Con acceso a precios"],
                ].map(([lbl, val, sub]) => (
                  <div key={String(lbl)} className="bg-white rounded-2xl p-5 border border-black/5 shadow-xs">
                    <p className="text-xs text-graphite/55 font-medium">{lbl}</p>
                    <p className="font-display text-3xl font-bold mt-1">{val}</p>
                    <p className="text-[11px] text-graphite/40 mt-1">{sub}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-black/5 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
                  <h2 className="font-display text-lg">Lo que se muestra actualmente en la web pública</h2>
                  <button onClick={() => setSection("editor")} className="btn btn-primary !py-2 !px-4 text-xs"><Plus className="w-3.5 h-3.5" />Nueva publicación</button>
                </div>
                <div className="divide-y divide-black/5">
                  {posts.map((p) => (
                    <div key={p.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2.5 py-0.5 rounded-full bg-bone font-semibold">{p.tag}</span>
                          <span className="text-graphite/45">{p.date}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.visible ? "bg-emerald-100 text-emerald-700" : "bg-silver text-graphite/50"}`}>
                            {p.visible ? "Publicado" : "Oculto"}
                          </span>
                        </div>
                        <p className="font-semibold text-sm">{p.title}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 text-xs">
                        <button
                          onClick={() => savePosts(posts.map((x) => x.id === p.id ? { ...x, visible: !x.visible } : x))}
                          className="px-3 py-1.5 rounded-lg border border-black/10 hover:bg-bone font-medium"
                        >
                          {p.visible ? "Ocultar" : "Mostrar"}
                        </button>
                        <button
                          onClick={() => savePosts(posts.filter((x) => x.id !== p.id))}
                          className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 2. EDITOR WYSIWYG RICO + PREVIEW EN VIVO */}
          {section === "editor" && (
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
              <form onSubmit={handlePublish} className="bg-white rounded-2xl p-6 border border-black/5 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1.5">Título del curso o noticia *</label>
                    <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Curso avanzado de flujo digital y MARPE" className="input text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Categoría</label>
                    <select value={tag} onChange={(e) => setTag(e.target.value)} className="input text-sm">
                      <option>Formación</option>
                      <option>Congreso</option>
                      <option>Novedad técnica</option>
                      <option>Actualidad científica</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Fecha o convocatoria</label>
                    <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Ej. Marzo 2027" className="input text-sm" />
                  </div>
                </div>

                {/* Imagen destacada */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Imagen de portada (opcional)</label>
                  <label className="flex items-center justify-between px-4 py-3 rounded-xl border border-dashed border-black/20 hover:border-amber cursor-pointer bg-bone/50 text-xs">
                    <span className="flex items-center gap-2 text-graphite/70"><Upload className="w-4 h-4 text-amber" />{coverImg ? "Imagen cargada ✓ (clic para cambiar)" : "Subir fotografía o cartel del curso..."}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>

                {/* Toolbar WYSIWYG real */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Contenido (Editor visual WYSIWYG)</label>
                  <div className="border border-black/15 rounded-xl overflow-hidden">
                    <div className="bg-bone px-3 py-2 border-b border-black/10 flex flex-wrap gap-1.5">
                      {[
                        ["bold", "Negrita", "B"],
                        ["italic", "Cursiva", "I"],
                        ["formatBlock", "Subtítulo", "H3"],
                        ["insertUnorderedList", "Lista", "• Lista"],
                      ].map(([cmd, titleAttr, label]) => (
                        <button
                          key={label}
                          type="button"
                          title={titleAttr}
                          onClick={() => execCmd(cmd, cmd === "formatBlock" ? "h3" : undefined)}
                          className="px-2.5 py-1 rounded bg-white border border-black/10 text-xs font-bold hover:bg-amber/20"
                        >
                          {label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt("Introduce la URL del enlace:");
                          if (url) execCmd("createLink", url);
                        }}
                        className="px-2.5 py-1 rounded bg-white border border-black/10 text-xs font-semibold hover:bg-amber/20"
                      >
                        🔗 Enlace
                      </button>
                    </div>
                    <div
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => setPreviewHtml(e.currentTarget.innerHTML)}
                      className="min-h-[180px] p-4 text-sm outline-none prose prose-sm max-w-none bg-white"
                      dangerouslySetInnerHTML={{ __html: "<p>Escribe aquí el contenido del curso o noticia...</p>" }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary text-sm"><Check className="w-4 h-4" />Publicar en la web</button>
              </form>

              {/* Vista previa en tiempo real */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-titanium">Vista previa en tiempo real (Web pública)</p>
                <article className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm">
                  {coverImg && (
                    <div className="h-44 overflow-hidden">
                      <img src={coverImg} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-3 py-1 rounded-full bg-bone font-semibold">{tag}</span>
                      <span className="text-graphite/45">{date || "Fecha"}</span>
                    </div>
                    <h3 className="font-display text-xl leading-snug">{title || "Título de tu curso o noticia"}</h3>
                    <div className="text-xs text-graphite/65 leading-relaxed space-y-2" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  </div>
                </article>
              </div>
            </div>
          )}

          {/* 3. CURACIÓN AUTOMÁTICA RSS */}
          {section === "rss" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg">Fuentes RSS conectadas (sin competencia directa)</h2>
                  <p className="text-xs text-graphite/60 mt-1">
                    Filtrado semanal de <strong>PubMed Ortodoncia</strong>, <strong>SEDO</strong> y <strong>Sleep Medicine</strong>. Con envío de resumen previo por email a <code>alberto@tcdortodoncia.com</code> antes de publicar.
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold shrink-0">Filtro activo ✓</span>
              </div>

              {rssQueue.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center text-sm text-graphite/60 border border-black/5">
                  No quedan artículos pendientes de revisar en esta cola.
                </div>
              ) : (
                <div className="space-y-4">
                  {rssQueue.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl p-6 border border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber/20 text-graphite font-semibold">{item.source}</span>
                          <span className="text-graphite/45">{item.date}</span>
                        </div>
                        <h3 className="font-display text-xl">{item.title}</h3>
                        <p className="text-sm text-graphite/65">{item.summary}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button onClick={() => approveRss(item)} className="btn btn-primary !py-2 !px-4 text-xs">Aprobar y publicar</button>
                        <button onClick={() => editRssInWysiwyg(item)} className="btn btn-ghost !py-2 !px-4 text-xs">Editar antes</button>
                        <button onClick={() => setRssQueue((q) => q.filter((x) => x.id !== item.id))} className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-full">Descartar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. VALIDACIÓN DE CLÍNICAS Y AVISOS POR EMAIL */}
          {section === "clinics" && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-5 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Notificación automática por correo electrónico</p>
                    <p className="text-xs text-graphite/60">Cuando una clínica se registra recibís aviso en administración, y al autorizarla se le envía su correo de bienvenida con acceso a tarifas.</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold shrink-0 cursor-pointer">
                  <input type="checkbox" checked={notifyOnApprove} onChange={(e) => setNotifyOnApprove(e.target.checked)} />
                  Aviso email activo
                </label>
              </div>

              <div className="bg-white rounded-2xl border border-black/5 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-bone text-xs uppercase tracking-wider text-graphite/55 border-b border-black/5">
                    <tr>
                      <th className="px-5 py-3.5">Clínica / Doctor</th>
                      <th className="px-5 py-3.5">DNI / Col.</th>
                      <th className="px-5 py-3.5">Sede</th>
                      <th className="px-5 py-3.5">Estado tarifas</th>
                      <th className="px-5 py-3.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {clinics.map((c) => (
                      <tr key={c.id}>
                        <td className="px-5 py-4">
                          <p className="font-semibold">{c.clinic}</p>
                          <p className="text-xs text-graphite/55">{c.doctor} · {c.email}</p>
                        </td>
                        <td className="px-5 py-4 text-xs font-mono text-graphite/70">
                          <div>{c.dni}</div>
                          <div>Col. {c.colegiado}</div>
                        </td>
                        <td className="px-5 py-4 text-xs">{c.lab}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.approved ? "bg-emerald-100 text-emerald-800" : "bg-amber/20 text-amber-900"}`}>
                            {c.approved ? "Autorizada" : "Pendiente"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => toggleClinicApproval(c.id)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${c.approved ? "bg-bone text-graphite hover:bg-rose-50 hover:text-rose-600" : "bg-graphite text-white hover:bg-amber hover:text-graphite"}`}
                          >
                            {c.approved ? "Revocar" : "Autorizar y avisar"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
