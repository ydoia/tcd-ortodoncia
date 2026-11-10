"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { LogoMark } from "./Logo";
import { Send, X, Arrow } from "./Icons";
import { PRODUCTS, LABS } from "@/lib/data";

type Msg = { from: "bot" | "me"; text: string; links?: { label: string; href: string }[]; chips?: string[] };

const QUICK = ["Enviar un caso", "Recomiéndame un aparato", "Pedir recogida", "Plazos y portes", "Ver precios", "Apnea / D.A.M.A."];

function answer(q: string): Msg {
  const t = q.toLowerCase();
  const has = (...w: string[]) => w.some((x) => t.includes(x));

  if (has("enviar", "subir", "caso", "stl", "escáner", "escaner", "archivo"))
    return { from: "bot", text: "Perfecto. Puedes enviarnos el caso en 3 pasos: datos del paciente, aparato y archivos (STL, PLY, OBJ, DICOM o fotos). Aceptamos archivos de cualquier escáner intraoral. ¿Lo hacemos ahora?", links: [{ label: "Abrir asistente de prescripción", href: "/enviar-caso" }], chips: ["¿Qué archivos necesito?", "Pedir recogida"] };
  if (has("recog", "mensajer", "envío físico", "modelo físico"))
    return { from: "bot", text: "Organizamos la recogida sin coste en pedidos de más de 50 € (Península y Canarias). Dime tu clínica y la ciudad, o rellena la solicitud y el laboratorio te confirma la franja horaria.", links: [{ label: "Solicitar recogida", href: "/enviar-caso?tipo=recogida" }], chips: ["Plazos y portes"] };
  if (has("plazo", "tarda", "cuánto", "cuanto", "porte", "rápido", "rapido", "8 h", "horas"))
    return { from: "bot", text: "Nuestro equipo necesita solo 8 horas de producción para un trabajo estándar. Los portes son gratis en pedidos de más de 50 € a toda la Península y Canarias. Los dispositivos digitales complejos (MARPE, apnea, férulas quirúrgicas) suelen tardar unos 5 días.", chips: ["Enviar un caso", "Ver catálogo"] };
  if (has("precio", "tarifa", "coste", "cuesta"))
    return { from: "bot", text: "Las tarifas son exclusivas para clínicas registradas. Date de alta en 2 minutos y, cuando validemos tu cuenta, verás todos los precios en tu portal.", links: [{ label: "Darme de alta como clínica", href: "/acceso?modo=alta" }] };
  if (has("apnea", "ronqu", "dama", "d.a.m.a", "ddbg", "sueño"))
    return { from: "bot", text: "En apnea somos pioneros desde 1997. Fabricamos el D.A.M.A. TCD® (dispositivo de avance mandibular patentado) y el DDBG en nylon regulable en protrusión, diseñado al 100 % en digital desde tu escaneado. Necesitamos los modelos y el registro de avance.", links: [{ label: "Ver solución Apnea", href: "/soluciones/apnea" }] };
  if (has("recomien", "aparato", "qué aparato", "que aparato", "necesito"))
    return { from: "bot", text: "Te ayudo. ¿Qué necesitas resolver?", chips: ["Retención tras brackets", "Expansión maxilar", "Mantener espacio (niño)", "Anclaje", "Microimplantes / MARPE"] };
  if (has("retenc", "retener", "brackets"))
    return { from: "bot", text: "Para retención solemos recomendar el arco lingual con mallas 3×3 o el retenedor Zachrisson, y un Essix como retención removible. Todos con plazo de 24 h.", links: [{ label: "Ver retenedores en el catálogo", href: "/catalogo?cat=Retención" }] };
  if (has("expans", "disyun", "cruzada", "maxilar"))
    return { from: "bot", text: "Para expansión: Hyrax o McNamara en dentición mixta, Quad-Helix para expansión lenta y MARPE Power-Screw sobre microimplantes en pacientes con la sutura madura (flujo 100 % digital con TAC).", links: [{ label: "Ver expansores", href: "/catalogo?cat=Expansión" }, { label: "MARPE", href: "/soluciones/marpe-microimplantes" }] };
  if (has("mantener", "niño", "nino", "pediátr", "pediatr", "espacio"))
    return { from: "bot", text: "Para mantener espacio en pacientes pediátricos: mantenedor con banda, EZ Bond o Rick-a-Nator según el caso. Si nos envías el STL, te lo tenemos en 24–48 h.", links: [{ label: "Ver mantenedores", href: "/catalogo?cat=Mantenedores" }] };
  if (has("anclaje", "nance", "goshgarian"))
    return { from: "bot", text: "Para anclaje trabajamos el botón de Nance, la barra de Goshgarian, el Nance-Goshgarian y la barra palatina con botón de intrusión.", links: [{ label: "Ver anclaje", href: "/catalogo?cat=Anclaje" }] };
  if (has("micro", "marpe", "tac", "dicom", "cbct"))
    return { from: "bot", text: "Alineamos tu escaneado con el TAC, planificamos los micros y diseñamos la férula quirúrgica de inserción guiada, además de MARPE, distal-mesialjet o T-Bow a medida.", links: [{ label: "Ver MARPE y microimplantes", href: "/soluciones/marpe-microimplantes" }] };
  if (has("qué archivos", "que archivos", "formato"))
    return { from: "bot", text: "STL, PLY u OBJ de las dos arcadas y la mordida. Para microimplantes o MARPE añade el DICOM (CBCT). Las fotos intraorales siempre ayudan. Si trabajas con modelos físicos, pide la recogida." };
  if (has("lingual", "cementado", "cubeta"))
    return { from: "bot", text: "Hacemos cementado indirecto de cualquier bracket, vestibular o lingual: setup, posicionamiento y cubetas impresas en 3D (incluida una cubeta exclusiva para 3M APC Flash-Free).", links: [{ label: "Ver cementado indirecto", href: "/soluciones/cementado-indirecto" }] };
  if (has("alineador", "perfect", "invisible"))
    return { from: "bot", text: "Trabajamos los alineadores con Perfect Aligner como marca aliada: planificación digital, setup y seguimiento online.", links: [{ label: "Ortodoncia digital 3D", href: "/soluciones/digital-3d" }] };
  if (has("teléfono", "telefono", "llamar", "contacto", "dónde", "donde", "horario", "santander", "palmas", "bilbao"))
    return { from: "bot", text: LABS.map((l) => `${l.city}: ${l.phone} · ${l.hours.map((h) => h.join(" ")).join(", ")}`).join("\n"), links: [{ label: "Ver laboratorios", href: "/laboratorios" }] };
  if (has("catálogo", "catalogo", "producto"))
    return { from: "bot", text: `Tenemos más de ${PRODUCTS.length} aparatos en el catálogo online, con filtros por categoría.`, links: [{ label: "Abrir catálogo", href: "/catalogo" }] };
  if (has("empleo", "trabajo", "curr"))
    return { from: "bot", text: "¡Gracias por tu interés! Envía tu CV a administracion@tcdortodoncia.com (Santander) o administracionlaspalmas@tcdortodoncia.com (Las Palmas).", links: [{ label: "Trabaja con nosotros", href: "/nosotros#empleo" }] };
  return { from: "bot", text: "No quiero darte una respuesta imprecisa. Te pongo con un técnico del laboratorio, que te contesta directamente.", links: [{ label: "WhatsApp Santander", href: "https://wa.me/34652481463" }, { label: "WhatsApp Las Palmas", href: "https://wa.me/34650641614" }], chips: QUICK.slice(0, 3) };
}

export default function Assistant() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Hola, soy TCD Assist 👋 Ayudo a clínicas y ortodoncistas a enviar casos, elegir aparatología y resolver dudas del laboratorio. ¿En qué te ayudo?", chips: QUICK },
  ]);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { const t = setTimeout(() => setHint(true), 6000); return () => clearTimeout(t); }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  if (path.startsWith("/portal")) return null;

  const send = (q: string) => {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => { setTyping(false); setMsgs((m) => [...m, answer(q)]); }, 650 + Math.random() * 500);
  };

  return (
    <>
      <AnimatePresence>
        {hint && !open && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setOpen(true); setHint(false); }}
            className="hidden md:block fixed bottom-28 right-6 z-50 max-w-[240px] text-left bg-white text-graphite text-sm rounded-2xl rounded-br-sm shadow-2xl px-4 py-3 border border-black/5"
          >
            ¿Te ayudo a elegir aparato o a enviar un caso? <span className="text-amber font-semibold">Pregúntame</span>
          </motion.button>
        )}
      </AnimatePresence>

      <button
        onClick={() => { setOpen((o) => !o); setHint(false); }}
        aria-label="Abrir TCD Assist"
        className="fixed z-50 right-4 bottom-24 lg:right-6 lg:bottom-6 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-steel text-white shadow-2xl grid place-items-center ring-1 ring-white/15 hover:ring-amber/40 hover:scale-105 transition-all group"
      >
        <span className="absolute inset-0 rounded-full ring-2 ring-amber/50 animate-ping opacity-25" />
        {open ? <X className="w-6 h-6" /> : <LogoMark className="h-4 lg:h-5" forceColors={true} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }} transition={{ duration: 0.25 }}
            className="fixed z-[60] inset-x-3 bottom-3 top-16 md:inset-auto md:right-6 md:bottom-28 md:w-[400px] md:h-[600px] bg-graphite rounded-3xl shadow-2xl ring-1 ring-white/10 flex flex-col overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3 bg-steel/60">
              <div className="w-10 h-10 rounded-full bg-black grid place-items-center"><LogoMark className="h-3.5" /></div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">TCD Assist</p>
                <p className="text-emerald-400 text-xs flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Asistente del laboratorio · 24/7</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white p-1" aria-label="Cerrar"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 grid-tech">
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.from === "me" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[85%] whitespace-pre-line text-[14px] leading-relaxed px-4 py-2.5 rounded-2xl ${m.from === "me" ? "bg-amber text-graphite rounded-br-sm" : "bg-white/[0.07] text-white/90 rounded-bl-sm"}`}>{m.text}</div>
                  {m.links && (
                    <div className="mt-2 flex flex-col gap-1.5 max-w-[85%]">
                      {m.links.map((l) => (
                        <Link key={l.href} href={l.href} onClick={() => setOpen(false)} target={l.href.startsWith("http") ? "_blank" : undefined} className="flex items-center justify-between gap-3 text-[13px] text-amber border border-amber/30 hover:bg-amber/10 rounded-xl px-3 py-2 transition-colors">
                          {l.label}<Arrow className="w-3.5 h-3.5" />
                        </Link>
                      ))}
                    </div>
                  )}
                  {m.chips && i === msgs.length - 1 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.chips.map((c) => (
                        <button key={c} onClick={() => send(c)} className="text-[12.5px] text-white/80 border border-white/15 hover:border-amber hover:text-amber rounded-full px-3 py-1.5 transition-colors">{c}</button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              {typing && (
                <div className="flex gap-1 px-4 py-3 bg-white/[0.07] rounded-2xl rounded-bl-sm w-fit">
                  {[0, 1, 2].map((d) => (<span key={d} className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />))}
                </div>
              )}
              <div ref={end} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-3 border-t border-white/[0.06] flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe tu consulta…" className="input input-dark !rounded-full !py-2.5 text-sm" />
              <button className="w-11 h-11 shrink-0 rounded-full bg-amber text-graphite grid place-items-center hover:bg-sun transition-colors" aria-label="Enviar"><Send /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
