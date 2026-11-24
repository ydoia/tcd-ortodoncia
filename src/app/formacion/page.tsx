"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Grad, Arrow, Spark } from "@/components/Icons";
import { BackofficePost, BACKOFFICE_STORAGE_KEY, INITIAL_POSTS, toSlug } from "@/lib/backoffice";

const MONTHS: Record<string, number> = {
  enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
  julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
};

function isCoursePast(dateStr: string, title: string) {
  const txt = `${dateStr} ${title}`.toLowerCase();
  if (/pasad|edici[oó]n anterior|congresos/i.test(txt)) return true;
  const yearMatch = txt.match(/\b(20\d{2})\b/);
  if (!yearMatch) return false;
  const year = parseInt(yearMatch[1], 10);
  let month = 11;
  for (const [m, idx] of Object.entries(MONTHS)) {
    if (txt.includes(m)) {
      month = idx;
      break;
    }
  }
  const eventEnd = new Date(year, month + 1, 0, 23, 59, 59);
  return eventEnd.getTime() < Date.now();
}

export default function FormacionPage() {
  const [posts, setPosts] = useState<BackofficePost[]>(INITIAL_POSTS);
  const [tab, setTab] = useState<"todos" | "formacion" | "noticias">("todos");

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

  const renderCard = (n: BackofficePost) => {
    const isCourse = n.kind === "course";
    const past = isCourse && isCoursePast(n.date, n.title);
    const articleHref = `/formacion/${n.slug || toSlug(n.title)}`;

    return (
      <article key={n.id} className="bg-white rounded-3xl overflow-hidden ring-1 ring-black/5 flex flex-col justify-between">
        <div>
          {n.image && (
            <Link href={articleHref} className="block h-44 overflow-hidden">
              <img src={n.image} alt={n.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </Link>
          )}
          <div className="p-7 pb-0">
            <div className="flex items-center justify-between text-xs">
              <span className="px-3 py-1 rounded-full bg-bone font-semibold">{n.tag}</span>
              <span className="text-graphite/45">{n.date}</span>
            </div>
            <h3 className="font-display text-2xl mt-4 leading-snug">
              <Link href={articleHref} className="hover:text-amber transition-colors">{n.title}</Link>
            </h3>
            <div className="text-graphite/60 text-sm mt-3 leading-relaxed space-y-2 line-clamp-3" dangerouslySetInnerHTML={{ __html: n.html }} />
          </div>
        </div>
        <div className="p-7 pt-5">
          {isCourse ? (
            past ? (
              <Link href={articleHref} className="pt-4 border-t border-graphite/10 flex items-center justify-between text-sm font-semibold hover:text-amber">
                <span>Ver resumen de la edición</span>
                <Arrow />
              </Link>
            ) : (
              <Link href="/contacto" className="pt-4 border-t border-graphite/10 flex items-center justify-between text-sm font-semibold hover:text-amber">
                <span>Solicitar plaza / inscripción</span>
                <Arrow />
              </Link>
            )
          ) : (
            <Link href={articleHref} className="pt-4 border-t border-graphite/10 flex items-center justify-between text-sm font-semibold hover:text-amber">
              <span>Leer noticia completa</span>
              <Arrow />
            </Link>
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
    </section>
  );
}
