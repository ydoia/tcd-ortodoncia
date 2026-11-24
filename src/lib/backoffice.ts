export type PostKind = "course" | "news";
export type PostStatus = "published" | "draft";

export type BackofficePost = {
  id: string;
  kind: PostKind;
  tag: string;
  date: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDesc: string;
  html: string;
  image?: string;
  status: PostStatus;
};

export type AutoNews = { id: string; source: string; date: string; title: string; summary: string };
export type PendingClinic = { id: string; clinic: string; doctor: string; email: string; dni: string; colegiado: string; lab: string; approved: boolean };
export type LabCase = { id: string; clinic: string; doctor: string; product: string; type: string; lab: string; date: string; stage: string };

export const BACKOFFICE_STORAGE_KEY = "tcd_backoffice_v4";

export const INITIAL_POSTS: BackofficePost[] = [
  {
    id: "c1",
    kind: "course",
    tag: "Formación",
    date: "Marzo 2027",
    title: "Taller práctico de flujo digital y MARPE sobre microtornillos",
    slug: "taller-flujo-digital-marpe-microtornillos",
    metaTitle: "Taller MARPE y Flujo Digital 3D · TCD Ortodoncia",
    metaDesc: "Formación práctica para ortodoncistas sobre alineación CBCT + STL y férulas guiadas.",
    html: "<p>Sesión clínica presencial y online para equipos de ortodoncia. Revisaremos alineación de escaneado intraoral con CBCT y diseño de férulas de inserción guiada.</p>",
    image: "/assets/tcd/aparatologia-sobre-micro-implantes.jpg",
    status: "published",
  },
  {
    id: "c2",
    kind: "course",
    tag: "Congreso",
    date: "Congresos SEDO",
    title: "Participación y talleres prácticos en congresos nacionales de ortodoncia",
    slug: "talleres-congresos-nacionales-ortodoncia",
    metaTitle: "Talleres y Congresos · TCD Ortodoncia",
    metaDesc: "Flujos digitales completos desde escaneado intraoral y dispositivos de apnea.",
    html: "<p>Presentación de flujos digitales completos desde escaneado intraoral, cementado 3D y dispositivos intraorales de apnea D.A.M.A. TCD®.</p>",
    image: "/assets/tcd/laboratorio-tcd.jpg",
    status: "published",
  },
  {
    id: "c3",
    kind: "course",
    tag: "Formación",
    date: "Próxima edición",
    title: "Borrador: Curso D.A.M.A. TCD® y dispositivos de apnea en nylon",
    slug: "curso-dama-tcd-apnea-nylon",
    metaTitle: "Curso D.A.M.A. TCD® · Apnea del Sueño",
    metaDesc: "Protocolo clínico y toma de registro constructivo para dispositivos intraorales.",
    html: "<p>Pendiente de confirmar fechas definitivas con el ponente y adjuntar programa en PDF.</p>",
    image: "/assets/tcd/lateral.jpg",
    status: "draft",
  },
  {
    id: "n1",
    kind: "news",
    tag: "Novedad técnica",
    date: "Noviembre 2026",
    title: "Cementado indirecto y directo 3D con cubetas impresas de alta precisión",
    slug: "cementado-indirecto-directo-3d-cubetas",
    metaTitle: "Cementado Indirecto 3D · TCD Ortodoncia",
    metaDesc: "Guías de inserción compatibles con 3M APC Flash-Free.",
    html: "<p>Guías de inserción de alta precisión compatibles con <strong>3M APC Flash-Free</strong> y cualquier sistema de brackets del mercado.</p>",
    image: "/assets/tcd/IBT-02.jpg",
    status: "published",
  },
  {
    id: "n2",
    kind: "news",
    tag: "Actualidad científica",
    date: "Nylon PA12",
    title: "Resina High Torque Soft Memory e impresión en Nylon PA12 para apnea",
    slug: "resina-high-torque-nylon-pa12-apnea",
    metaTitle: "Nylon PA12 y Resina High Torque · TCD Ortodoncia",
    metaDesc: "Nuevas resinas con memoria elástica y dispositivos DDBG en nylon biocompatible.",
    html: "<p>Incorporamos nuevas resinas con memoria elástica y dispositivos DDBG en nylon biocompatible regulable en protrusión.</p>",
    image: "/assets/tcd/IMG_9362-scaled.jpg",
    status: "published",
  },
];

export const INITIAL_RSS: AutoNews[] = [
  {
    id: "r1",
    source: "PubMed · Ortodoncia Clínica",
    date: "Hace 2 días",
    title: "Precisión comparativa en férulas quirúrgicas 3D para microimplantes palatinos",
    summary: "Estudio clínico sobre estabilidad primaria y menor desviación angular en protocolos MARPE guiados por CBCT.",
  },
  {
    id: "r2",
    source: "Sleep Medicine Reviews",
    date: "Hace 4 días",
    title: "Eficacia a largo plazo de los dispositivos de avance mandibular (DAM) regulables",
    summary: "Revisión multicéntrica sobre adherencia y confort en pacientes con apnea leve y moderada.",
  },
];

export const INITIAL_CASES: LabCase[] = [
  { id: "CAS-2084", clinic: "Clínica Dental Bahía", doctor: "Dra. Elena Ruiz", product: "MARPE Power-Screw", type: "STL + DICOM", lab: "Santander", date: "Hoy · 09:15", stage: "En diseño CAD" },
  { id: "CAS-2083", clinic: "Ortodoncia Atlántico", doctor: "Dr. Marcos León", product: "DDBG nylon regulable", type: "STL + Registro", lab: "Las Palmas", date: "Hoy · 08:40", stage: "Producción 8h" },
  { id: "CAS-2082", clinic: "Instituto Dental Norte", doctor: "Dr. Pablo Sáez", product: "Recogida física (modelo)", type: "Mensajería gratis", lab: "Santander", date: "Ayer · 17:20", stage: "Recibido" },
];

export const INITIAL_CLINICS: PendingClinic[] = [
  { id: "cl1", clinic: "Clínica Dental Bahía", doctor: "Dra. Elena Ruiz", email: "elena@clinicabahia.es", dni: "72091843K", colegiado: "39001482", lab: "Santander", approved: false },
  { id: "cl2", clinic: "Ortodoncia Atlántico", doctor: "Dr. Marcos León", email: "mleon@ortodonciaatlantico.es", dni: "43812055M", colegiado: "35002190", lab: "Las Palmas", approved: true },
  { id: "cl3", clinic: "Instituto Dental Norte", doctor: "Dr. Pablo Sáez", email: "direccion@dentalnorte.es", dni: "13940218P", colegiado: "39002011", lab: "Santander", approved: false },
];

export const toSlug = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
