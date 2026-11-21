"use client";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  itemName?: string;
  onChange: (nextValue: number) => void;
}

export function QuantityStepper({
  value,
  min = 1,
  max = 10,
  disabled = false,
  itemName = "item",
  onChange,
}: QuantityStepperProps) {
  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && value < max;

  return (
    <div
      className="inline-flex items-center border border-[#0B1F3A]/15 bg-white rounded-sm overflow-hidden"
      role="group"
      aria-label={`Quantity for ${itemName}`}
    >
      <button
        type="button"
        disabled={!canDecrement}
        onClick={() => canDecrement && onChange(value - 1)}
        aria-label={`Decrease quantity of ${itemName}`}
        className="flex h-11 w-11 sm:h-9 sm:w-9 items-center justify-center text-[#0B1F3A] transition-colors duration-200 hover:bg-[#F8F6F1] active:bg-[#F0EDE6] disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C6A76A] motion-reduce:transition-none"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden="true"
        >
          <path strokeLinecap="round" d="M5 12h14" />
        </svg>
      </button>

      <span
        aria-live="polite"
        className="min-w-[2.5rem] px-2 text-center text-sm font-semibold text-[#0B1F3A] tabular-nums select-none"
      >
        {value}
      </span>

      <button
        type="button"
        disabled={!canIncrement}
        onClick={() => canIncrement && onChange(value + 1)}
        aria-label={`Increase quantity of ${itemName}`}
        className="flex h-11 w-11 sm:h-9 sm:w-9 items-center justify-center text-[#0B1F3A] transition-colors duration-200 hover:bg-[#F8F6F1] active:bg-[#F0EDE6] disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C6A76A] motion-reduce:transition-none"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden="true"
        >
          <path strokeLinecap="round" d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}
