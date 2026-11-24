import { NextResponse } from "next/server";

export type RssItem = {
  id: string;
  source: string;
  date: string;
  title: string;
  summary: string;
  url?: string;
};

const BLOCKED_COMPETITORS = /corus|ortoplus|orthodock|invisalign|clearcorrect|spark|angel\s?aligner/i;

function decodeEntities(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export async function GET() {
  const items: RssItem[] = [];

  // 1. PubMed NCBI E-utilities (Ortodoncia digital, MARPE y Apnea / DAM)
  try {
    const q = encodeURIComponent("(orthodontics AND (digital OR MARPE OR miniscrew)) OR (mandibular advancement device AND sleep apnea)");
    const searchRes = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${q}&retmax=4&sort=date&retmode=json`,
      { signal: AbortSignal.timeout(5000), next: { revalidate: 3600 } }
    );
    if (searchRes.ok) {
      const searchJson = await searchRes.json();
      const ids: string[] = searchJson?.esearchresult?.idlist || [];
      if (ids.length > 0) {
        const sumRes = await fetch(
          `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`,
          { signal: AbortSignal.timeout(5000), next: { revalidate: 3600 } }
        );
        if (sumRes.ok) {
          const sumJson = await sumRes.json();
          for (const id of ids) {
            const doc = sumJson?.result?.[id];
            if (!doc?.title) continue;
            const title = decodeEntities(doc.title).replace(/\.$/, "");
            if (BLOCKED_COMPETITORS.test(title)) continue;
            items.push({
              id: `pm-${id}`,
              source: `PubMed · ${doc.source || "Journal"}`,
              date: doc.pubdate || "Reciente",
              title,
              summary: `Artículo científico indexado en PubMed (${doc.source || "Revista especializada"}). Disponible para revisión técnica y publicación.`,
              url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
            });
          }
        }
      }
    }
  } catch {
    // Silenciar si hay timeout puntual; continúa con Google News RSS
  }

  // 2. Google News ES RSS (Prensa dental española filtrada)
  try {
    const gnRes = await fetch(
      "https://news.google.com/rss/search?q=ortodoncia+digital+OR+apnea+del+sueno+odontologia&hl=es&gl=ES&ceid=ES:es",
      { signal: AbortSignal.timeout(5000), next: { revalidate: 3600 } }
    );
    if (gnRes.ok) {
      const xml = await gnRes.text();
      const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
      for (const block of blocks.slice(0, 5)) {
        const rawTitle = block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
        const rawLink = block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
        const rawDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
        const source = block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] || "Prensa Dental";

        const cleanTitle = decodeEntities(rawTitle).replace(/\s*-\s*[^-]+$/, "").trim();
        if (!cleanTitle || BLOCKED_COMPETITORS.test(cleanTitle)) continue;

        const d = rawDate ? new Date(rawDate) : null;
        const formattedDate = d && !isNaN(d.getTime())
          ? d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
          : "Reciente";

        items.push({
          id: `gn-${Buffer.from(cleanTitle).toString("base64").slice(0, 12)}`,
          source: decodeEntities(source),
          date: formattedDate,
          title: cleanTitle,
          summary: `Artículo de actualidad odontológica publicado en ${decodeEntities(source)}, seleccionado para actualización clínica.`,
          url: decodeEntities(rawLink),
        });
      }
    }
  } catch {
    // Continuar con los resultados disponibles
  }

  return NextResponse.json({ items, syncedAt: new Date().toISOString() });
}
