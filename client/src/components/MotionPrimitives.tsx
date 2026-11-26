import { type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

const EASE_CURVE = [0.22, 1, 0.36, 1] as const;

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-50 origin-left pointer-events-none bg-gradient-to-r from-[#0033b3] via-[#0057ff] to-[#00b4ff]"
      style={{ scaleX }}
    />
  );
}

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 24,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.55, delay, ease: EASE_CURVE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGridProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

export function StaggerGrid({
  children,
  className = "",
  stagger = 0.08,
}: StaggerGridProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 22 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: EASE_CURVE },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
