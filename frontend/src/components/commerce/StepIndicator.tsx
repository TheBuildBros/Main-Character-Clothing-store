"use client";

export type CheckoutFlowStep = "bag" | "delivery" | "payment";

interface StepIndicatorProps {
  currentStep: CheckoutFlowStep;
}

const STEPS: { id: CheckoutFlowStep; label: string }[] = [
  { id: "bag", label: "Bag" },
  { id: "delivery", label: "Delivery" },
  { id: "payment", label: "Payment" },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Checkout progress" className="w-full">
      <ol className="flex items-center gap-2 sm:gap-3">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li
              key={step.id}
              className="flex items-center gap-2 sm:gap-3"
              aria-current={isCurrent ? "step" : undefined}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums transition-colors duration-250 motion-reduce:transition-none ${
                    isCurrent
                      ? "bg-[#C6A76A] text-[#0B1F3A]"
                      : isCompleted
                        ? "bg-[#0B1F3A] text-[#C6A76A]"
                        : "border border-[#0B1F3A]/20 text-[#20242B]/45 bg-white"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors duration-250 motion-reduce:transition-none ${
                    isCurrent
                      ? "text-[#C6A76A]"
                      : isCompleted
                        ? "text-[#0B1F3A]"
                        : "text-[#20242B]/45"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`h-px w-6 sm:w-10 transition-colors duration-250 motion-reduce:transition-none ${
                    isCompleted ? "bg-[#C6A76A]" : "bg-[#0B1F3A]/15"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
