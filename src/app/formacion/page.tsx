"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Grad, Arrow, Spark } from "@/components/Icons";

type PostItem = {
  id: string;
  tag: string;
  date: string;
  title: string;
  slug?: string;
  html: string;
  image?: string;
  status: "published" | "draft";
};

const DEFAULT_POSTS: PostItem[] = [
  {
    id: "p1",
    tag: "Formación",
    date: "Próxima convocatoria",
    title: "Taller práctico de flujo digital y MARPE sobre microtornillos",
    html: "<p>Sesión clínica presencial y online para equipos de ortodoncia. Revisaremos alineación de escaneado intraoral con CBCT y diseño de férulas de inserción guiada.</p>",
    status: "published",
  },
  {
    id: "p2",
    tag: "Congreso",
    date: "Congresos SEDO",
    title: "Participación y talleres prácticos en congresos nacionales de ortodoncia",
    html: "<p>Presentación de flujos digitales completos desde escaneado intraoral, cementado indirecto 3D y dispositivos intraorales de apnea D.A.M.A. TCD®.</p>",
    status: "published",
  },
  {
    id: "p3",
    tag: "Novedad técnica",
    date: "Innovación TCD",
    title: "Cementado indirecto y directo 3D con cubetas impresas de alta precisión",
    html: "<p>Guías de inserción compatibles con <strong>3M APC Flash-Free</strong> y cualquier sistema de brackets del mercado.</p>",
    status: "published",
  },
  {
    id: "p4",
    tag: "Actualidad científica",
    date: "Nylon PA12",
    title: "Resina High Torque Soft Memory e impresión en Nylon PA12 para apnea",
    html: "<p>Incorporamos nuevas resinas con memoria elástica y dispositivos DDBG en nylon biocompatible regulable en protrusión.</p>",
    status: "published",
  },
];

export default function FormacionPage() {
  const [posts, setPosts] = useState<PostItem[]>(DEFAULT_POSTS);
  const [tab, setTab] = useState<"todos" | "formacion" | "noticias">("todos");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tcd_backoffice_v2");
      if (saved) {
        const parsed: PostItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setPosts(parsed);
      }
    } catch {}
  }, []);

  const published = posts.filter((p) => p.status === "published");
  const isTraining = (tag: string) => tag === "Formación" || tag === "Congreso";
  const courses = published.filter((p) => isTraining(p.tag));
  const news = published.filter((p) => !isTraining(p.tag));

  const renderCard = (n: PostItem) => (
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
          <div className="text-graphite/60 text-sm mt-3 leading-relaxed space-y-2" dangerouslySetInnerHTML={{ __html: n.html }} />
        </div>
      </div>
      <div className="p-7 pt-5">
        <Link href="/contacto" className="pt-4 border-t border-graphite/10 flex items-center justify-between text-sm font-semibold hover:text-amber">
          Solicitar información / inscripción <Arrow />
        </Link>
      </div>
    </article>
  );

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

        {/* Bloque 1: Formación y Cursos */}
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

        {/* Bloque 2: Noticias y Actualidad Científica */}
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
