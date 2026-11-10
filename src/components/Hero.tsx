"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { Arrow, Clock, Truck, Upload, Check } from "./Icons";

export default function Hero() {
  const { scrollY } = useScroll();
  const yImg = useTransform(scrollY, [0, 700], [0, 80]);
  const yTxt = useTransform(scrollY, [0, 700], [0, 50]);
  const fade = useTransform(scrollY, [0, 500], [1, 0.2]);

  return (
    <section className="relative bg-graphite overflow-hidden">
      <div className="absolute inset-0 grid-tech mask-fade" />
      <div className="absolute -top-40 right-[-10%] w-[700px] h-[700px] rounded-full bg-amber/10 blur-[140px]" />
      <div className="absolute bottom-[-30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-ember/[0.06] blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-20 lg:pt-20 lg:pb-28 grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
        <motion.div style={{ y: yTxt, opacity: fade }}>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="tag text-amber mb-6">Laboratorio de ortodoncia · Desde hace +35 años</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-white text-[44px] leading-[1.02] sm:text-6xl lg:text-[72px] font-semibold"
          >
            Precisión de laboratorio.
            <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-sun via-amber to-ember">Entregas en 8 horas.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="mt-6 text-white/60 text-lg leading-relaxed max-w-xl">
            Fabricamos aparatología de ortodoncia, dispositivos de apnea y flujo digital 3D para clínicas de España, Europa, Reino Unido y Canadá. Envía tu escaneado desde cualquier escáner. Del resto nos ocupamos nosotros.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-9 flex flex-wrap gap-3">
            <Link href="/enviar-caso" className="btn btn-primary !px-7 !py-4 text-base"><Upload className="w-5 h-5" />Enviar mi primer caso</Link>
            <Link href="/catalogo" className="btn btn-ghost-dark !px-7 !py-4 text-base">Ver catálogo<Arrow /></Link>
          </motion.div>

          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/55">
            <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber" />8 h de producción</li>
            <li className="flex items-center gap-2"><Truck className="w-4 h-4 text-amber" />Portes gratis +50 €</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber" />Patente D.A.M.A. TCD®</li>
          </motion.ul>
        </motion.div>

        {/* Visual */}
        <motion.div style={{ y: yImg }} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="relative">
          <div className="relative aspect-[4/4.4] rounded-[28px] overflow-hidden ring-1 ring-white/10 shadow-[0_40px_120px_-30px_rgba(0,0,0,.8)]">
            <Image src="/assets/tcd/IBT-02.jpg" alt="Cubeta de cementado indirecto impresa en 3D sobre modelo TCD Ortodoncia" fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-cover scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-transparent to-graphite/10" />
            {/* Línea de escaneo */}
            <div className="absolute inset-x-0 top-0 h-[9%] pointer-events-none animate-scan">
              <div className="h-full bg-gradient-to-b from-transparent to-amber/25" />
              <div className="h-px bg-amber shadow-[0_0_20px_4px_rgba(232,178,31,.6)]" />
            </div>
            {/* Cotas */}
            <div className="absolute top-6 left-6 right-6 flex justify-between text-[10px] font-mono text-white/70 tracking-widest">
              <span>SCAN · STL</span><span>±0,05 mm</span>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white/50 text-xs font-mono tracking-widest mb-1">CASO #A-2047</p>
              <p className="text-white font-display text-xl">Cubeta de cementado indirecto</p>
            </div>
          </div>

          {/* Tarjeta flotante: estado */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="absolute -left-4 sm:-left-10 top-[18%] bg-white rounded-2xl shadow-2xl p-4 w-[230px]">
            <p className="text-[11px] uppercase tracking-widest text-titanium font-semibold mb-3">Estado del caso</p>
            {["Archivos recibidos", "Diseño validado", "En producción"].map((s, i) => (
              <div key={s} className="flex items-center gap-2.5 py-1">
                <span className={`w-5 h-5 rounded-full grid place-items-center ${i < 2 ? "bg-emerald-500 text-white" : "bg-amber/20 text-amber"}`}>
                  {i < 2 ? <Check className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />}
                </span>
                <span className="text-sm text-graphite">{s}</span>
              </div>
            ))}
            <div className="mt-3 h-1.5 rounded-full bg-silver overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: "72%" }} transition={{ delay: 1, duration: 1.4 }} className="h-full bg-gradient-to-r from-amber to-ember" /></div>
          </motion.div>

          {/* Tarjeta flotante: tiempo */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="absolute -right-2 sm:-right-6 bottom-[14%] bg-graphite/90 backdrop-blur-xl ring-1 ring-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber grid place-items-center text-graphite"><Clock /></div>
            <div><p className="text-white font-display text-2xl leading-none tabular">08:00 h</p><p className="text-white/50 text-xs mt-1">tiempo de producción</p></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
