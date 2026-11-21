"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
}

/**
 * Renders a product image with next/image and a clean MainCharacter fallback
 * when the image URL is missing, a placeholder string, or fails to load.
 */
export function ProductImage({
  src,
  alt,
  className = "object-cover object-center",
  sizes = "(max-width: 640px) 120px, 240px",
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  const isValidSrc =
    Boolean(src) &&
    src !== "/placeholder" &&
    (src!.startsWith("http://") ||
      src!.startsWith("https://") ||
      src!.startsWith("/"));

  if (!isValidSrc || hasError) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center bg-[#F0EDE6] text-[#0B1F3A]/40 p-3 text-center select-none"
        aria-label={alt}
      >
        <svg
          className="h-7 w-7 text-[#C6A76A] mb-1.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.3}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6a2 2 0 1 0-2-2c0 1.1.9 2 2 2Zm0 0v2.2L4.2 13.8A1.5 1.5 0 0 0 5.1 16.5h13.8a1.5 1.5 0 0 0 .9-2.7L12 8.2Z"
          />
        </svg>
        <span className="text-[9px] uppercase tracking-[0.25em] font-medium text-[#0B1F3A]/50">
          MainCharacter
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src!}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
