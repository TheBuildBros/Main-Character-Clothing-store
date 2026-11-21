"use client";

import { useEffect } from "react";
import Link from "next/link";

export interface ToastData {
  id: number;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  durationMs?: number;
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
  /** Lift toast slightly on mobile when a fixed bottom bar is visible */
  hasMobileBottomBar?: boolean;
}

export function Toast({
  toast,
  onDismiss,
  hasMobileBottomBar = false,
}: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(onDismiss, toast.durationMs ?? 4500);
    return () => window.clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-6 z-50 w-[calc(100%-2rem)] max-w-md transition-all duration-250 ease-out motion-reduce:transition-none ${
        hasMobileBottomBar ? "bottom-24 lg:bottom-6" : "bottom-6"
      }`}
    >
      <div className="flex items-center justify-between gap-4 bg-[#0B1F3A] text-[#F8F6F1] border border-[#C6A76A]/40 px-4 py-3.5 shadow-[0_12px_36px_rgba(11,31,58,0.28)] rounded-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="h-2 w-2 rounded-full bg-[#C6A76A] shrink-0"
            aria-hidden="true"
          />
          <p className="text-sm leading-snug text-[#F8F6F1] truncate">
            {toast.message}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {toast.actionLabel && toast.onAction && (
            <button
              type="button"
              onClick={() => {
                toast.onAction?.();
                onDismiss();
              }}
              className="min-h-[36px] px-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#C6A76A] hover:text-[#e0c487] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A]"
            >
              {toast.actionLabel}
            </button>
          )}

          {toast.actionLabel && toast.actionHref && !toast.onAction && (
            <Link
              href={toast.actionHref}
              onClick={onDismiss}
              className="inline-flex items-center min-h-[36px] px-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#C6A76A] hover:text-[#e0c487] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A]"
            >
              {toast.actionLabel}
            </Link>
          )}

          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="flex h-8 w-8 items-center justify-center text-[#F8F6F1]/60 hover:text-[#F8F6F1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A]"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              aria-hidden="true"
            >
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
