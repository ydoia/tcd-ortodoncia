"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BackofficePost, BACKOFFICE_STORAGE_KEY, INITIAL_POSTS, toSlug } from "@/lib/backoffice";
import { Arrow } from "@/components/Icons";

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

export default function FormacionDetailPage() {
  const params = useParams<{ slug: string }>();
  const slugParam = params?.slug || "";
  const [post, setPost] = useState<BackofficePost | null>(
    () => INITIAL_POSTS.find((p) => (p.slug || toSlug(p.title)) === slugParam) || null
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BACKOFFICE_STORAGE_KEY);
      if (saved) {
        const list: BackofficePost[] = JSON.parse(saved);
        const found = list.find((p) => (p.slug || toSlug(p.title)) === slugParam);
        if (found) setPost(found);
      }
    } catch {}
  }, [slugParam]);

  if (!post) {
    return (
      <section className="bg-bone py-24">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-4">
          <h1 className="font-display text-3xl">Publicación no encontrada</h1>
          <Link href="/formacion" className="btn btn-primary">Volver a Formación y Noticias</Link>
        </div>
      </section>
    );
  }

  const isCourse = post.kind === "course";
  const past = isCourse && isCoursePast(post.date, post.title);

  return (
    <article className="bg-bone py-14 lg:py-20">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        <Link href="/formacion" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-graphite/55 hover:text-amber transition-colors">
          ← Volver a Formación y Noticias
        </Link>

        <div className="bg-white rounded-[28px] overflow-hidden ring-1 ring-black/5 shadow-sm">
          {post.image && (
            <div className="aspect-[16/8] overflow-hidden bg-graphite">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-7 sm:p-12 space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3.5 py-1 rounded-full bg-bone font-semibold text-graphite">{post.tag}</span>
              <span className="text-graphite/50">{post.date}</span>
              {isCourse && (
                <span className={`px-3 py-1 rounded-full font-semibold ${past ? "bg-silver text-graphite/65" : "bg-emerald-50 text-emerald-700"}`}>
                  {past ? "Edición realizada" : "Convocatoria abierta"}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.08] text-graphite">{post.title}</h1>

            <div
              className="pt-4 border-t border-graphite/10 text-graphite/80 text-base leading-relaxed space-y-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-amber [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-amber [&_a]:font-semibold [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />

            {isCourse && (
              <div className="mt-8 pt-6 border-t border-graphite/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bone rounded-2xl p-6">
                <div>
                  <p className="font-display text-lg font-semibold">
                    {past ? "¿Te gustaría asistir a la próxima edición?" : "¿Quieres reservar plaza para tu clínica?"}
                  </p>
                  <p className="text-xs text-graphite/60 mt-1">
                    Escríbenos y nuestro equipo de formación te confirmará fechas y programa completo.
                  </p>
                </div>
                <Link href="/contacto" className="btn btn-primary shrink-0 text-sm">
                  {past ? "Solicitar próxima edición" : "Solicitar plaza / inscripción"}
                  <Arrow />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
