import { memo } from "react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { MegaMenuColumn } from "./navConfig";

interface NavMegaMenuProps {
  id?: string;
  isOpen: boolean;
  columns: MegaMenuColumn[];
  onClose: () => void;
  currentPath: string;
}

export const NavMegaMenu = memo(function NavMegaMenu({
  id = "essentials-mega-menu",
  isOpen,
  columns,
  onClose,
  currentPath,
}: NavMegaMenuProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!isOpen) return null;

  return (
    <motion.div
      id={id}
      role="region"
      aria-label="Main Character Essentials categories"
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-0 right-0 w-full bg-white/95 dark:bg-[#0b0f1a]/95 backdrop-blur-md border-b border-black/10 dark:border-white/10 shadow-2xl z-40 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-10">
        <div className="flex items-center justify-between pb-5 mb-8 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.25em] font-mono uppercase text-[#1e6bff]">
              COLLECTION
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Permanent Wardrobe Staples
            </span>
          </div>
          <Link
            href="/collections"
            onClick={onClose}
            className="text-xs font-medium tracking-wider uppercase text-muted-foreground hover:text-[#1e6bff] dark:hover:text-[#4fa3ff] inline-flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Pieces</span>
            <ArrowRight
              size={12}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Grouped Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
          {columns.map((column) => (
            <div key={column.heading} className="space-y-4">
              <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground border-b border-black/10 dark:border-white/10 pb-2">
                {column.heading}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => {
                  const isActive = currentPath === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={`group flex items-center justify-between text-sm font-normal tracking-wide py-1 transition-colors ${
                          isActive
                            ? "text-[#1e6bff] dark:text-[#4fa3ff]"
                            : "text-muted-foreground hover:text-black dark:hover:text-white"
                        }`}
                      >
                        <span className="relative">
                          {link.label}
                          <span
                            className={`absolute left-0 -bottom-0.5 h-[1px] w-full bg-[#1e6bff] dark:bg-[#4fa3ff] transition-transform duration-200 origin-left ${
                              isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                            }`}
                          />
                        </span>
                        <ArrowRight
                          size={11}
                          className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#1e6bff] dark:text-[#4fa3ff]"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});
