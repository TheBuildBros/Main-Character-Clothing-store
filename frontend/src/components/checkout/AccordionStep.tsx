"use client";

import type { ReactNode } from "react";

interface AccordionStepProps {
  stepNumber: number;
  title: string;
  isOpen: boolean;
  isCompleted: boolean;
  canOpen: boolean;
  summary?: ReactNode;
  onChangeClick: () => void;
  children: ReactNode;
}

export function AccordionStep({
  stepNumber,
  title,
  isOpen,
  isCompleted,
  canOpen,
  summary,
  onChangeClick,
  children,
}: AccordionStepProps) {
  const contentId = `checkout-step-panel-${stepNumber}`;
  const headingId = `checkout-step-heading-${stepNumber}`;

  return (
    <section
      aria-labelledby={headingId}
      className={`bg-white border rounded-sm overflow-hidden transition-shadow duration-250 motion-reduce:transition-none ${
        isOpen
          ? "border-[#C6A76A]/60 shadow-[0_6px_24px_rgba(11,31,58,0.07)]"
          : "border-[#0B1F3A]/10 shadow-[0_2px_10px_rgba(11,31,58,0.03)]"
      }`}
    >
      {/* Header bar */}
      <div
        className={`px-5 sm:px-6 py-4 flex items-center justify-between gap-4 transition-colors duration-250 motion-reduce:transition-none ${
          isOpen
            ? "bg-[#0B1F3A] text-[#F8F6F1]"
            : "bg-white text-[#0B1F3A]"
        }`}
      >
        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-xs font-bold tabular-nums ${
              isOpen
                ? "bg-[#C6A76A] text-[#0B1F3A]"
                : isCompleted
                  ? "bg-[#F8F6F1] text-[#C6A76A] border border-[#C6A76A]/50"
                  : "bg-[#F0EDE6] text-[#6B6B6B]"
            }`}
          >
            {isCompleted && !isOpen ? (
              <svg
                className="h-4 w-4 text-[#C6A76A]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.4}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              stepNumber
            )}
          </span>

          <div className="min-w-0 flex-1">
            <h2
              id={headingId}
              className={`text-xs sm:text-[13px] uppercase tracking-[0.24em] font-semibold flex items-center gap-2 ${
                isOpen ? "text-[#F8F6F1]" : "text-[#0B1F3A]"
              }`}
            >
              <span>{title}</span>
            </h2>

            {!isOpen && isCompleted && summary && (
              <div className="mt-1 text-sm text-[#20242B]/80 truncate">
                {summary}
              </div>
            )}
          </div>
        </div>

        {!isOpen && (isCompleted || canOpen) && (
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={contentId}
            onClick={onChangeClick}
            className="min-h-[40px] px-4 py-1.5 text-xs uppercase tracking-[0.2em] font-semibold text-[#0B1F3A] border border-[#0B1F3A]/20 rounded-sm hover:border-[#C6A76A] hover:text-[#C6A76A] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A76A]"
          >
            CHANGE
          </button>
        )}
      </div>

      {/* Smooth collapsible body */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={headingId}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-5 sm:p-6 border-t border-[#0B1F3A]/8">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
