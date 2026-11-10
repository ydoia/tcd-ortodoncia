// Contenido centralizado de TCD Ortodoncia (extraído y corregido de tcdortodoncia.com)

export const LABS = [
  {
    id: "santander",
    city: "Santander",
    role: "Laboratorio central",
    address: "Avenida Pedro San Martín 16, local · 39007 Santander, Cantabria",
    phone: "+34 942 23 12 36",
    mobile: "+34 652 48 14 63",
    whatsapp: "34652481463",
    email: "administracion@tcdortodoncia.com",
    hours: [["Lunes a jueves", "8:00 – 19:30"], ["Viernes", "8:00 – 14:00"]],
    map: "https://www.google.com/maps?q=Avenida+Pedro+San+Martin+16+Santander&output=embed",
    image: "/assets/tcd/laboratorio-tcd.jpg",
  },
  {
    id: "las-palmas",
    city: "Las Palmas",
    role: "Laboratorio Canarias",
    address: "Calle Costa Rica 3 · 35010 Las Palmas de Gran Canaria",
    phone: "+34 928 27 26 86",
    mobile: "+34 650 64 16 14",
    whatsapp: "34650641614",
    email: "administracionlaspalmas@tcdortodoncia.com",
    hours: [["Lunes a viernes", "8:00 – 20:00"]],
    map: "https://www.google.com/maps?q=Calle+Costa+Rica+3+Las+Palmas+de+Gran+Canaria&output=embed",
    image: "/assets/tcd/TCD-Las-Palmas-001.jpeg",
  },
  {
    id: "bilbao",
    city: "Bilbao",
    role: "Sede de reuniones",
    address: "Portuko Markesaren kalea 10 · 48008 Bilbao",
    phone: "+34 944 91 64 13",
    mobile: "",
    whatsapp: "34652481463",
    email: "administracion@tcdortodoncia.com",
    hours: [["Lunes a jueves", "8:00 – 19:30"], ["Viernes", "8:00 – 14:00"]],
    map: "https://www.google.com/maps?q=Portuko+Markesaren+kalea+10+Bilbao&output=embed",
    image: "/assets/tcd/11-foto-trabajando.jpg",
  },
] as const;

export type Solution = {
  slug: string;
  name: string;
  short: string;
  claim: string;
  image: string;
  intro: string;
  bullets: string[];
  specs: [string, string][];
  steps?: string[];
};

export const SOLUTIONS: Solution[] = [
  {
    slug: "aparatologia",
    name: "Aparatología de ortodoncia",
    short: "Fija y removible",
    claim: "Más de 100 aparatos fabricados a mano por técnicos especialistas, con 35 años de oficio.",
    image: "/assets/tcd/45734218_573482586420048_8428801841554259968_o.jpg",
    intro:
      "Retención, anclaje, expansión, mantenedores de espacio y aparatología funcional. Fabricación tradicional o con flujo totalmente digital a partir de tu escaneado intraoral.",
    bullets: [
      "Arcos linguales, Nance, Goshgarian, Quad-Helix y disyuntores",
      "Retenedores fijos y removibles, placas activas y funcionales",
      "Mantenedores de espacio pediátricos (bandas, EZ Bond, Rick-a-Nator)",
      "Protección y estuche de cada aparato sin coste adicional",
    ],
    specs: [["Plazo de producción", "Desde 8 h"], ["Entrada", "STL, modelo físico o impresión"], ["Portes", "Gratis desde 50 €"]],
  },
  {
    slug: "digital-3d",
    name: "Ortodoncia digital 3D y alineadores",
    short: "Perfect Aligner",
    claim: "Setups digitales, impresión 3D y alineadores con Perfect Aligner como marca aliada.",
    image: "/assets/tcd/IBT-02.jpg",
    intro:
      "Recibimos tus modelos desde cualquier escáner intraoral. Planificamos el tratamiento en la plataforma digital más avanzada y fabricamos con impresión 3D de alta precisión.",
    bullets: [
      "Compatibles con 3Shape, iTero, Medit, Carestream, Planmeca, Dentsply Sirona y Shining 3D",
      "Setup digital y planificación revisada por técnicos especialistas",
      "Alineadores Perfect Aligner con seguimiento online",
      "Soporte remoto: revisa tu caso conectado a nuestro centro digital",
    ],
    specs: [["Archivos", "STL · PLY · OBJ · DICOM"], ["Software", "3Shape Ortho System"], ["Marca aliada", "Perfect Aligner"]],
  },
  {
    slug: "apnea",
    name: "Apnea y ronquido",
    short: "D.A.M.A. TCD® patentado",
    claim: "Desde 1997 fabricando dispositivos de avance mandibular. Con patente propia.",
    image: "/assets/tcd/IMG_9362-scaled.jpg",
    intro:
      "El SAHS afecta a alrededor del 4 % de los adultos. Cada prescripción necesita un dispositivo diferente: diseñamos y fabricamos aparatos intraorales de avance mandibular, incluido nuestro D.A.M.A. TCD® patentado y el nuevo DDBG en nylon con diseño 100 % digital.",
    bullets: [
      "D.A.M.A. TCD® — Dispositivo de Avance Mandibular patentado",
      "DDBG en nylon resistente y suave, regulable en protrusión",
      "Diseño digital desde escaneado intraoral con registro de avance",
      "Protocolo de colocación y ajuste para la clínica",
    ],
    specs: [["Experiencia", "Desde 1997"], ["Material DDBG", "Nylon (PA12)"], ["Ajuste", "Protrusión regulable"]],
  },
  {
    slug: "cementado-indirecto",
    name: "Cementado indirecto y ortodoncia lingual",
    short: "Setup + cubetas 3D",
    claim: "Posicionamiento exacto de cada bracket, transferido a boca con cubetas impresas.",
    image: "/assets/tcd/dsc01162.jpg",
    intro:
      "Cementado indirecto de cualquier bracket del mercado, vestibular o lingual. Sistema combinado basado en el Hiro System modificado, con transfers individualizados que aseguran la reproducibilidad en caso de recementado.",
    bullets: [
      "Posicionamiento de brackets y diseño 3D de cubetas",
      "Cubeta exclusiva para 3M APC Flash-Free con guías de inserción",
      "Transfers individualizados, TARG o Class según preferencia",
      "Puedes contratar solo la parte del proceso que necesites",
    ],
    specs: [["Brackets", "Cualquier marca"], ["Técnica", "Hiro System modificado"], ["Entrada", "Escáner intraoral"]],
  },
  {
    slug: "marpe-microimplantes",
    name: "MARPE y ortodoncia sobre microimplantes",
    short: "Flujo 100 % digital",
    claim: "Planificación de micros sobre TAC y férulas quirúrgicas de inserción guiada.",
    image: "/assets/tcd/aparatologia-sobre-micro-implantes.jpg",
    intro:
      "Alineamos tu escaneado intraoral con el TAC y planificamos la posición de los microimplantes. Diseñamos MARPE Power-Screw, distal-mesialjet, T-Bow y toda la aparatología a medida con el tornillo que elijas.",
    bullets: [
      "Alineación de escaneado intraoral + CBCT/DICOM",
      "Férulas quirúrgicas para la inserción guiada de micros",
      "MARPE Power-Screw con flujo totalmente digital",
      "Distal-mesialjet, T-Bow y diseños a medida",
    ],
    specs: [["Entrada", "STL + DICOM + fotos"], ["Tornillo", "El que prefieras"], ["Diseño", "Técnicos especializados"]],
  },
];

export const CATEGORIES = ["Retención", "Anclaje", "Expansión", "Mantenedores", "Funcional", "Apnea", "Digital"] as const;

export const PRODUCTS: { name: string; cat: (typeof CATEGORIES)[number]; file: string; days: string }[] = [
  { name: "Retenedor Zachrisson 3×3", cat: "Retención", file: "STL / modelo", days: "24 h" },
  { name: "Arco lingual + mallas 3×3", cat: "Retención", file: "STL / modelo", days: "24 h" },
  { name: "Arco lingual twist + mallas 3×3", cat: "Retención", file: "STL / modelo", days: "24 h" },
  { name: "Arco lingual festoneado 3×3", cat: "Retención", file: "STL / modelo", days: "24 h" },
  { name: "Arco lingual + mallas 4×4 / 5×5", cat: "Retención", file: "STL / modelo", days: "24 h" },
  { name: "Retenedor Krause 3×3", cat: "Retención", file: "STL / modelo", days: "24 h" },
  { name: "Retenedor composite con matriz", cat: "Retención", file: "STL", days: "24 h" },
  { name: "Retenedor Essix / termoformado", cat: "Retención", file: "STL", days: "24 h" },
  { name: "Arco lingual soldado 6×6", cat: "Anclaje", file: "Modelo con bandas", days: "48 h" },
  { name: "Botón de Nance", cat: "Anclaje", file: "Modelo con bandas", days: "48 h" },
  { name: "Botón de Nance modificado", cat: "Anclaje", file: "Modelo con bandas", days: "48 h" },
  { name: "Barra de Goshgarian", cat: "Anclaje", file: "Modelo con bandas", days: "48 h" },
  { name: "Nance-Goshgarian", cat: "Anclaje", file: "Modelo con bandas", days: "48 h" },
  { name: "Barra palatina con botón de intrusión", cat: "Anclaje", file: "Modelo con bandas", days: "48 h" },
  { name: "Arco lingual activo circunferencial", cat: "Anclaje", file: "Modelo con bandas", days: "48 h" },
  { name: "Disyuntor Hyrax", cat: "Expansión", file: "Modelo con bandas / STL", days: "48 h" },
  { name: "Disyuntor McNamara", cat: "Expansión", file: "Modelo / STL", days: "48 h" },
  { name: "Quad-Helix", cat: "Expansión", file: "Modelo con bandas", days: "48 h" },
  { name: "MARPE Power-Screw", cat: "Expansión", file: "STL + DICOM", days: "5 días" },
  { name: "Placa de expansión con tornillo", cat: "Expansión", file: "STL / modelo", days: "48 h" },
  { name: "Mantenedor de espacio + banda", cat: "Mantenedores", file: "Modelo con banda", days: "24 h" },
  { name: "Mantenedor EZ Bond", cat: "Mantenedores", file: "STL / modelo", days: "24 h" },
  { name: "Rick-a-Nator", cat: "Mantenedores", file: "Modelo con banda", days: "48 h" },
  { name: "Mantenedor subgingival EZ Bond 3-3", cat: "Mantenedores", file: "STL / modelo", days: "48 h" },
  { name: "Parcial pediátrico higiénico", cat: "Mantenedores", file: "Modelo", days: "48 h" },
  { name: "Twin Block", cat: "Funcional", file: "Modelos + mordida", days: "72 h" },
  { name: "Activador / Bionator", cat: "Funcional", file: "Modelos + mordida", days: "72 h" },
  { name: "Frankel", cat: "Funcional", file: "Modelos + mordida", days: "72 h" },
  { name: "Placa Hawley", cat: "Funcional", file: "STL / modelo", days: "24 h" },
  { name: "D.A.M.A. TCD®", cat: "Apnea", file: "Modelos + registro de avance", days: "5 días" },
  { name: "DDBG nylon regulable", cat: "Apnea", file: "Escaneado + registro", days: "5 días" },
  { name: "Férula de descarga ATM", cat: "Apnea", file: "STL / modelo", days: "48 h" },
  { name: "Setup digital", cat: "Digital", file: "STL", days: "48 h" },
  { name: "Cubetas de cementado indirecto", cat: "Digital", file: "STL", days: "72 h" },
  { name: "Férula quirúrgica para microimplantes", cat: "Digital", file: "STL + DICOM", days: "5 días" },
  { name: "Modelos impresos en 3D", cat: "Digital", file: "STL", days: "24 h" },
];

export const SCANNERS = ["3Shape", "iTero", "Medit", "Carestream", "Planmeca", "Dentsply Sirona", "Shining 3D", "Straumann", "Modjaw", "Dental Wings", "3M"];

export const STATS = [
  { value: 35, suffix: "+", label: "años fabricando ortodoncia" },
  { value: 8, suffix: " h", label: "para terminar un trabajo" },
  { value: 1997, suffix: "", label: "pioneros en apnea" },
  { value: 4, suffix: "", label: "países con clínicas cliente" },
];

export const FAQS = [
  ["¿Puedo enviaros archivos desde cualquier escáner intraoral?", "Sí. Recibimos STL, PLY u OBJ desde cualquier marca y modelo (3Shape, iTero, Medit, Carestream, Planmeca, Dentsply Sirona, Shining 3D…) a través de nuestra plataforma o de tu vía habitual de comunicación."],
  ["¿Cuánto tarda un trabajo?", "Nuestro equipo solo necesita 8 horas de producción para un trabajo estándar. A eso se suma el transporte. Los dispositivos digitales complejos (MARPE, apnea, férulas quirúrgicas) tienen plazos específicos que te confirmamos al recibir el caso."],
  ["¿Los portes son gratuitos?", "Sí, las recogidas y entregas de pedidos superiores a 50 € no tienen coste en toda la Península y Canarias."],
  ["¿Cómo veo los precios?", "Los precios son exclusivos para clínicas registradas. Date de alta en el Acceso clínicas y, una vez validada tu cuenta, verás la tarifa completa."],
  ["¿Qué es el D.A.M.A. TCD®?", "Es nuestro dispositivo de avance mandibular patentado para el tratamiento intraoral de la apnea obstructiva del sueño y el ronquido. Fabricamos dispositivos de apnea desde 1997."],
  ["¿Trabajáis con clínicas fuera de España?", "Sí. Suministramos a clínicas y hospitales de España, Europa, Reino Unido y Canadá."],
];

export const TESTIMONIALS = [
  { quote: "La precisión del cementado indirecto nos ha ahorrado tiempo de sillón en cada caso. Y siempre hay un técnico al otro lado del teléfono.", name: "Dra. Laura M.", role: "Ortodoncista · Santander" },
  { quote: "Llevamos años enviando los dispositivos de apnea a TCD. El ajuste es excelente y los pacientes los toleran muy bien.", name: "Dr. Javier R.", role: "Medicina del sueño · Bilbao" },
  { quote: "Subimos el escaneado por la mañana y el aparato llega en plazo. El flujo digital con ellos es muy sencillo.", name: "Dra. Carmen S.", role: "Clínica dental · Las Palmas" },
];

export const PLATFORMS = {
  general: "http://tcdortodoncia-archivos.synology.me/login.php",
  perfectAligner: "https://perfectaligner.com",
};
