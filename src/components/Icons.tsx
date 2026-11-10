type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24" };

export const Arrow = ({ className = "w-4 h-4" }: P) => (<svg {...base} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const Upload = ({ className = "w-5 h-5" }: P) => (<svg {...base} className={className}><path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>);
export const Clock = ({ className = "w-5 h-5" }: P) => (<svg {...base} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
export const Truck = ({ className = "w-5 h-5" }: P) => (<svg {...base} className={className}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>);
export const Cube = ({ className = "w-5 h-5" }: P) => (<svg {...base} className={className}><path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></svg>);
export const Shield = ({ className = "w-5 h-5" }: P) => (<svg {...base} className={className}><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>);
export const User = ({ className = "w-5 h-5" }: P) => (<svg {...base} className={className}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>);
export const Phone = ({ className = "w-4 h-4" }: P) => (<svg {...base} className={className}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>);
export const Pin = ({ className = "w-4 h-4" }: P) => (<svg {...base} className={className}><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>);
export const Check = ({ className = "w-4 h-4" }: P) => (<svg {...base} className={className}><path d="m5 12 5 5 9-10" /></svg>);
export const Plus = ({ className = "w-4 h-4" }: P) => (<svg {...base} className={className}><path d="M12 5v14M5 12h14" /></svg>);
export const Search = ({ className = "w-4 h-4" }: P) => (<svg {...base} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>);
export const File = ({ className = "w-5 h-5" }: P) => (<svg {...base} className={className}><path d="M14 3H6v18h12V7l-4-4Z" /><path d="M14 3v4h4M9 13h6M9 17h4" /></svg>);
export const Lock = ({ className = "w-5 h-5" }: P) => (<svg {...base} className={className}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>);
export const Spark = ({ className = "w-5 h-5" }: P) => (<svg {...base} className={className}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></svg>);
export const Grad = ({ className = "w-5 h-5" }: P) => (<svg {...base} className={className}><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11v5c3 2.5 9 2.5 12 0v-5" /></svg>);
export const Box = ({ className = "w-5 h-5" }: P) => (<svg {...base} className={className}><path d="M3 7l9-4 9 4v10l-9 4-9-4V7Z" /><path d="m3 7 9 4 9-4M12 11v10" /></svg>);
export const Headset = ({ className = "w-5 h-5" }: P) => (<svg {...base} className={className}><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></svg>);
export const Menu = ({ className = "w-6 h-6" }: P) => (<svg {...base} className={className}><path d="M4 7h16M4 12h16M4 17h10" /></svg>);
export const X = ({ className = "w-5 h-5" }: P) => (<svg {...base} className={className}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const Send = ({ className = "w-4 h-4" }: P) => (<svg {...base} className={className}><path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" /></svg>);
export const WhatsApp = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35zM12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.41 1.26 4.85L2 22l5.3-1.25A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.18a8.17 8.17 0 0 1-4.16-1.14l-.3-.18-3.1.73.78-3.01-.2-.31A8.15 8.15 0 0 1 3.82 12 8.18 8.18 0 1 1 12 20.18z" /></svg>
);
