"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import RichEditor from "@/components/RichEditor";
import {
  BackofficePost, PostKind, PostStatus, AutoNews, PendingClinic, LabCase,
  BACKOFFICE_STORAGE_KEY, INITIAL_POSTS, INITIAL_RSS, INITIAL_CASES, INITIAL_CLINICS, CHANGELOG_ENTRIES, toSlug,
} from "@/lib/backoffice";
import {
  Grad, Spark, Plus, Lock, Check, Arrow, File, Upload, Shield, User, Cube,
  ListIcon, EditIcon, TrashIcon, EyeIcon, RssIcon, MailIcon, Search, Clock,
} from "@/components/Icons";

type Section = "overview" | "courses" | "news" | "cases" | "clinics" | "changelog";
type CourseTab = "list" | "editor";
type NewsTab = "list" | "editor" | "rss";

interface AdminUser {
  email: string;
  pass: string;
  name: string;
  role: string;
}

const ADMIN_USERS: AdminUser[] = [
  { email: "alberto@tcdortodoncia.com", pass: "tcd2026", name: "Alberto", role: "Dirección · Santander" },
  { email: "juan@tcdortodoncia.com", pass: "tcd2026", name: "Juan Luis", role: "Dirección · Las Palmas" },
  { email: "administracion@tcdortodoncia.com", pass: "tcd2026", name: "Administración", role: "Equipo · TCD" },
];

const LOADING_STEPS = [
  { pct: 24, msg: "Verificando credenciales de sesión…" },
  { pct: 54, msg: "Sincronizando publicaciones y feeds RSS…" },
  { pct: 82, msg: "Cargando bandeja de casos STL/DICOM y clínicas…" },
  { pct: 100, msg: "Inicializando panel privado TCD…" },
];

const SESSION_KEY = "tcd_admin_session_v1";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [activeAdmin, setActiveAdmin] = useState<AdminUser>(ADMIN_USERS[0]);
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const [section, setSection] = useState<Section>("overview");
  const [overviewTab, setOverviewTab] = useState<PostKind>("course");
  const [courseTab, setCourseTab] = useState<CourseTab>("list");
  const [newsTab, setNewsTab] = useState<NewsTab>("list");
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");
  const [selectedLogId, setSelectedLogId] = useState<string | null>(CHANGELOG_ENTRIES[0].id);
  const [logSearch, setLogSearch] = useState("");

  const [posts, setPosts] = useState<BackofficePost[]>(INITIAL_POSTS);
  const [rssQueue, setRssQueue] = useState<AutoNews[]>(INITIAL_RSS);
  const [rssLoading, setRssLoading] = useState(false);
  const [rssLastSync, setRssLastSync] = useState<string | null>(null);
  const [cases, setCases] = useState<LabCase[]>(INITIAL_CASES);
  const [clinics, setClinics] = useState<PendingClinic[]>(INITIAL_CLINICS);
  const [notifyOnApprove, setNotifyOnApprove] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Editor state
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
      const sess = sessionStorage.getItem(SESSION_KEY);
      if (sess) {
        const found = ADMIN_USERS.find((u) => u.email === sess);
        if (found) {
          setActiveAdmin(found);
          setEmailInput(found.email);
          setUnlocked(true);
        }
      }
    } catch {}
  }, []);

  const enterPlatform = (user: AdminUser) => {
    setAuthError(null);
    setActiveAdmin(user);
    setLoadingStep(0);
    setAuthLoading(true);
    try { sessionStorage.setItem(SESSION_KEY, user.email); } catch {}
    setTimeout(() => setLoadingStep(1), 550);
    setTimeout(() => setLoadingStep(2), 1150);
    setTimeout(() => setLoadingStep(3), 1750);
    setTimeout(() => {
      setAuthLoading(false);
      setUnlocked(true);
    }, 2350);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const found = ADMIN_USERS.find((u) => u.email === cleanEmail && u.pass === passInput.trim());
    if (!found) {
      setAuthError("Usuario o contraseña provisional incorrectos.");
      return;
    }
    enterPlatform(found);
  };

  const handleLogout = () => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
    setPassInput("");
    setAuthError(null);
    setUnlocked(false);
  };

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

  const syncRssNow = async () => {
    setRssLoading(true);
    try {
      const res = await fetch("/api/rss");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
          setRssQueue(data.items);
          setRssLastSync(new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));
          showToast(`Sincronizadas ${data.items.length} noticias reales de PubMed y Prensa Dental.`);
        } else {
          showToast("No se encontraron artículos nuevos en este momento.");
        }
      }
    } catch {
      showToast("No se pudo conectar con los feeds RSS en este momento.");
    } finally {
      setRssLoading(false);
    }
  };

  const approveRss = (item: AutoNews) => {
    const linkHtml = item.url ? `<p><a href="${item.url}" target="_blank" rel="nofollow noopener noreferrer">Leer fuente original ↗</a></p>` : "";
    const p: BackofficePost = {
      id: item.id,
      kind: "news",
      tag: "Actualidad científica",
      date: item.date,
      title: item.title,
      slug: toSlug(item.title),
      metaTitle: item.title,
      metaDesc: item.summary,
      html: `<p>${item.summary}</p>${linkHtml}`,
      image: "/assets/tcd/laboratorio-tcd.jpg",
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
    setCoverImg("/assets/tcd/laboratorio-tcd.jpg");
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

  if (authLoading) {
    const currentStep = LOADING_STEPS[loadingStep] || LOADING_STEPS[0];
    return (
      <div className="min-h-screen bg-[#0d1014] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-tech opacity-35 pointer-events-none" />
        <div className="relative z-10 max-w-sm w-full text-center space-y-6">
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-[#161a20] border border-white/10 grid place-items-center shadow-2xl">
            <LogoMark className="h-7" />
            <span className="absolute -inset-1 rounded-[26px] border-2 border-amber/30 border-t-amber animate-spin" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">Acceso verificado</p>
            <h2 className="font-display text-2xl font-bold tracking-tight">Bienvenido, {activeAdmin.name}</h2>
            <p className="text-sm text-white/60">{activeAdmin.role}</p>
          </div>
          <div className="space-y-2.5">
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber to-emerald-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${currentStep.pct}%` }}
              />
            </div>
            <p className="font-mono text-xs text-white/45 transition-opacity duration-300">
              {currentStep.msg}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#0d1014] text-white flex flex-col justify-between p-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-tech opacity-40 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between max-w-6xl w-full mx-auto">
          <div className="flex items-center gap-3">
            <LogoMark className="h-6" />
            <span className="font-display font-bold tracking-tight text-lg">TCD <span className="text-white/40 font-normal text-xs tracking-[0.22em] ml-1">BACKOFFICE</span></span>
          </div>
          <Link href="/" className="text-sm text-white/60 hover:text-amber transition-colors">← Volver a web pública</Link>
        </div>

        <div className="relative z-10 max-w-md w-full mx-auto bg-[#161a20] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center gap-3.5">
            <span className="w-12 h-12 rounded-2xl bg-amber text-graphite grid place-items-center shrink-0"><Lock className="w-5 h-5" /></span>
            <div>
              <h1 className="font-display text-2xl leading-none">Administración TCD</h1>
              <p className="text-white/55 text-sm mt-1">Acceso privado para dirección y equipo</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/75 mb-1.5">Correo electrónico</label>
              <input
                required
                type="email"
                value={emailInput}
                onChange={(e) => { setEmailInput(e.target.value); setAuthError(null); }}
                placeholder="nombre@tcdortodoncia.com"
                className="input input-dark text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/75 mb-1.5">Contraseña</label>
              <input
                required
                type="password"
                value={passInput}
                onChange={(e) => { setPassInput(e.target.value); setAuthError(null); }}
                placeholder="••••••••"
                className="input input-dark text-sm"
              />
            </div>
            {authError && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3.5 py-2.5">
                {authError}
              </p>
            )}
            <button type="submit" className="btn btn-primary w-full justify-center">Acceder al panel privado<Arrow /></button>
          </form>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
            <span>Acceso cifrado · SIKKER SVAR S.L.</span>
            <span>Santander · Las Palmas</span>
          </div>
        </div>

        <p className="relative z-10 text-center text-xs text-white/35">SIKKER SVAR S.L. · Uso interno exclusivo</p>
      </div>
    );
  }

  const coursesList = posts.filter((p) => p.kind === "course");
  const newsList = posts.filter((p) => p.kind === "news");
  const pendingClinicsCount = clinics.filter((c) => !c.approved).length;
  const filteredChangelog = CHANGELOG_ENTRIES.filter((entry) => {
    const q = logSearch.trim().toLowerCase();
    if (!q) return true;
    const haystack = [
      entry.version,
      entry.date,
      entry.title,
      entry.tag,
      entry.summary,
      ...entry.details.flatMap((d) => [d.area, ...d.items]),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  const renderPostTable = (items: BackofficePost[], kind: PostKind) => {
    const activeItems = items.filter((p) => p.status !== "trash");
    const trashItems = items.filter((p) => p.status === "trash");
    const filtered = statusFilter === "all" ? activeItems : items.filter((p) => p.status === statusFilter);
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {([
              ["all", `Todos (${activeItems.length})`],
              ["published", "Publicados"],
              ["draft", "Borradores"],
              ["trash", `Papelera (${trashItems.length})`],
            ] as const).map(([k, lbl]) => (
              <button
                key={k}
                onClick={() => setStatusFilter(k)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === k ? "bg-white text-graphite shadow-xs ring-1 ring-slate-200" : "text-slate-500 hover:text-graphite"}`}
              >
                {lbl}
              </button>
            ))}
          </div>
          <button onClick={() => startNewInEditor(kind)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber text-graphite hover:bg-sun text-xs font-semibold shadow-xs transition-colors">
            <Plus className="w-4 h-4" />{kind === "course" ? "Nuevo curso" : "Nueva noticia"}
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              {statusFilter === "trash" ? "La papelera está vacía." : "No hay elementos en este filtro."}
            </div>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start gap-4 min-w-0">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-20 h-14 rounded-xl object-cover shrink-0 border border-slate-200" />
                  ) : (
                    <div className="w-20 h-14 rounded-xl bg-slate-100 text-slate-400 grid place-items-center shrink-0 border border-slate-200">
                      {kind === "course" ? <Grad className="w-5 h-5" /> : <Spark className="w-5 h-5" />}
                    </div>
                  )}

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">{p.tag}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{p.date}</span>
                      <span className={`ml-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.status === "published"
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70"
                          : p.status === "trash"
                          ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200/70"
                          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.status === "published" ? "bg-emerald-500" : p.status === "trash" ? "bg-rose-500" : "bg-slate-400"}`} />
                        {p.status === "published" ? "Publicado" : p.status === "trash" ? "En papelera" : "Borrador"}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-[15px] text-graphite leading-snug">{p.title}</h3>
                    <p className="text-xs font-mono text-slate-400 truncate">/formacion/{p.slug}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {p.status === "trash" ? (
                    <>
                      <button
                        onClick={() => {
                          savePosts(posts.map((x) => (x.id === p.id ? { ...x, status: "draft" } : x)));
                          showToast("Restaurado a borradores.");
                        }}
                        className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        Restaurar
                      </button>
                      <button
                        onClick={() => {
                          savePosts(posts.filter((x) => x.id !== p.id));
                          showToast("Eliminado permanentemente.");
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />Eliminar permanentemente
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => openInEditor(p)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        <EditIcon className="w-3.5 h-3.5" />Editar
                      </button>
                      <button
                        onClick={() => savePosts(posts.map((x) => x.id === p.id ? { ...x, status: x.status === "published" ? "draft" : "published" } : x))}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-medium transition-colors"
                      >
                        <EyeIcon className="w-3.5 h-3.5" />{p.status === "published" ? "Ocultar" : "Publicar"}
                      </button>
                      <button
                        onClick={() => {
                          savePosts(posts.map((x) => (x.id === p.id ? { ...x, status: "trash" } : x)));
                          showToast("Movido a la papelera.");
                        }}
                        title="Mover a papelera"
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderWysiwyg = (kind: PostKind) => (
    <div className="grid lg:grid-cols-[1fr_350px] gap-6 items-start">
      <div className="space-y-5 min-w-0">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!editingId) setSlug(toSlug(e.target.value));
            }}
            placeholder={kind === "course" ? "Título del curso o taller…" : "Titular de la noticia…"}
            className="w-full font-display text-2xl sm:text-3xl font-bold outline-none placeholder:text-slate-300"
          />
          <p className="text-xs font-mono text-slate-400 mt-2.5">
            URL pública: https://tcdortodoncia.com/formacion/<span className="text-slate-700">{slug || toSlug(title) || "nueva-entrada"}</span>
          </p>
        </div>

        <RichEditor value={html} onChange={setHtml} />
      </div>

      <aside className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-5 p-6">
        <div className="grid grid-cols-2 gap-2.5">
          <button type="button" onClick={() => handleSavePost("draft")} className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold whitespace-nowrap transition-colors">
            Guardar borrador
          </button>
          <button type="button" onClick={() => handleSavePost("published")} className="px-3 py-2.5 rounded-xl bg-amber hover:bg-sun text-graphite text-xs font-semibold whitespace-nowrap shadow-xs transition-colors">
            Publicar
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 text-xs font-semibold">
          <button type="button" onClick={() => setInspectorTab("doc")} className={`py-2 rounded-lg flex items-center justify-center gap-1.5 ${inspectorTab === "doc" ? "bg-white shadow-xs text-graphite" : "text-slate-500"}`}>
            <File className="w-3.5 h-3.5" />Documento
          </button>
          <button type="button" onClick={() => setInspectorTab("seo")} className={`py-2 rounded-lg flex items-center justify-center gap-1.5 ${inspectorTab === "seo" ? "bg-white shadow-xs text-graphite" : "text-slate-500"}`}>
            <Search className="w-3.5 h-3.5" />SEO &amp; Google
          </button>
        </div>

        {inspectorTab === "doc" ? (
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Categoría</label>
              <select value={tag} onChange={(e) => setTag(e.target.value)} className="input !py-2.5 text-sm">
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
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fecha o convocatoria</label>
              <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Ej. Marzo 2027" className="input !py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Imagen destacada</label>
              {coverImg && (
                <div className="relative rounded-xl overflow-hidden mb-2.5 h-36 border border-slate-200">
                  <img src={coverImg} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setCoverImg("")} className="absolute top-2 right-2 bg-black/75 text-white text-xs px-2.5 py-1 rounded-lg">Quitar</button>
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-dashed border-slate-300 hover:border-amber cursor-pointer bg-slate-50 text-xs font-medium text-slate-600">
                <Upload className="w-4 h-4 text-amber" />
                <span>{coverImg ? "Cambiar imagen" : "Subir imagen destacada"}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Slug URL</label>
              <input value={slug} onChange={(e) => setSlug(toSlug(e.target.value))} placeholder="url-amigable" className="input !py-2 text-xs font-mono" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-600">Meta Title</label>
                <span className={(metaTitle || title).length > 60 ? "text-rose-600 font-bold" : "text-slate-400"}>{(metaTitle || title).length}/60</span>
              </div>
              <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={title || "Título en Google"} className="input !py-2 text-sm" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-600">Meta Description</label>
                <span className={metaDesc.length > 160 ? "text-rose-600 font-bold" : "text-slate-400"}>{metaDesc.length}/160</span>
              </div>
              <textarea rows={3} value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} placeholder="Descripción para buscadores e IA..." className="input !py-2 text-sm" />
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">Vista previa en Google</p>
              <p className="text-xs text-emerald-700 truncate">tcdortodoncia.com › formacion › {slug || "articulo"}</p>
              <p className="text-sm font-semibold text-blue-700 leading-snug line-clamp-1">{metaTitle || title || "Título · TCD Ortodoncia"}</p>
              <p className="text-xs text-slate-600 line-clamp-2">{metaDesc || "Resumen optimizado para buscadores."}</p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#f6f7f9] text-graphite flex flex-col lg:flex-row">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-graphite text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber/40 text-sm font-medium flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white grid place-items-center"><Check className="w-3.5 h-3.5" /></span>
          {toast}
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="lg:w-68 lg:h-full bg-[#12151a] text-white flex flex-col shrink-0 border-r border-white/5">
        <div className="p-6 border-b border-white/10 flex items-center gap-3 shrink-0">
          <LogoMark className="h-5" />
          <div>
            <p className="font-display font-bold text-sm leading-none">TCD BACKOFFICE</p>
            <p className="text-[11px] text-amber tracking-[0.16em] uppercase mt-1">Gestión interna</p>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {[
            { id: "overview", label: "Dashboard", icon: <File className="w-4 h-4" /> },
            { id: "courses", label: "Cursos y Formación", icon: <Grad className="w-4 h-4" />, badge: coursesList.filter((p) => p.status !== "trash").length },
            { id: "news", label: "Noticias", icon: <Spark className="w-4 h-4" />, badge: rssQueue.length },
            { id: "cases", label: "Casos y Archivos STL", icon: <Cube className="w-4 h-4" />, badge: cases.length },
            { id: "clinics", label: "Aprobar clínicas", icon: <User className="w-4 h-4" />, badge: pendingClinicsCount },
            { id: "changelog", label: "Registro de cambios", icon: <Clock className="w-4 h-4" />, badge: CHANGELOG_ENTRIES.length },
          ].map((item) => {
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id as Section)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? "bg-amber text-graphite font-semibold shadow" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
              >
                <span className="flex items-center gap-3">{item.icon}{item.label}</span>
                {item.badge ? (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${active ? "bg-graphite text-white" : "bg-white/10 text-white/80"}`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2 text-sm shrink-0">
          <Link href="/formacion" target="_blank" className="flex items-center justify-between px-3 py-2 rounded-lg text-white/65 hover:bg-white/5 hover:text-white">
            <span>Ver Formación pública</span><span>↗</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10">
            <Lock className="w-4 h-4" />Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 lg:h-full lg:overflow-y-auto">
        <header className="bg-white border-b border-slate-200/80 px-6 lg:px-10 h-16 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <h1 className="font-display font-semibold text-lg text-graphite">
            {section === "overview" && "Dashboard · Vista general"}
            {section === "courses" && "Cursos y Formación"}
            {section === "news" && "Noticias y Actualidad RSS"}
            {section === "cases" && "Casos recibidos, archivos STL/DICOM y recogidas"}
            {section === "clinics" && "Aprobar clínicas nuevas y acceso a tarifas"}
            {section === "changelog" && "Registro de cambios y actualizaciones"}
          </h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline-block text-slate-500">{activeAdmin.name} · {activeAdmin.email}</span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 text-xs font-semibold">Admin activo</span>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl w-full space-y-8">
          {/* 1. DASHBOARD */}
          {section === "overview" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { lbl: "Cursos publicados", val: coursesList.filter((p) => p.status === "published").length, sub: `${coursesList.filter((p) => p.status === "draft").length} en borrador`, icon: <Grad className="w-5 h-5" /> },
                  { lbl: "Noticias publicadas", val: newsList.filter((p) => p.status === "published").length, sub: `${newsList.filter((p) => p.status === "draft").length} en borrador`, icon: <Spark className="w-5 h-5" /> },
                  { lbl: "RSS pendientes", val: rssQueue.length, sub: "Cron semanal", icon: <RssIcon className="w-5 h-5" /> },
                  { lbl: "Clínicas por aprobar", val: pendingClinicsCount, sub: "Esperando tarifas", icon: <User className="w-5 h-5" /> },
                ].map((k) => (
                  <div key={k.lbl} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500 font-medium">{k.lbl}</p>
                      <p className="font-display text-3xl font-bold mt-2">{k.val}</p>
                      <p className="text-xs text-slate-400 mt-1">{k.sub}</p>
                    </div>
                    <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 grid place-items-center shrink-0">{k.icon}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200/80 shadow-xs">
                    <button
                      onClick={() => { setOverviewTab("course"); setStatusFilter("all"); }}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${overviewTab === "course" ? "bg-graphite text-white" : "text-slate-600 hover:text-graphite"}`}
                    >
                      <Grad className="w-4 h-4" />Formación y Cursos ({coursesList.filter((p) => p.status !== "trash").length})
                    </button>
                    <button
                      onClick={() => { setOverviewTab("news"); setStatusFilter("all"); }}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${overviewTab === "news" ? "bg-graphite text-white" : "text-slate-600 hover:text-graphite"}`}
                    >
                      <Spark className="w-4 h-4" />Noticias ({newsList.filter((p) => p.status !== "trash").length})
                    </button>
                  </div>
                </div>
                {renderPostTable(overviewTab === "course" ? coursesList : newsList, overviewTab)}
              </div>
            </>
          )}

          {/* 2. CURSOS Y FORMACIÓN */}
          {section === "courses" && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                <button
                  onClick={() => setCourseTab("list")}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${courseTab === "list" ? "bg-graphite text-white" : "bg-white text-slate-600 border border-slate-200 hover:text-graphite"}`}
                >
                  <ListIcon className="w-4 h-4" />Listado de Cursos ({coursesList.length})
                </button>
                <button
                  onClick={() => { if (editorKind !== "course") startNewInEditor("course"); else setCourseTab("editor"); }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${courseTab === "editor" ? "bg-graphite text-white" : "bg-white text-slate-600 border border-slate-200 hover:text-graphite"}`}
                >
                  <EditIcon className="w-4 h-4" />{editingId && editorKind === "course" ? "Editando curso" : "Editor visual de Cursos"}
                </button>
              </div>
              {courseTab === "list" ? renderPostTable(coursesList, "course") : renderWysiwyg("course")}
            </div>
          )}

          {/* 3. NOTICIAS + CRON RSS */}
          {section === "news" && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                <button
                  onClick={() => setNewsTab("list")}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${newsTab === "list" ? "bg-graphite text-white" : "bg-white text-slate-600 border border-slate-200 hover:text-graphite"}`}
                >
                  <ListIcon className="w-4 h-4" />Listado de Noticias ({newsList.length})
                </button>
                <button
                  onClick={() => { if (editorKind !== "news") startNewInEditor("news"); else setNewsTab("editor"); }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${newsTab === "editor" ? "bg-graphite text-white" : "bg-white text-slate-600 border border-slate-200 hover:text-graphite"}`}
                >
                  <EditIcon className="w-4 h-4" />{editingId && editorKind === "news" ? "Editando noticia" : "Editor visual de Noticias"}
                </button>
                <button
                  onClick={() => setNewsTab("rss")}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${newsTab === "rss" ? "bg-graphite text-white" : "bg-white text-slate-600 border border-slate-200 hover:text-graphite"}`}
                >
                  <RssIcon className="w-4 h-4 text-amber" />Noticias Automáticas (Cron RSS)
                  {rssQueue.length > 0 && <span className="px-2 py-0.5 rounded-full bg-amber text-graphite text-xs font-bold">{rssQueue.length}</span>}
                </button>
              </div>

              {newsTab === "list" && renderPostTable(newsList, "news")}
              {newsTab === "editor" && renderWysiwyg("news")}
              {newsTab === "rss" && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <span className="w-10 h-10 rounded-xl bg-amber/15 text-amber grid place-items-center shrink-0"><RssIcon className="w-5 h-5" /></span>
                      <div>
                        <h2 className="font-display text-lg font-semibold">Fuentes RSS conectadas en vivo (sin competencia directa)</h2>
                        <p className="text-sm text-slate-500 mt-1">
                          Lectura directa de <strong>PubMed Ortodoncia / Apnea</strong> y <strong>Prensa Dental Española</strong> filtrando marcas competidoras.
                          {rssLastSync && <span className="ml-2 text-emerald-700 font-medium">· Última sincronización: {rssLastSync}</span>}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={syncRssNow}
                      disabled={rssLoading}
                      className="px-4 py-2.5 rounded-xl bg-amber hover:bg-sun text-graphite text-xs font-semibold shadow-xs shrink-0 disabled:opacity-50 transition-colors"
                    >
                      {rssLoading ? "Sincronizando…" : "↻ Sincronizar RSS ahora"}
                    </button>
                  </div>

                  {rssQueue.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center text-sm text-slate-500 border border-slate-200/80">No quedan noticias automáticas pendientes de aprobar.</div>
                  ) : (
                    <div className="space-y-4">
                      {rssQueue.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-14 rounded-xl bg-slate-100 text-slate-500 grid place-items-center shrink-0 border border-slate-200">
                              <RssIcon className="w-5 h-5" />
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">{item.source}</span>
                                <span className="text-slate-400">· {item.date}</span>
                              </div>
                              <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                              <p className="text-sm text-slate-500 leading-relaxed">{item.summary}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 shrink-0">
                            <button onClick={() => approveRss(item)} className="btn btn-primary !py-2.5 !px-4 text-xs"><Check className="w-3.5 h-3.5" />Aprobar y publicar</button>
                            <button onClick={() => editRssInEditor(item)} className="btn btn-ghost !py-2.5 !px-4 text-xs"><EditIcon className="w-3.5 h-3.5" />Editar</button>
                            <button onClick={() => setRssQueue((q) => q.filter((x) => x.id !== item.id))} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg" title="Descartar"><TrashIcon className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 4. CASOS Y ARCHIVOS STL/DICOM */}
          {section === "cases" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto">
              <div className="px-6 py-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-semibold">Casos digitales (STL / DICOM) y recogidas</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Enrutados automáticamente al servidor NAS de Santander o Las Palmas según la clínica.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold shrink-0">Enrutado NAS activo</span>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                  <tr>
                    <th className="px-6 py-3.5">Ref.</th>
                    <th className="px-6 py-3.5">Clínica / Doctor</th>
                    <th className="px-6 py-3.5">Aparato y archivos adjuntos</th>
                    <th className="px-6 py-3.5">Destino</th>
                    <th className="px-6 py-3.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cases.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60">
                      <td className="px-6 py-4 font-mono text-xs font-bold">{c.id}<div className="font-sans font-normal text-slate-400 mt-0.5">{c.date}</div></td>
                      <td className="px-6 py-4"><p className="font-semibold">{c.clinic}</p><p className="text-xs text-slate-500 mt-0.5">{c.doctor}</p></td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{c.product}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {c.files.map((f) => (
                            <button
                              key={f}
                              type="button"
                              onClick={() => showToast(`Descargando ${f} desde ${c.lab} (demo)…`)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 hover:bg-amber/25 text-slate-700 font-mono text-[11px] transition-colors"
                            >
                              <File className="w-3 h-3 text-slate-400" />{f}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">{c.lab}</td>
                      <td className="px-6 py-4">
                        <select
                          value={c.stage}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCases((list) => list.map((x) => x.id === c.id ? { ...x, stage: val } : x));
                            showToast(`Caso ${c.id} actualizado a "${val}".`);
                          }}
                          className="text-xs font-semibold rounded-lg px-3 py-2 bg-slate-100 border border-slate-200 outline-none"
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
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <span className="w-10 h-10 rounded-xl bg-amber/15 text-amber grid place-items-center shrink-0"><MailIcon className="w-5 h-5" /></span>
                  <div>
                    <p className="font-semibold text-sm">Notificación automática por correo electrónico</p>
                    <p className="text-sm text-slate-500 mt-0.5">Al autorizar una clínica nueva se le envía automáticamente su correo de bienvenida con acceso a tarifas privadas.</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm font-semibold shrink-0 cursor-pointer">
                  <input type="checkbox" checked={notifyOnApprove} onChange={(e) => setNotifyOnApprove(e.target.checked)} />
                  Aviso email activo
                </label>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                    <tr>
                      <th className="px-6 py-3.5">Clínica / Doctor</th>
                      <th className="px-6 py-3.5">DNI / Col.</th>
                      <th className="px-6 py-3.5">Sede</th>
                      <th className="px-6 py-3.5">Estado tarifas</th>
                      <th className="px-6 py-3.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clinics.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/60">
                        <td className="px-6 py-4">
                          <p className="font-semibold">{c.clinic}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{c.doctor} · {c.email}</p>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-slate-600">
                          <div>{c.dni}</div>
                          <div className="mt-0.5">Col. {c.colegiado}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">{c.lab}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${c.approved ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-amber/15 text-amber-900 ring-1 ring-amber/30"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${c.approved ? "bg-emerald-500" : "bg-amber"}`} />
                            {c.approved ? "Autorizada" : "Pendiente"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => toggleClinicApproval(c.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${c.approved ? "bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600" : "bg-graphite text-white hover:bg-amber hover:text-graphite"}`}
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

          {/* 6. REGISTRO DE CAMBIOS (TIMELINE VERTICAL CENTRADO + BUSCADOR + ACORDEÓN) */}
          {section === "changelog" && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Buscador */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    placeholder="Buscar en el historial por título o detalle (ej. Tiptap, RSS, Bilbao, SEO)…"
                    className="input !pl-10 !py-2.5 text-sm"
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500 shrink-0">
                  {filteredChangelog.length} {filteredChangelog.length === 1 ? "actualización" : "actualizaciones"}
                </span>
              </div>

              {/* Timeline vertical acordeón */}
              {filteredChangelog.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80 space-y-3">
                  <p className="text-sm text-slate-500">No hay cambios que coincidan con “{logSearch}”.</p>
                  <button type="button" onClick={() => setLogSearch("")} className="text-xs font-semibold text-amber hover:underline">
                    Limpiar búsqueda
                  </button>
                </div>
              ) : (
                <div className="relative border-l-2 border-slate-200 ml-3 sm:ml-4 pl-6 sm:pl-8 space-y-5">
                  {filteredChangelog.map((entry, idx) => {
                    const isOpen = logSearch.trim().length > 0 || selectedLogId === entry.id;
                    return (
                      <div key={entry.id} className="relative">
                        {/* Punto en la línea temporal */}
                        <span
                          className={`absolute -left-[33px] sm:-left-[41px] top-6 w-4 h-4 rounded-full ring-4 ring-[#f6f7f9] transition-colors ${
                            idx === 0 || isOpen ? "bg-amber" : "bg-slate-300"
                          }`}
                        />

                        <div className={`bg-white rounded-2xl border transition-all overflow-hidden ${isOpen ? "border-amber/60 shadow-sm" : "border-slate-200/80 shadow-xs hover:border-slate-300"}`}>
                          <button
                            type="button"
                            onClick={() => setSelectedLogId(selectedLogId === entry.id ? null : entry.id)}
                            className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4"
                          >
                            <div className="space-y-1.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="font-mono font-bold px-2.5 py-0.5 rounded-md bg-graphite text-white">{entry.version}</span>
                                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">{entry.tag}</span>
                                <span className="text-slate-400">· {entry.date}</span>
                              </div>
                              <h2 className="font-display text-lg font-bold text-graphite leading-snug">{entry.title}</h2>
                              {!isOpen && <p className="text-sm text-slate-500 line-clamp-1">{entry.summary}</p>}
                            </div>
                            <span className={`w-8 h-8 rounded-full bg-slate-100 text-slate-600 grid place-items-center shrink-0 transition-transform duration-200 ${isOpen ? "rotate-45 bg-graphite text-white" : ""}`}>
                              <Plus className="w-4 h-4" />
                            </span>
                          </button>

                          {isOpen && (
                            <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-5">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{entry.summary}</p>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 text-xs font-semibold shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Desplegado en vivo
                                </span>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">
                                {entry.details.map((block) => (
                                  <div key={block.area} className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 sm:p-5 space-y-2.5">
                                    <h3 className="font-display font-semibold text-sm text-graphite">{block.area}</h3>
                                    <ul className="space-y-2">
                                      {block.items.map((it) => (
                                        <li key={it} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                          <span>{it}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
