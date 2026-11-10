import Link from "next/link";
import { SCANNERS, PLATFORMS } from "@/lib/data";
import { Cube, Upload, Clock, Truck, Arrow, Check } from "@/components/Icons";

export default function FlujoDigitalPage() {
  return (
    <>
      <section className="bg-graphite text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-tech opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 max-w-3xl">
          <p className="tag text-amber">Ortodoncia 100 % digital</p>
          <h1 className="font-display text-4xl lg:text-6xl mt-3 leading-[1.03]">Conectamos con cualquier escáner intraoral del mercado.</h1>
          <p className="text-white/65 text-lg mt-5">
            Trabajamos con 3Shape Ortho System, impresión 3D de alta precisión y la plataforma Perfect Aligner. Si no dispones de software de diseño, puedes revisar e inspeccionar tus casos conectándote en remoto a nuestro centro de soporte digital.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/enviar-caso" className="btn btn-primary"><Upload className="w-4 h-4" />Subir archivos STL / DICOM</Link>
            <Link href="/acceso" className="btn btn-ghost-dark">Ir a Plataformas<Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="bg-bone py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { icon: <Cube />, t: "1. Escaneado o CBCT", d: "Exporta STL, PLY, OBJ o añade el DICOM (TAC) cuando el caso incluya microimplantes." },
              { icon: <Upload />, t: "2. Prescripción digital", d: "Sube tus archivos desde nuestro asistente o mediante la conexión directa de tu escáner." },
              { icon: <Clock />, t: "3. Diseño CAD y validación", d: "Alineamos modelos, posicionamos brackets o micros y validamos contigo el setup 3D." },
              { icon: <Truck />, t: "4. Impresión 3D y envío", d: "Fabricamos cubetas, férulas quirúrgicas, MARPE o alineadores y los enviamos protegidos." },
            ].map((s) => (
              <div key={s.t} className="bg-white rounded-3xl p-7 ring-1 ring-black/5">
                <span className="w-11 h-11 rounded-2xl bg-graphite text-amber grid place-items-center">{s.icon}</span>
                <h2 className="font-display text-xl mt-5">{s.t}</h2>
                <p className="text-graphite/60 text-sm mt-2">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-8 lg:p-10 ring-1 ring-black/5 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="tag text-titanium">Compatibilidad total</p>
              <h2 className="font-display text-3xl mt-3">Marcas y sistemas con los que trabajamos a diario</h2>
              <p className="text-graphite/60 text-sm mt-3">
                Puedes enviarnos los modelos por tu canal habitual (3Shape Communicate, MyiTero, Medit Link, Sirona Connect…) o subir los archivos directamente en nuestra web.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-graphite/75">
                {[
                  "Cubeta especial para brackets 3M con APC Flash-Free",
                  "Férulas quirúrgicas guiadas para microimplantes y MARPE Power-Screw",
                  "Alineadores con Perfect Aligner",
                  "Movimientos mandibulares reales con Modjaw",
                ].map((x) => (
                  <li key={x} className="flex items-center gap-2"><Check className="w-4 h-4 text-amber" />{x}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {SCANNERS.map((s) => (
                <span key={s} className="px-4 py-2.5 rounded-2xl bg-bone font-display text-base text-graphite ring-1 ring-black/5">
                  {s}
                </span>
              ))}
              <a href={PLATFORMS.perfectAligner} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-2xl bg-amber font-display text-base text-graphite">
                Perfect Aligner ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
