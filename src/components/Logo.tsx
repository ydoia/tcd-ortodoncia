import Link from "next/link";

export function LogoMark({ className = "h-7" }: { className?: string; forceColors?: boolean }) {
  return (
    <svg viewBox="0 0 92 36" className={`${className} overflow-visible`} aria-hidden>
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="#F7D945"
        className="origin-[18px_18px] transition-transform duration-300 ease-out group-hover:scale-115 group-hover:-translate-y-0.5"
      />
      <circle
        cx="46"
        cy="18"
        r="16"
        fill="#E8B21F"
        opacity="0.92"
        className="origin-[46px_18px] transition-transform duration-300 delay-75 ease-out group-hover:scale-115 group-hover:-translate-y-0.5"
      />
      <circle
        cx="74"
        cy="18"
        r="16"
        fill="#F2873A"
        opacity="0.92"
        className="origin-[74px_18px] transition-transform duration-300 delay-150 ease-out group-hover:scale-115 group-hover:-translate-y-0.5"
      />
    </svg>
  );
}

export default function Logo({ dark = true }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 group" aria-label="TCD Ortodoncia — inicio">
      <LogoMark className="h-6" />
      <span className={`font-display font-bold text-lg leading-none ${dark ? "text-white" : "text-graphite"}`}>
        TCD<span className={`ml-1.5 font-medium text-[11px] tracking-[0.25em] align-middle ${dark ? "text-white/55" : "text-graphite/50"}`}>ORTODONCIA</span>
      </span>
    </Link>
  );
}
