import { memo } from "react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { NavSubItem } from "./navConfig";

interface NavLimitedDropdownProps {
  id?: string;
  isOpen: boolean;
  items: NavSubItem[];
  onClose: () => void;
  currentPath: string;
}

export const NavLimitedDropdown = memo(function NavLimitedDropdown({
  id = "limited-dropdown",
  isOpen,
  items,
  onClose,
  currentPath,
}: NavLimitedDropdownProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!isOpen) return null;

  return (
    <motion.div
      id={id}
      role="menu"
      aria-orientation="vertical"
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-0 mt-1 w-64 rounded-sm bg-white/95 dark:bg-[#0b0f1a]/95 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-xl py-2 z-40 transition-colors"
    >
      <ul className="divide-y divide-black/5 dark:divide-white/5 list-none m-0 p-0">
        <div className="py-1">
          {items
            .filter((item) => !item.highlight)
            .map((item) => {
              const isActive = currentPath === item.href;
              return (
                <li key={item.href} role="none">
                  <Link
                    href={item.href}
                    role="menuitem"
                    onClick={onClose}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm font-normal tracking-wide transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${
                      isActive
                        ? "text-[#1e6bff] dark:text-[#4fa3ff]"
                        : "text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.isPulsing && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                        </span>
                      )}
                      <span>{item.label}</span>
                    </span>

                    {item.badge && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium tracking-widest bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
        </div>

        {/* Separated Emphasized "Shop All" Item */}
        {items
          .filter((item) => item.highlight)
          .map((item) => {
            const isActive = currentPath === item.href;
            return (
              <div key={item.href} className="pt-1 pb-1">
                <li role="none">
                  <Link
                    href={item.href}
                    role="menuitem"
                    onClick={onClose}
                    className={`group flex items-center justify-between px-4 py-2.5 text-sm font-bold tracking-wider transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${
                      isActive
                        ? "text-[#1e6bff] dark:text-[#4fa3ff]"
                        : "text-black dark:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-1 text-[#1e6bff] dark:text-[#4fa3ff]"
                    />
                  </Link>
                </li>
              </div>
            );
          })}
      </ul>
    </motion.div>
  );
});
