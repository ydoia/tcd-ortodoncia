"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import RichEditor from "@/components/RichEditor";
import {
  BackofficePost, PostKind, PostStatus, AutoNews, PendingClinic, LabCase,
  BACKOFFICE_STORAGE_KEY, INITIAL_POSTS, INITIAL_RSS, INITIAL_CASES, INITIAL_CLINICS, toSlug,
} from "@/lib/backoffice";
import { Grad, Spark, Plus, Lock, Check, Arrow, File, Upload, Shield, User, Cube } from "@/components/Icons";

type Section = "overview" | "courses" | "news" | "cases" | "clinics";
type CourseTab = "list" | "editor";
type NewsTab = "list" | "editor" | "rss";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [emailInput, setEmailInput] = useState("alberto@tcdortodoncia.com");
  const [passInput, setPassInput] = useState("");

  const [section, setSection] = useState<Section>("overview");
  const [overviewTab, setOverviewTab] = useState<PostKind>("course");
  const [courseTab, setCourseTab] = useState<CourseTab>("list");
  const [newsTab, setNewsTab] = useState<NewsTab>("list");
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");

  const [posts, setPosts] = useState<BackofficePost[]>(INITIAL_POSTS);
  const [rssQueue, setRssQueue] = useState<AutoNews[]>(INITIAL_RSS);
  const [cases, setCases] = useState<LabCase[]>(INITIAL_CASES);
  const [clinics, setClinics] = useState<PendingClinic[]>(INITIAL_CLINICS);
  const [notifyOnApprove, setNotifyOnApprove] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Estado compartido del Editor Tiptap + Inspector derecho
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorKind, setEditorKind] = useState<PostKind>("course");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tag, setTag] = useState("Formación");
  const [date, setDate] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [html, setHtml] = useState("<p></p>");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [inspectorTab, setInspectorTab] = useState<"doc" | "seo">("doc");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BACKOFFICE_STORAGE_KEY);
      if (saved) setPosts(JSON.parse(saved));
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const savePosts = (next: BackofficePost[]) => {
    setPosts(next);
    try { localStorage.setItem(BACKOFFICE_STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  const startNewInEditor = (kind: PostKind) => {
    setEditingId(null);
    setEditorKind(kind);
    setTitle("");
    setSlug("");
    setTag(kind === "course" ? "Formación" : "Novedad técnica");
    setDate("");
    setCoverImg("");
    setHtml("<p></p>");
    setMetaTitle("");
    setMetaDesc("");
    if (kind === "course") {
      setSection("courses");
      setCourseTab("editor");
    } else {
      setSection("news");
      setNewsTab("editor");
    }
  };

  const openInEditor = (p: BackofficePost) => {
    setEditingId(p.id);
    setEditorKind(p.kind);
    setTitle(p.title);
    setSlug(p.slug);
    setTag(p.tag);
    setDate(p.date);
    setCoverImg(p.image || "");
    setHtml(p.html);
    setMetaTitle(p.metaTitle);
    setMetaDesc(p.metaDesc);
    if (p.kind === "course") {
      setSection("courses");
      setCourseTab("editor");
    } else {
      setSection("news");
      setNewsTab("editor");
    }
  };

  const handleSavePost = (targetStatus: PostStatus) => {
    if (!title.trim()) {
      showToast("Añade un título antes de guardar.");
      return;
    }
    const cleanSlug = slug.trim() || toSlug(title);
    const payload: BackofficePost = {
      id: editingId || Date.now().toString(),
      kind: editorKind,
      tag,
      date: date || (targetStatus === "draft" ? "Borrador" : "Publicado hoy"),
      title: title.trim(),
      slug: cleanSlug,
      metaTitle: metaTitle.trim() || `${title.trim()} · TCD Ortodoncia`,
      metaDesc: metaDesc.trim() || "Contenido técnico y formación especializada de TCD Ortodoncia.",
      html,
      image: coverImg || undefined,
      status: targetStatus,
    };

    if (editingId) {
      savePosts(posts.map((p) => (p.id === editingId ? payload : p)));
    } else {
      savePosts([payload, ...posts]);
    }
    showToast(targetStatus === "draft" ? "Borrador guardado (oculto en la web)." : "Publicado en /formacion.");
    if (editorKind === "course") setCourseTab("list");
    else setNewsTab("list");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCoverImg(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const approveRss = (item: AutoNews) => {
    const p: BackofficePost = {
      id: item.id,
      kind: "news",
      tag: "Actualidad científica",
      date: item.source,
      title: item.title,
      slug: toSlug(item.title),
      metaTitle: item.title,
      metaDesc: item.summary,
      html: `<p>${item.summary}</p>`,
      status: "published",
    };
    savePosts([p, ...posts]);
    setRssQueue((q) => q.filter((x) => x.id !== item.id));
    showToast("Noticia RSS aprobada y publicada en Noticias.");
  };

  const editRssInEditor = (item: AutoNews) => {
    setEditingId(null);
    setEditorKind("news");
    setTitle(item.title);
    setSlug(toSlug(item.title));
    setTag("Actualidad científica");
    setDate(item.source);
    setCoverImg("");
    setHtml(`<p>${item.summary}</p>`);
    setMetaTitle(item.title);
    setMetaDesc(item.summary);
    setSection("news");
    setNewsTab("editor");
  };

  const toggleClinicApproval = (id: string) => {
    setClinics((list) =>
      list.map((c) => {
        if (c.id !== id) return c;
        const nextApproved = !c.approved;
        showToast(nextApproved && notifyOnApprove ? `Tarifas activadas. Aviso enviado a ${c.email}` : nextApproved ? "Tarifas autorizadas." : "Acceso revocado.");
        return { ...c, approved: nextApproved };
      })
    );
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#0d1014] text-white flex flex-col justify-between p-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-tech opacity-40 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between max-w-6xl w-full mx-auto">
          <div className="flex items-center gap-3">
            <LogoMark className="h-6" />
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

  const coursesList = posts.filter((p) => p.kind === "course");
  const newsList = posts.filter((p) => p.kind === "news");
  const pendingClinicsCount = clinics.filter((c) => !c.approved).length;

  const renderPostTable = (items: BackofficePost[], kind: PostKind) => {
    const filtered = items.filter((p) => statusFilter === "all" || p.status === statusFilter);
    return (
      <div className="bg-white rounded-2xl border border-black/5 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-black/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {([["all", "Todos"], ["published", "Publicados"], ["draft", "Borradores"]] as const).map(([k, lbl]) => (
              <button
                key={k}
                onClick={() => setStatusFilter(k)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${statusFilter === k ? "bg-graphite text-white" : "bg-bone text-graphite/65 hover:text-graphite"}`}
              >
                {lbl}
              </button>
            ))}
          </div>
          <button onClick={() => startNewInEditor(kind)} className="btn btn-primary !py-2 !px-4 text-xs">
            <Plus className="w-3.5 h-3.5" />{kind === "course" ? "Nuevo curso" : "Nueva noticia"}
          </button>
        </div>

        <div className="divide-y divide-black/5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-graphite/50">No hay elementos en este filtro.</div>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#fafbfc]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-bone font-semibold">{p.tag}</span>
                    <span className="text-graphite/45">{p.date}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber/25 text-amber-900"}`}>
                      {p.status === "published" ? "Publicado" : "Borrador"}
                    </span>
                  </div>
                  <p className="font-semibold text-sm">{p.title}</p>
                  <p className="text-[11px] font-mono text-graphite/40">/formacion/{p.slug}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-xs">
                  <button onClick={() => openInEditor(p)} className="px-3 py-1.5 rounded-lg bg-bone hover:bg-amber/20 font-semibold">Editar</button>
                  <button
                    onClick={() => savePosts(posts.map((x) => x.id === p.id ? { ...x, status: x.status === "published" ? "draft" : "published" } : x))}
                    className="px-3 py-1.5 rounded-lg border border-black/10 hover:bg-bone font-medium"
                  >
                    {p.status === "published" ? "Pasar a borrador" : "Publicar"}
                  </button>
                  <button onClick={() => savePosts(posts.filter((x) => x.id !== p.id))} className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-medium">Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderWysiwyg = (kind: PostKind) => (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
      <div className="space-y-4 min-w-0">
        <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-xs">
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!editingId) setSlug(toSlug(e.target.value));
            }}
            placeholder={kind === "course" ? "Título del curso o taller…" : "Titular de la noticia…"}
            className="w-full font-display text-2xl sm:text-3xl font-bold outline-none placeholder:text-graphite/25"
          />
          <p className="text-[11px] font-mono text-graphite/40 mt-2">
            URL: https://tcdortodoncia.com/formacion/<span className="text-graphite/80">{slug || toSlug(title) || "nueva-entrada"}</span>
          </p>
        </div>

        <RichEditor value={html} onChange={setHtml} />
      </div>

      <aside className="bg-white rounded-2xl border border-black/5 shadow-xs overflow-hidden space-y-5 p-5">
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => handleSavePost("draft")} className="btn btn-ghost !py-2.5 !px-3 justify-center text-xs">Guardar borrador</button>
          <button type="button" onClick={() => handleSavePost("published")} className="btn btn-primary !py-2.5 !px-3 justify-center text-xs">Publicar ahora</button>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-bone text-xs font-semibold">
          <button type="button" onClick={() => setInspectorTab("doc")} className={`py-2 rounded-lg ${inspectorTab === "doc" ? "bg-white shadow-xs text-graphite" : "text-graphite/55"}`}>Documento</button>
          <button type="button" onClick={() => setInspectorTab("seo")} className={`py-2 rounded-lg ${inspectorTab === "seo" ? "bg-white shadow-xs text-graphite" : "text-graphite/55"}`}>SEO &amp; Google</button>
        </div>

        {inspectorTab === "doc" ? (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1.5">Categoría</label>
              <select value={tag} onChange={(e) => setTag(e.target.value)} className="input !py-2 text-xs">
                {kind === "course" ? (
                  <>
                    <option>Formación</option>
                    <option>Congreso</option>
                    <option>Taller práctico</option>
                  </>
                ) : (
                  <>
                    <option>Novedad técnica</option>
                    <option>Actualidad científica</option>
                    <option>I+D Materiales</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1.5">Fecha o convocatoria</label>
              <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Ej. Marzo 2027" className="input !py-2 text-xs" />
            </div>
            <div>
              <label className="block font-semibold mb-1.5">Imagen destacada</label>
              {coverImg && (
                <div className="relative rounded-xl overflow-hidden mb-2 h-32 border border-black/10">
                  <img src={coverImg} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setCoverImg("")} className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">Quitar</button>
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-dashed border-black/20 hover:border-amber cursor-pointer bg-bone/60">
                <Upload className="w-4 h-4 text-amber" />
                <span>{coverImg ? "Cambiar imagen" : "Subir imagen destacada"}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1.5">Slug URL</label>
              <input value={slug} onChange={(e) => setSlug(toSlug(e.target.value))} placeholder="url-amigable" className="input !py-2 text-xs font-mono" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="font-semibold">Meta Title</label>
                <span className={(metaTitle || title).length > 60 ? "text-rose-600 font-bold" : "text-graphite/45"}>{(metaTitle || title).length}/60</span>
              </div>
              <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={title || "Título en Google"} className="input !py-2 text-xs" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="font-semibold">Meta Description</label>
                <span className={metaDesc.length > 160 ? "text-rose-600 font-bold" : "text-graphite/45"}>{metaDesc.length}/160</span>
              </div>
              <textarea rows={3} value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} placeholder="Descripción para buscadores e IA..." className="input !py-2 text-xs" />
            </div>
            <div className="p-3.5 rounded-xl bg-bone border border-black/10 space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-graphite/45 font-bold mb-1">Vista previa en Google</p>
              <p className="text-[11px] text-emerald-700 truncate">tcdortodoncia.com › formacion › {slug || "articulo"}</p>
              <p className="text-sm font-semibold text-blue-700 leading-snug line-clamp-1">{metaTitle || title || "Título · TCD Ortodoncia"}</p>
              <p className="text-[11px] text-graphite/65 line-clamp-2">{metaDesc || "Resumen optimizado para buscadores."}</p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f2f4f7] text-graphite flex flex-col lg:flex-row">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-graphite text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber/40 text-xs font-semibold flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white grid place-items-center"><Check className="w-3 h-3" /></span>
          {toast}
        </div>
      )}

      {/* SIDEBAR COHERENTE */}
      <aside className="lg:w-64 bg-[#12151a] text-white flex flex-col shrink-0 border-r border-white/5">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <LogoMark className="h-5" />
          <div>
            <p className="font-display font-bold text-sm leading-none">TCD BACKOFFICE</p>
            <p className="text-[10px] text-amber tracking-[0.18em] uppercase mt-1">Gestión interna</p>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 flex-1">
          {[
            { id: "overview", label: "Dashboard", icon: <File className="w-4 h-4" /> },
            { id: "courses", label: "Cursos y Formación", icon: <Grad className="w-4 h-4" />, badge: coursesList.length },
            { id: "news", label: "Noticias", icon: <Spark className="w-4 h-4" />, badge: rssQueue.length },
            { id: "cases", label: "Casos y Recogidas", icon: <Cube className="w-4 h-4" />, badge: cases.length },
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
          <Link href="/formacion" target="_blank" className="flex items-center justify-between px-3 py-2 rounded-lg text-white/60 hover:bg-white/5 hover:text-white">
            <span>Ver Formación / Noticias</span><span>↗</span>
          </Link>
          <button onClick={() => setUnlocked(false)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10">
            <Lock className="w-3.5 h-3.5" />Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ÁREA DE TRABAJO */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-black/5 px-6 lg:px-8 h-16 flex items-center justify-between">
          <p className="font-display font-semibold text-base">
            {section === "overview" && "Dashboard · Vista general"}
            {section === "courses" && "Cursos y Formación"}
            {section === "news" && "Noticias y Actualidad RSS"}
            {section === "cases" && "Bandeja de prescripciones STL/DICOM y recogidas"}
            {section === "clinics" && "Control de altas, DNI/colegiado y tarifas privadas"}
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline-block text-graphite/50">{emailInput}</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">Admin activo</span>
          </div>
        </header>

        <div className="p-6 lg:p-8 max-w-7xl w-full space-y-6">
          {/* 1. DASHBOARD VISUAL CON PESTAÑAS FORMACIÓN / NOTICIAS */}
          {section === "overview" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  ["Cursos publicados", coursesList.filter((p) => p.status === "published").length, `${coursesList.filter((p) => p.status === "draft").length} en borrador`],
                  ["Noticias publicadas", newsList.filter((p) => p.status === "published").length, `${newsList.filter((p) => p.status === "draft").length} en borrador`],
                  ["RSS pendientes", rssQueue.length, "Cron automático semanal"],
                  ["Clínicas por validar", pendingClinicsCount, "Esperando tarifas"],
                ].map(([lbl, val, sub]) => (
                  <div key={String(lbl)} className="bg-white rounded-2xl p-5 border border-black/5 shadow-xs">
                    <p className="text-xs text-graphite/55 font-medium">{lbl}</p>
                    <p className="font-display text-3xl font-bold mt-1">{val}</p>
                    <p className="text-[11px] text-graphite/40 mt-1">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Resumen visual rápido con pestañas Formación / Noticias */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-1.5 bg-white p-1.5 rounded-full border border-black/5">
                    <button onClick={() => setOverviewTab("course")} className={`px-4 py-1.5 rounded-full text-xs font-semibold ${overviewTab === "course" ? "bg-graphite text-white" : "text-graphite/60"}`}>
                      Formación y Cursos ({coursesList.length})
                    </button>
                    <button onClick={() => setOverviewTab("news")} className={`px-4 py-1.5 rounded-full text-xs font-semibold ${overviewTab === "news" ? "bg-graphite text-white" : "text-graphite/60"}`}>
                      Noticias ({newsList.length})
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startNewInEditor("course")} className="btn btn-ghost !py-2 !px-3.5 text-xs">+ Nuevo curso</button>
                    <button onClick={() => startNewInEditor("news")} className="btn btn-primary !py-2 !px-3.5 text-xs">+ Nueva noticia</button>
                  </div>
                </div>
                {renderPostTable(overviewTab === "course" ? coursesList : newsList, overviewTab)}
              </div>
            </>
          )}

          {/* 2. APARTADO CURSOS Y FORMACIÓN (SIMÉTRICO) */}
          {section === "courses" && (
            <div className="space-y-6">
              <div className="flex gap-2 border-b border-black/10 pb-3">
                <button onClick={() => setCourseTab("list")} className={`px-4 py-2 rounded-xl text-xs font-semibold ${courseTab === "list" ? "bg-graphite text-white" : "bg-white text-graphite/65"}`}>
                  Listado de Cursos ({coursesList.length})
                </button>
                <button onClick={() => { if (editorKind !== "course") startNewInEditor("course"); else setCourseTab("editor"); }} className={`px-4 py-2 rounded-xl text-xs font-semibold ${courseTab === "editor" ? "bg-graphite text-white" : "bg-white text-graphite/65"}`}>
                  {editingId && editorKind === "course" ? "Editando curso" : "+ Editor visual de Cursos"}
                </button>
              </div>
              {courseTab === "list" ? renderPostTable(coursesList, "course") : renderWysiwyg("course")}
            </div>
          )}

          {/* 3. APARTADO NOTICIAS (SIMÉTRICO + CRON RSS) */}
          {section === "news" && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 border-b border-black/10 pb-3">
                <button onClick={() => setNewsTab("list")} className={`px-4 py-2 rounded-xl text-xs font-semibold ${newsTab === "list" ? "bg-graphite text-white" : "bg-white text-graphite/65"}`}>
                  Listado de Noticias ({newsList.length})
                </button>
                <button onClick={() => { if (editorKind !== "news") startNewInEditor("news"); else setNewsTab("editor"); }} className={`px-4 py-2 rounded-xl text-xs font-semibold ${newsTab === "editor" ? "bg-graphite text-white" : "bg-white text-graphite/65"}`}>
                  {editingId && editorKind === "news" ? "Editando noticia" : "+ Editor visual de Noticias"}
                </button>
                <button onClick={() => setNewsTab("rss")} className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${newsTab === "rss" ? "bg-graphite text-white" : "bg-white text-graphite/65"}`}>
                  <Spark className="w-3.5 h-3.5 text-amber" />Noticias Automáticas (Cron RSS)
                  {rssQueue.length > 0 && <span className="px-1.5 py-0.5 rounded-full bg-amber text-graphite text-[10px] font-bold">{rssQueue.length}</span>}
                </button>
              </div>

              {newsTab === "list" && renderPostTable(newsList, "news")}
              {newsTab === "editor" && renderWysiwyg("news")}
              {newsTab === "rss" && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-lg">Fuentes RSS conectadas (sin competencia directa)</h2>
                      <p className="text-xs text-graphite/60 mt-1">
                        Cron semanal sobre <strong>PubMed Ortodoncia</strong>, <strong>SEDO</strong> y <strong>Sleep Medicine Reviews</strong>. Envío de aviso por email a <code>alberto@tcdortodoncia.com</code> antes de publicar.
                      </p>
                    </div>
                    <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold shrink-0">Cron RSS activo ✓</span>
                  </div>

                  {rssQueue.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center text-sm text-graphite/60 border border-black/5">No quedan noticias automáticas pendientes de aprobar.</div>
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
                            <button onClick={() => editRssInEditor(item)} className="btn btn-ghost !py-2 !px-4 text-xs">Editar en Tiptap</button>
                            <button onClick={() => setRssQueue((q) => q.filter((x) => x.id !== item.id))} className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-full">Descartar</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 4. CASOS Y RECOGIDAS */}
          {section === "cases" && (
            <div className="bg-white rounded-2xl border border-black/5 overflow-x-auto">
              <div className="px-6 py-4 border-b border-black/5">
                <h2 className="font-display text-lg">Casos digitales y recogidas recibidas</h2>
                <p className="text-xs text-graphite/55">Enrutados automáticamente por sede (Santander / Las Palmas).</p>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-bone text-xs uppercase tracking-wider text-graphite/55 border-b border-black/5">
                  <tr>
                    <th className="px-5 py-3.5">Ref.</th>
                    <th className="px-5 py-3.5">Clínica / Doctor</th>
                    <th className="px-5 py-3.5">Aparato / Entrada</th>
                    <th className="px-5 py-3.5">Sede</th>
                    <th className="px-5 py-3.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {cases.map((c) => (
                    <tr key={c.id}>
                      <td className="px-5 py-4 font-mono text-xs font-bold">{c.id}<div className="font-sans font-normal text-graphite/45">{c.date}</div></td>
                      <td className="px-5 py-4"><p className="font-semibold">{c.clinic}</p><p className="text-xs text-graphite/55">{c.doctor}</p></td>
                      <td className="px-5 py-4"><p className="font-medium">{c.product}</p><p className="text-xs text-graphite/50">{c.type}</p></td>
                      <td className="px-5 py-4 text-xs font-semibold">{c.lab}</td>
                      <td className="px-5 py-4">
                        <select
                          value={c.stage}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCases((list) => list.map((x) => x.id === c.id ? { ...x, stage: val } : x));
                            showToast(`Caso ${c.id} actualizado a "${val}".`);
                          }}
                          className="text-xs font-semibold rounded-full px-3 py-1.5 bg-bone border border-black/10 outline-none"
                        >
                          <option>Recibido</option>
                          <option>En diseño CAD</option>
                          <option>Producción 8h</option>
                          <option>Enviado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 5. VALIDAR CLÍNICAS */}
          {section === "clinics" && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-5 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Notificación automática por correo electrónico</p>
                    <p className="text-xs text-graphite/60">Al autorizar una clínica nueva se le envía automáticamente su correo de bienvenida con acceso a tarifas privadas.</p>
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
