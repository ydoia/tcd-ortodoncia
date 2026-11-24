"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Grad, Arrow, Spark, X } from "@/components/Icons";
import { BackofficePost, BACKOFFICE_STORAGE_KEY, INITIAL_POSTS } from "@/lib/backoffice";

export default function FormacionPage() {
  const [posts, setPosts] = useState<BackofficePost[]>(INITIAL_POSTS);
  const [tab, setTab] = useState<"todos" | "formacion" | "noticias">("todos");
  const [activePost, setActivePost] = useState<BackofficePost | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BACKOFFICE_STORAGE_KEY);
      if (saved) {
        const parsed: BackofficePost[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setPosts(parsed);
      }
    } catch {}
  }, []);

  const published = posts.filter((p) => p.status === "published");
  const courses = published.filter((p) => p.kind === "course");
  const news = published.filter((p) => p.kind === "news");

  const isPastCourse = (p: BackofficePost) =>
    /pasad|2023|2024|2025|congresos/i.test(`${p.date} ${p.title}`);

  const renderCard = (n: BackofficePost) => {
    const isCourse = n.kind === "course";
    const past = isCourse && isPastCourse(n);

    return (
      <article key={n.id} className="bg-white rounded-3xl overflow-hidden ring-1 ring-black/5 flex flex-col justify-between">
        <div>
          {n.image && (
            <div className="h-44 overflow-hidden">
              <img src={n.image} alt={n.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-7 pb-0">
            <div className="flex items-center justify-between text-xs">
              <span className="px-3 py-1 rounded-full bg-bone font-semibold">{n.tag}</span>
              <span className="text-graphite/45">{n.date}</span>
            </div>
            <h3 className="font-display text-2xl mt-4 leading-snug">{n.title}</h3>
            <div className="text-graphite/60 text-sm mt-3 leading-relaxed space-y-2 line-clamp-3" dangerouslySetInnerHTML={{ __html: n.html }} />
          </div>
        </div>
        <div className="p-7 pt-5">
          {isCourse ? (
            past ? (
              <button
                type="button"
                onClick={() => setActivePost(n)}
                className="w-full pt-4 border-t border-graphite/10 flex items-center justify-between text-sm font-semibold hover:text-amber text-left"
              >
                <span>Ver resumen de la edición</span>
                <Arrow />
              </button>
            ) : (
              <Link href="/contacto" className="pt-4 border-t border-graphite/10 flex items-center justify-between text-sm font-semibold hover:text-amber">
                <span>Solicitar plaza / inscripción</span>
                <Arrow />
              </Link>
            )
          ) : (
            <button
              type="button"
              onClick={() => setActivePost(n)}
              className="w-full pt-4 border-t border-graphite/10 flex items-center justify-between text-sm font-semibold hover:text-amber text-left"
            >
              <span>Leer noticia completa</span>
              <Arrow />
            </button>
          )}
        </div>
      </article>
    );
  };

  return (
    <section className="bg-bone py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 space-y-14">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="tag text-titanium">Actualización permanente</p>
            <h1 className="font-display text-4xl lg:text-5xl mt-3 leading-[1.05]">Formación y Noticias</h1>
            <p className="text-graphite/60 mt-3">
              Cursos propios de TCD Ortodoncia para equipos clínicos junto con novedades técnicas y actualidad científica del sector.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-full ring-1 ring-black/5 self-start">
            {[
              ["todos", "Todo"],
              ["formacion", `Formación y Cursos (${courses.length})`],
              ["noticias", `Noticias y Actualidad (${news.length})`],
            ].map(([k, lbl]) => (
              <button
                key={k}
                onClick={() => setTab(k as "todos" | "formacion" | "noticias")}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${tab === k ? "bg-graphite text-white" : "text-graphite/65 hover:text-graphite"}`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {(tab === "todos" || tab === "formacion") && (
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-graphite/10 pb-3">
              <Grad className="w-5 h-5 text-amber" />
              <h2 className="font-display text-2xl">Formación, Cursos y Talleres TCD</h2>
            </div>
            {courses.length === 0 ? (
              <p className="text-sm text-graphite/55">No hay convocatorias publicadas en este momento.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{courses.map(renderCard)}</div>
            )}
          </div>
        )}

        {(tab === "todos" || tab === "noticias") && (
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-graphite/10 pb-3">
              <Spark className="w-5 h-5 text-amber" />
              <h2 className="font-display text-2xl">Noticias y Actualidad del Sector</h2>
            </div>
            {news.length === 0 ? (
              <p className="text-sm text-graphite/55">No hay noticias publicadas en este momento.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{news.map(renderCard)}</div>
            )}
          </div>
        )}

        <div className="bg-graphite text-white rounded-3xl p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-2xl bg-amber text-graphite grid place-items-center shrink-0"><Grad /></span>
            <div>
              <h3 className="font-display text-2xl">¿Quieres organizar una sesión clínica o taller con TCD?</h3>
              <p className="text-white/60 text-sm mt-1">Preparamos formaciones a medida sobre flujo digital, cementado 3D y apnea para equipos clínicos.</p>
            </div>
          </div>
          <Link href="/contacto" className="btn btn-primary shrink-0">Proponer formación<Arrow /></Link>
        </div>
      </div>

      {/* Modal lector de noticia / resumen de formación pasada */}
      {activePost && (
        <div onClick={() => setActivePost(null)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">
            {activePost.image && (
              <div className="h-56 overflow-hidden">
                <img src={activePost.image} alt={activePost.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-7 sm:p-9 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-bone font-semibold">{activePost.tag}</span>
                  <span className="text-graphite/50">{activePost.date}</span>
                </div>
                <button onClick={() => setActivePost(null)} className="p-1.5 rounded-full hover:bg-bone" aria-label="Cerrar"><X /></button>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl leading-snug">{activePost.title}</h2>
              <div className="text-graphite/75 text-sm leading-relaxed space-y-3 [&_a]:text-amber [&_a]:font-semibold [&_a]:underline" dangerouslySetInnerHTML={{ __html: activePost.html }} />
              {activePost.kind === "course" && (
                <div className="pt-4 border-t border-graphite/10 flex justify-end">
                  <Link href="/contacto" className="btn btn-primary text-sm">Solicitar próxima edición<Arrow /></Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
