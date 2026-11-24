# Handoff Maestro Completo: TCD Ortodoncia (SIKKER SVAR S.L.)

> **Propósito:** Documento de contexto integral (100 % autosuficiente) para continuar cualquier fase del proyecto **TCD Ortodoncia** en otra conversación o entorno sin perder ningún detalle técnico, comercial, legal ni estratégico.

---

## 1. Contexto Relacional y Estrategia General

* **Cliente:** **TCD Ortodoncia** (`SIKKER SVAR S.L.`) — Laboratorio B2B de ortodoncia, apnea, ATM y ortodoncia digital 3D.
* **Interlocutores:**
  * **Alberto** (CEO). Diego trabajó con él en Cantabria (~2018–2019).
  * **Juan Luis** (Socio).
* **Emisor / Agencia:** **YDOIA** — Diego Conde Román (Fuengirola, Málaga) · NIF: `02278941D` · Tel/WhatsApp: `+34 661 395 238` · Emails: `diego@ydoia.com`, `info@ydoia.com`, `facturacion@ydoia.com` · IBAN CaixaBank: `ES77 2100 1099 4113 0008 8231` (`CAIXESBBXXX`).
* **Lógica del proyecto:**
  1. Se presentó una web completamente diseñada y funcional por adelantado como propuesta "llave en mano".
  2. **Trato cerrado:** Setup por **490,00 € + IVA** (tarifa bonificada frente a 1.490,00 €).
  3. **Objetivo estratégico a medio plazo:** Usar TCD como puerta de entrada (alianza *Win-Win*) para acceder a su red de **+300 clínicas dentales clientes**, realizando auditorías y servicios de captación (Plan PRO / Authority) para esas clínicas, lo que a su vez genera más pedidos de ortodoncia para TCD.

---

## 2. Datos Corporativos, Sedes y Ecosistema Tecnológico de TCD

* **Razón Social:** `SIKKER SVAR S.L.` · **CIF/NIF:** `B39870100` *(verificado en `/aviso-legal/`)*
* **Registro Mercantil:** Santander, Tomo 1193, Hoja S-32991
* **Sedes:**
  * **Santander (Laboratorio central):** Av. Pedro San Martín 16, local · 39007 Santander · Tel: `+34 942 23 12 36` · WhatsApp: `+34 652 48 14 63` · Email: `administracion@tcdortodoncia.com` · Horario: L–J 8:00–19:30, V 8:00–14:00.
  * **Las Palmas (Laboratorio Canarias):** C/ Costa Rica 3 · 35010 Las Palmas de Gran Canaria · Tel: `+34 928 27 26 86` · WhatsApp: `+34 650 64 16 14` · Email: `administracionlaspalmas@tcdortodoncia.com` · Horario: L–V 8:00–20:00.
  * **Bilbao (Sede de reuniones):** Portuko Markesaren kalea 10 · 48008 Bilbao · Tel: `+34 944 91 64 13` · Horario: L–J 8:00–19:30, V 8:00–14:00.
* **Infraestructura local actual:**
  * Servidor **NAS Synology** (con sistema operativo **DSM**) en Santander + **SAI (UPS)** anticaídas de corriente.
  * Empresa externa de informática (IT): **Sigarus**.
  * **Software ERP/CRM del laboratorio:** **Vevi Dental** (`vevidental.com`) para gestión de órdenes, trazabilidad y clínicas.
* **Diferenciales reales de negocio:**
  * +35 años de trayectoria; pioneros en apnea del sueño desde **1997**.
  * Patente propia **D.A.M.A. TCD®** y dispositivo **DDBG** en nylon PA12 regulable en protrusión.
  * Marca aliada de alineadores: **Perfect Aligner** (`https://perfectaligner.com`).
  * **8 horas** de producción para trabajo estándar; **portes gratis >50 €** en Península y Canarias.
  * Envíos a España, Europa, Reino Unido y Canadá.
  * Escáneres compatibles: 3Shape, iTero, Medit, Carestream, Planmeca, Dentsply Sirona, Shining 3D, Straumann, Modjaw, Dental Wings, 3M.

---

## 3. Auditoría de la Web Antigua (`https://tcdortodoncia.com/`)

* **CMS:** WordPress con tema tipo Enfold, lento y visualmente obsoleto.
* **Fallos críticos encontrados (usados como palanca comercial):**
  1. Subida de archivos clínicos a `http://tcdortodoncia-archivos.synology.me/login.php` en **HTTP sin cifrar** (riesgo grave RGPD por datos de salud).
  2. Enlace público a borrador privado en el HTML de la home (`?page_id=3204&preview=true`).
  3. Login `/gestor/` expuesto con la interfaz estándar de WordPress (selector de idioma incluido "Dansk") y 4 puertas confusas (*Iniciar sesión, Clientes, Gestor, Plataformas*).
  4. Catálogo en lista plana de texto (>100 ítems) sin buscador, filtros, plazos ni CTAs.
  5. Problemas de codificación, erratas (*"inidirecto", "realizamos preparamos", "Hipersommia", "protusión"*), incoherencias de Bilbao en cabecera vs footer, noticias paradas en 2023/2025, sin Schema ni `llms.txt`.

---

## 4. Arquitectura Exacta de la Nueva Web Construida

* **Carpeta local:** `c:\Users\Usuario\Desktop\YDOIA\CLIENTES\TCD-Ortodoncia`
* **Repositorio GitHub:** `https://github.com/ydoia/tcd-ortodoncia` (público, rama `main`)
* **Despliegue Demo en Vercel:** `https://tcd-ortodoncia.vercel.app` (protegido con `<meta name="robots" content="noindex, nofollow"/>` hasta paso a producción)
* **Stack:** Next.js `16.3.8` (Turbopack, SSG estático, 20 rutas), React `19.2.8`, Tailwind CSS `4`, `motion` (`14.0.0`), `lenis`.

### 4.1. Sistema de Diseño ("Titanium Lab")
* **Colores (`src/app/globals.css`):** Grafito `#14161a`, Acero `#22262c`, Hierro `#2f343b`, Titanio `#8a9099`, Plata `#e4e6e9`, Blanco hueso `#f6f6f3`, Ámbar TCD `#e8b21f`, Sol `#f7d945`, Ámbar oscuro/naranja `#f2873a`.
* **Tipografía:** `Space Grotesk` (titulares, `letter-spacing: -0.02em`) + `Inter` (cuerpo) + `tabular-nums` para cifras.
* **Texturas:** Malla técnica `.grid-tech` / `.grid-tech-light` con máscara radial `.mask-fade`.
* **Logotipo (`src/components/Logo.tsx`):** Isotipos de 3 círculos; el izquierdo en amarillo `#F7D945` y los dos derechos en gris plateado (`#A6ADB8` y `#6E7682`) que transicionan a ámbar/naranja (`#E8B21F` / `#F2873A`) al hacer `hover`. El botón flotante del asistente usa `forceColors={true}` sobre fondo `steel` para máximo contraste.
* **Blindaje Anti-Hidratación:** `suppressHydrationWarning` en `<html>`, `<body>` y todos los enlaces `tel:` para evitar errores de React provocados por extensiones Click-to-Call (como Zadarma).

### 4.2. Mapa de Archivos y Funcionalidad
* **`src/lib/data.ts`:** Fuente única de verdad con `LABS` (3 sedes), `SOLUTIONS` (5 líneas), `CATEGORIES` (7 categorías), `PRODUCTS` (36 productos clave con formato de archivo requerido y plazo), `SCANNERS` (11 marcas), `STATS`, `FAQS` (6), `TESTIMONIALS` (3) y `PLATFORMS` (URLs actuales de Synology y Perfect Aligner).
* **`src/components/Header.tsx`:** Barra superior con teléfonos por sede + aviso de portes gratis +50 €; cabecera sticky con blur, mega-menú en *Soluciones* y drawer móvil.
* **`src/components/Hero.tsx`:** H1 *"Precisión de laboratorio. Entregas en 8 horas."*, foto real `IBT-02.jpg` con línea de escaneo láser animada, cotas `SCAN · STL / ±0,05 mm` y tarjetas flotantes de estado del caso y tiempo `08:00 h`.
* **`src/components/HomeSections.tsx`:** `ScannerMarquee`, `IntentSplit` (*Soy clínica nueva* vs *Ya soy cliente*), `Stats` animados (`Counter`), `SolutionsBento`, `Process` (4 pasos), `Advantages` (6 ventajas + foto `laboratorio-tcd.jpg`), `DamaFeature` (`IMG_9362-scaled.jpg` + patente), `LabsStrip`, `Testimonials`, `FAQSection`, `FinalCTA`.
* **`src/components/Assistant.tsx` (`TCD Assist`):** Asistente conversacional **100 % nativo/determinista en código** (sin llamadas a APIs externas ni costes de tokens ni fricción con el AI Act UE). Responde sobre envíos STL/DICOM, plazos de 8h, portes, precios privados, apnea, recomienda aparatos según caso clínico y deriva al WhatsApp de Santander o Las Palmas.
* **`src/components/Footer.tsx` & `MobileBar.tsx`:** Footer con pre-CTA, redes, sedes y legales; barra móvil sticky inferior (*Enviar caso* + WhatsApp + Llamar).
* **Páginas (`src/app/`):**
  * `/acceso`: Portal de clínicas unificado. Selector interactivo **Santander / Las Palmas**, tarjetas a *Aparatología General* (Synology), *Perfect Aligner* y hojas de prescripción, más pestañas *Iniciar sesión / Darme de alta / Ver portal por dentro (Demo)* *(nota: maqueta funcional; el acceso interno real a sus plataformas no se inspeccionó por requerir credenciales)*.
  * `/catalogo`: Buscador en tiempo real + filtros por las 7 categorías + botón *Prescribir* que precarga el aparato en `/enviar-caso?aparato=...`.
  * `/enviar-caso`: Wizard interactivo en 3 pasos (modalidad digital STL/DICOM + selector de escáner vs recogida física gratuita → laboratorio → datos clínica) con confirmación y enlace directo a WhatsApp.
  * `/soluciones` y `/soluciones/[slug]`: 5 páginas de detalle técnico (`aparatologia`, `digital-3d`, `apnea`, `cementado-indirecto`, `marpe-microimplantes`).
  * `/flujo-digital`, `/laboratorios`, `/formacion`, `/nosotros` (con sección `#empleo`), `/contacto`, `/legal/[slug]` (`privacidad`, `cookies`, `aviso-legal`) y `public/llms.txt` (GEO).
* **Activos descargados (`public/assets/tcd/`):** 34 archivos reales de la web antigua, destacando `IBT-02.jpg`, `IMG_9362-scaled.jpg`, `laboratorio-tcd.jpg`, `TCD-Las-Palmas-001.jpeg`, `aparatologia-sobre-micro-implantes.jpg`, `dsc01162.jpg`, `11-foto-trabajando.jpg`, `45734218_573482586420048_8428801841554259968_o.jpg`, `Logo-TCD-Nuevo-Blanco-Pag-Inicio5-300x144.png`.

---

## 5. Acuerdo Comercial, Documentos Generados y Protección de Propiedad

* **Setup cerrado:** **490,00 € + 21% IVA = 592,90 €** *(descuento partner de -1.000 € sobre tarifa oficial de 1.490,00 €)*.
* **Condiciones incluidas:**
  * Web + Asistente nativo (`TCD Assist`) + SEO/GEO base.
  * Plazo estimado de publicación: hasta **7 días hábiles** tras recibir contenidos definitivos y acceso técnico de Sigarus.
  * **30 días naturales** de acompañamiento y ajustes en textos/fotos/teléfonos hasta conformidad total.
  * Garantía técnica de 30 días.
  * **Propiedad intelectual:** Licencia comercial indefinida, no exclusiva e intransferible para `tcdortodoncia.com`. YDOIA mantiene la titularidad del código base. **Importante:** Para proteger el código al desplegar en su NAS, **no entregar el repositorio fuente editable** a Sigarus; entregar **imagen Docker cerrada / build compilado (`output: 'standalone'`)**.
* **Post-mes 1 (opcional):** Sigarus mantiene el NAS a 0 €/mes (cambios puntuales bajo demanda a **45 €/h + IVA**), o bien Plan Cloud YDOIA a **49 €/mes + IVA** (1h/mes soporte + hosting + opción de conectar IA real externa hasta 1.000 consultas/mes con capa legal AI Act).
* **Entregables ya generados en `c:\Users\Usuario\Desktop\YDOIA\CLIENTES\FACTURAS\` (con estilos oficiales YDOIA `#014c6b` / `#fdc844`):**
  * **Proforma (`PRO-2026-1117`, sin consumir número fiscal oficial hasta el cobro):** `factura-tcd-ortodoncia-490.html` y `Proforma PRO-2026-1117 · TCD Ortodoncia.pdf`
  * **Contrato completo (`YDO-CNT-1117`):** `contrato-tcd-ortodoncia.html` y `Contrato Servicios Web YDO-CNT-1117 · TCD Ortodoncia.pdf`
  * **Regalo de Cortesía para Clínicas VIP (`TCD-VIP-2026`):** `bono-3-auditorias-tcd.html` y `Regalo Auditoria Digital · TCD Ortodoncia.pdf` *(logo vectorial SVG TCD grande + YDOIA, "Regalo de Cortesía · Valorado en 300 €", Geo-Grid visual, gancho ROI `+4.500 € a +8.000 €/mes` con 2 pacientes, CTA WhatsApp y correo `info@ydoia.com`)*.

---

## 6. Despliegue Técnico, Formularios y Siguientes Pasos

### 6.1. Puesta en Marcha con Sigarus en Synology NAS
1. Ajustar `next.config.ts` según lo que acuerden con Sigarus:
   * `output: "standalone"` + `Dockerfile` / `docker-compose.yml` para correr en **Container Manager (Docker)** de Synology DSM.
   * O `output: "export"` si prefieren HTML/JS/CSS estáticos en **Web Station** de Synology *(revisando compatibilidad de rutas dinámicas/imágenes sin Image Optimization de servidor)*.
2. Configurar **Proxy Inverso + SSL Let's Encrypt** en DSM (y corregir su antiguo subdominio de archivos Synology a `HTTPS`).
3. **Al pasar a dominio real (`tcdortodoncia.com`):** eliminar `robots: { index: false, follow: false }` en `src/app/layout.tsx`.
4. **Actualizaciones futuras desde Fuengirola:** vía acceso remoto QuickConnect/DSM o webhook de GitHub si Sigarus habilita despliegue automático.

### 6.2. Conexión de Formularios (`/contacto`, `/enviar-caso`, `/acceso`)
* **Opción recomendada (mínima complicación):** Conectar los formularios a **Web3Forms** o **Formspree** enrutando por sede a `administracion@tcdortodoncia.com` (Santander/Bilbao) y `administracionlaspalmas@tcdortodoncia.com` (Las Palmas).
* **Alternativa:** Endpoint API en Next.js con SMTP corporativo facilitado por Sigarus.

### 6.3. Regalos Adicionales Listos para Proponer / Ejecutar + Upsells
* **Regalos rápidos (coste ~0) propuestos en la estrategia:**
  1. Informe técnico "Antes vs Después" (rendimiento y corrección HTTP/RGPD).
  2. Guía PDF corporativa de exportación STL desde iTero, 3Shape, Medit y Carestream para enviar a clínicas.
  3. Etiqueta/tarjetón con código QR hacia `/enviar-caso` para pegar o incluir en las cajas de envío.
  4. Firma HTML corporativa unificada para Outlook (Alberto, Juan Luis y Administración).
  5. Revisión de Google Business Profile (Santander / Las Palmas) y vCard QR para congresos (SEDO).
* **Oportunidades de Upsell detectadas:**
  * Automatización de entrada de casos (escáneres / formularios → **Vevi Dental** / CRM) con n8n/Make.
  * Notificaciones automáticas por **WhatsApp** a clínicas cuando un caso cambia de estado en Vevi Dental.
  * Activación de IA real conectada al catálogo en `TCD Assist` (Plan 49 €/mes).
  * Campaña de **Auditorías Digitales para Clínicas VIP** (`TCD-VIP-2026`) como canal recurrente de captación de clínicas dentales para YDOIA.
