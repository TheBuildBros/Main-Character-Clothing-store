import { ArrowLeft, Compass } from "lucide-react";
import { useEffect } from "react";
import { Link } from "wouter";

const NOT_FOUND_PATH = "/404";

export default function NotFound() {
  useEffect(() => {
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);

    if (window.location.pathname.replace(/\/$/, "") !== NOT_FOUND_PATH) {
      window.location.replace(NOT_FOUND_PATH);
    }

    return () => {
      robots.remove();
    };
  }, []);

  return (
    <div className="catalog-page max-w-3xl mx-auto py-16 sm:py-24">
      <div className="glass-card px-6 sm:px-12 py-14 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#0047ff] to-[#00aeff] text-white flex items-center justify-center shadow-[0_12px_28px_rgba(0,87,255,0.35)]">
          <Compass size={28} />
        </div>
        <span className="eyebrow">ERROR 404 · OUT OF FRAME</span>
        <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight">
          Page not found<span className="blue-period">.</span>
        </h1>
        <p className="text-sm text-[var(--muted)] max-w-md mx-auto leading-relaxed">
          The page you are looking for has moved or no longer exists.
        </p>
        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="button-primary">
            <ArrowLeft size={15} />
            <span>Back to Home</span>
          </Link>
          <Link href="/collections" className="text-link px-4">
            Browse all pieces
          </Link>
        </div>
      </div>
    </div>
  );
}
