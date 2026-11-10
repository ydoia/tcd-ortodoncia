import Link from "next/link";

export function LogoMark({ className = "h-7", forceColors = false }: { className?: string; forceColors?: boolean }) {
  return (
    <svg viewBox="0 0 92 36" className={`${className} group/logo overflow-visible`} aria-hidden>
      {/* Círculo izquierdo: siempre amarillo ámbar */}
      <circle cx="18" cy="18" r="16" fill="#F7D945" className="transition-all duration-300 group-hover/logo:scale-105" />
      {/* Círculo centro: gris plateado refinado por defecto, ámbar/naranja al hacer hover */}
      <circle
        cx="46"
        cy="18"
        r="16"
        fill={forceColors ? "#E8B21F" : "#A6ADB8"}
        className={`transition-all duration-300 ${!forceColors ? "group-hover/logo:fill-[#E8B21F] group-hover/logo:scale-105 opacity-80 group-hover/logo:opacity-100" : ""}`}
      />
      {/* Círculo derecho: titanio/grafito claro por defecto, naranja al hacer hover */}
      <circle
        cx="74"
        cy="18"
        r="16"
        fill={forceColors ? "#F2873A" : "#6E7682"}
        className={`transition-all duration-300 ${!forceColors ? "group-hover/logo:fill-[#F2873A] group-hover/logo:scale-105 opacity-70 group-hover/logo:opacity-100" : ""}`}
      />
    </svg>
  );
}

export default function Logo({ dark = true }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 group" aria-label="TCD Ortodoncia — inicio">
      <LogoMark className="h-6 transition-transform duration-500 group-hover:scale-105" />
      <span className={`font-display font-bold text-lg leading-none ${dark ? "text-white" : "text-graphite"}`}>
        TCD<span className={`ml-1.5 font-medium text-[11px] tracking-[0.25em] align-middle ${dark ? "text-white/55" : "text-graphite/50"}`}>ORTODONCIA</span>
      </span>
    </Link>
  );
}
