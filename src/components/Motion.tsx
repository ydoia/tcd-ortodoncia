"use client";
import { motion, useInView, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function Reveal({ children, delay = 0, className = "", y = 24 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Counter({ to, suffix = "", plain = false }: { to: number; suffix?: string; plain?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(plain ? to : 0);
  useEffect(() => {
    if (!inView || plain) return;
    const from = to > 1000 ? to - 40 : 0;
    const c = animate(from, to, { duration: 1.6, ease: "easeOut", onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, to, plain]);
  return (
    <span ref={ref} className="tabular">
      {val}
      {suffix}
    </span>
  );
}
