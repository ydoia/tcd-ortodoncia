"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, LABS, SCANNERS } from "@/lib/data";
import { Upload, Check, Arrow, Truck, Shield, Phone, WhatsApp, File } from "@/components/Icons";

function WizardContent() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get("aparato") || "";
  const initialMode = searchParams.get("tipo") === "recogida" ? "recogida" : "digital";

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<"digital" | "recogida">(initialMode);
  const [lab, setLab] = useState<string>("santander");
  const [product, setProduct] = useState<string>(initialProduct || PRODUCTS[0].name);
  const [scanner, setScanner] = useState<string>("3Shape");
  const [files, setFiles] = useState<string[]>([]);
  const [clinic, setClinic] = useState("");
  const [doctor, setDoctor] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedLab = LABS.find((l) => l.id === lab) || LABS[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const names = Array.from(e.target.files).map((f) => f.name);
    setFiles((prev) => [...prev, ...names]);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-[28px] p-8 lg:p-12 ring-1 ring-black/5 max-w-2xl mx-auto text-center">
        <span className="w-16 h-16 rounded-2xl bg-emerald-500 text-white grid place-items-center mx-auto">
          <Check className="w-8 h-8" />
        </span>
        <p className="tag text-titanium justify-center mt-6">Prescripción registrada</p>
        <h2 className="font-display text-3xl lg:text-4xl mt-3">
          {mode === "digital" ? "Hemos recibido tu caso" : "Recogida solicitada"}
        </h2>
        <p className="text-graphite/60 mt-3 max-w-md mx-auto">
          Un técnico de <strong>TCD {selectedLab.city}</strong> revisará los datos de <strong>{clinic || "tu clínica"}</strong> y te confirmará el plazo en menos de 2 horas laborables.
        </p>
        <div className="mt-8 bg-bone rounded-2xl p-5 text-left text-sm space-y-2">
          <div className="flex justify-between"><span className="text-graphite/50">Laboratorio:</span><span className="font-medium">TCD {selectedLab.city}</span></div>
          <div className="flex justify-between"><span className="text-graphite/50">Modalidad:</span><span className="font-medium">{mode === "digital" ? `Flujo digital (${scanner})` : "Recogida física en clínica"}</span></div>
          <div className="flex justify-between"><span className="text-graphite/50">Aparato:</span><span className="font-medium">{product}</span></div>
          {files.length > 0 && (
            <div className="flex justify-between"><span className="text-graphite/50">Archivos adjuntos:</span><span className="font-medium">{files.join(", ")}</span></div>
          )}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/${selectedLab.whatsapp}?text=${encodeURIComponent(`Hola TCD ${selectedLab.city}, acabo de enviar un caso de ${product} desde la web (${clinic || doctor}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn bg-[#25D366] text-white hover:brightness-95"
          >
            <WhatsApp />Confirmar por WhatsApp
          </a>
          <Link href="/catalogo" className="btn btn-ghost">Volver al catálogo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
      <div className="bg-white rounded-[28px] p-6 sm:p-10 ring-1 ring-black/5">
        {/* Selector de modalidad */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-bone mb-8">
          <button
            type="button"
            onClick={() => setMode("digital")}
            className={`py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${mode === "digital" ? "bg-graphite text-white shadow" : "text-graphite/60 hover:text-graphite"}`}
          >
            <Upload className="w-4 h-4" />Subir escaneado STL / 3D
          </button>
          <button
            type="button"
            onClick={() => setMode("recogida")}
            className={`py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${mode === "recogida" ? "bg-graphite text-white shadow" : "text-graphite/60 hover:text-graphite"}`}
          >
            <Truck className="w-4 h-4" />Solicitar recogida física
          </button>
        </div>

        {/* Pasos */}
        <div className="flex items-center gap-3 mb-8 text-xs font-semibold uppercase tracking-widest">
          {[
            [1, "1. Aparato y archivos"],
            [2, "2. Laboratorio"],
            [3, "3. Datos de la clínica"],
          ].map(([n, label]) => (
            <button
              key={n}
              type="button"
              onClick={() => setStep(n as 1 | 2 | 3)}
              className={`px-3.5 py-2 rounded-full transition-colors ${step === n ? "bg-amber text-graphite" : "bg-silver/60 text-graphite/50"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 3) setStep((s) => (s + 1) as 1 | 2 | 3);
            else setSubmitted(true);
          }}
          className="space-y-6"
        >
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">Aparato o servicio solicitado</label>
                <select value={product} onChange={(e) => setProduct(e.target.value)} className="input">
                  {PRODUCTS.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.cat} · {p.name} (plazo est. {p.days})
                    </option>
                  ))}
                  <option value="Otro / Diseño a medida">Otro / Diseño a medida</option>
                </select>
              </div>

              {mode === "digital" ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Escáner intraoral de origen</label>
                    <div className="flex flex-wrap gap-2">
                      {SCANNERS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setScanner(s)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${scanner === s ? "bg-graphite text-white border-graphite" : "border-graphite/15 text-graphite/70 hover:border-graphite"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Archivos clínicos (STL, PLY, OBJ, DICOM, fotos)</label>
                    <label className="border-2 border-dashed border-graphite/15 hover:border-amber rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-bone/50">
                      <Upload className="w-8 h-8 text-amber mb-2" />
                      <span className="font-medium text-sm">Arrastra tus archivos aquí o haz clic para seleccionarlos</span>
                      <span className="text-xs text-graphite/50 mt-1">Arcada superior, inferior, mordida y CBCT/DICOM si aplica</span>
                      <input type="file" multiple onChange={handleFileChange} className="hidden" />
                    </label>
                    {files.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {files.map((f, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-silver px-3 py-1.5 rounded-full">
                            <File className="w-3.5 h-3.5" />{f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-bone rounded-2xl p-5 text-sm text-graphite/70">
                  <p className="font-semibold text-graphite mb-1">Recogida gratuita en pedidos superiores a 50 € (Península y Canarias)</p>
                  <p>Prepara los modelos de escayola o impresiones junto con el registro de mordida. Nuestro mensajero pasará por tu clínica en la franja que nos indiques.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">Indicaciones clínicas / prescripción</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej.: Expansión de 6 mm, bandas en 16 y 26, avance mandibular al 70 %..."
                  className="input"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-graphite/60">Selecciona el laboratorio TCD con el que quieres trabajar tu caso:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {LABS.filter((l) => l.id !== "bilbao").map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLab(l.id)}
                    className={`text-left p-5 rounded-2xl border-2 transition-all ${lab === l.id ? "border-amber bg-amber/5" : "border-graphite/10 hover:border-graphite/30"}`}
                  >
                    <p className="text-xs uppercase tracking-widest text-titanium font-semibold">{l.role}</p>
                    <p className="font-display text-2xl mt-1">TCD {l.city}</p>
                    <p className="text-xs text-graphite/60 mt-2">{l.address}</p>
                    <p className="text-xs font-medium mt-3">{l.phone}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Nombre de la clínica *</label>
                <input required value={clinic} onChange={(e) => setClinic(e.target.value)} placeholder="Clínica Dental..." className="input" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Doctor/a de referencia *</label>
                <input required value={doctor} onChange={(e) => setDoctor(e.target.value)} placeholder="Dr. / Dra. ..." className="input" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Teléfono directo *</label>
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+34 600 000 000" className="input" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Correo electrónico *</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="clinica@ejemplo.com" className="input" />
              </div>
              <div className="sm:col-span-2 text-xs text-graphite/50 pt-2">
                Responsable: SIKKER SVAR S.L. (TCD Ortodoncia). Finalidad: gestionar la prescripción y la relación con la clínica. Puedes ejercer tus derechos en administracion@tcdortodoncia.com.
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button type="button" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)} className="btn btn-ghost">
                Atrás
              </button>
            ) : <span />}
            <button type="submit" className="btn btn-primary">
              {step < 3 ? "Continuar" : mode === "digital" ? "Enviar caso al laboratorio" : "Solicitar recogida"}
              <Arrow />
            </button>
          </div>
        </form>
      </div>

      {/* Lateral de garantías */}
      <aside className="bg-graphite text-white rounded-[28px] p-7 space-y-6">
        <div>
          <p className="tag text-amber">Soporte directo</p>
          <h3 className="font-display text-2xl mt-2">¿Dudas con la prescripción?</h3>
          <p className="text-white/55 text-sm mt-2">Habla directamente con un técnico antes de enviar el archivo.</p>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber shrink-0 mt-0.5" />
            <div><p className="font-medium">Revisión previa incluida</p><p className="text-white/50 text-xs">Verificamos la oclusión y el escaneado antes de producir.</p></div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-amber shrink-0 mt-0.5" />
            <div><p className="font-medium">Portes gratuitos +50 €</p><p className="text-white/50 text-xs">Ida y vuelta en Península y Canarias.</p></div>
          </div>
        </div>
        <div className="pt-4 border-t border-white/10 space-y-2">
          <a href={`tel:${selectedLab.phone.replace(/\s/g, "")}`} suppressHydrationWarning className="btn btn-ghost-dark w-full justify-center text-sm">
            <Phone /><span suppressHydrationWarning>{selectedLab.city}: {selectedLab.phone}</span>
          </a>
          <a href={`https://wa.me/${selectedLab.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn w-full justify-center text-sm bg-[#25D366] text-white">
            <WhatsApp />WhatsApp {selectedLab.city}
          </a>
        </div>
      </aside>
    </div>
  );
}

export default function EnviarCasoPage() {
  return (
    <section className="bg-bone py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-10">
          <p className="tag text-titanium">Prescripción digital y recogidas</p>
          <h1 className="font-display text-4xl lg:text-5xl mt-3 leading-[1.05]">Enviar un caso a TCD</h1>
          <p className="text-graphite/60 mt-3">Sube tu escaneado intraoral desde cualquier marca o solicita la recogida gratuita de modelos físicos en tu clínica.</p>
        </div>
        <Suspense fallback={<div className="bg-white rounded-[28px] p-12 text-center">Cargando asistente…</div>}>
          <WizardContent />
        </Suspense>
      </div>
    </section>
  );
}
