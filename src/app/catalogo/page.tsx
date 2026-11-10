"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, PRODUCTS } from "@/lib/data";
import { Search, Arrow, Lock, Upload } from "@/components/Icons";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "Todos";

  const [cat, setCat] = useState<string>(initialCat);
  const [query, setQuery] = useState<string>("");

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = cat === "Todos" || p.cat === cat;
    const matchQ = !query.trim() || p.name.toLowerCase().includes(query.toLowerCase()) || p.cat.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="space-y-8">
      {/* Barra de filtros y buscador */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 ring-1 ring-black/5 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {["Todos", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${cat === c ? "bg-graphite text-white" : "bg-bone text-graphite/70 hover:text-graphite"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative lg:w-72">
          <Search className="w-4 h-4 text-graphite/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar aparato (ej. Nance, MARPE…)"
            className="input !pl-10 !py-2.5 text-sm"
          />
        </div>
      </div>

      {/* Aviso de precios para clínicas */}
      <div className="rounded-2xl bg-graphite text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-white/80">
          <strong className="text-amber">Portes gratuitos en Península y Canarias</strong> para pedidos superiores a 50 €. Las tarifas son exclusivas para clínicas registradas.
        </p>
        <Link href="/acceso?modo=alta" className="btn btn-ghost-dark !py-2 !px-4 text-xs shrink-0">
          <Lock className="w-3.5 h-3.5" />Ver tarifas (Alta clínica)
        </Link>
      </div>

      {/* Grid de productos */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.name} className="bg-white rounded-2xl p-6 ring-1 ring-black/5 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-bone font-semibold text-graphite/70">{p.cat}</span>
                <span className="text-graphite/45 font-mono">Plazo: {p.days}</span>
              </div>
              <h2 className="font-display text-xl mt-3.5">{p.name}</h2>
              <p className="text-xs text-graphite/55 mt-2">Archivo requerido: <strong>{p.file}</strong></p>
            </div>
            <div className="mt-6 pt-4 border-t border-graphite/10 flex items-center justify-between gap-2">
              <Link href="/acceso?modo=alta" className="text-xs text-graphite/55 hover:text-graphite underline">
                Ver precio clínica
              </Link>
              <Link
                href={`/enviar-caso?aparato=${encodeURIComponent(p.name)}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber text-graphite px-3.5 py-2 rounded-full hover:bg-sun transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />Prescribir
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3">
          <p className="font-display text-2xl">No hemos encontrado ese aparato en la vista rápida</p>
          <p className="text-graphite/60 text-sm">Fabricamos cualquier diseño ortodóntico a medida. Envíanos tu prescripción y lo diseñamos para tu caso.</p>
          <Link href="/enviar-caso" className="btn btn-primary mt-2">Enviar diseño a medida<Arrow /></Link>
        </div>
      )}
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <section className="bg-bone py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-10">
          <p className="tag text-titanium">Listado de productos</p>
          <h1 className="font-display text-4xl lg:text-5xl mt-3 leading-[1.05]">Catálogo de aparatología</h1>
          <p className="text-graphite/60 mt-3">Aparatología fija, removible, retención, expansión, mantenedores, funcional, apnea y flujo 100 % digital.</p>
        </div>
        <Suspense fallback={<div className="bg-white rounded-3xl p-12 text-center">Cargando catálogo…</div>}>
          <CatalogContent />
        </Suspense>
      </div>
    </section>
  );
}
