"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FAQS } from "@/lib/data";
import { Plus } from "./Icons";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-graphite/10 border-y border-graphite/10">
      {FAQS.map(([q, a], i) => {
        const isOpen = open === i;
        return (
          <div key={q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full py-6 flex items-center justify-between gap-4 text-left group"
            >
              <span className="font-display text-lg lg:text-xl text-graphite group-hover:text-amber transition-colors">{q}</span>
              <span className={`w-9 h-9 rounded-full border border-graphite/15 grid place-items-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45 bg-graphite text-white" : "text-graphite"}`}>
                <Plus className="w-4 h-4" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-graphite/65 leading-relaxed pr-12">{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
