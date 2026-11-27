export default function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="glass-card p-8 sm:p-10 max-w-2xl space-y-3">
      <span className="eyebrow">UPCOMING MODULE</span>
      <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight m-0">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed m-0">
        This section is part of the next build phase.
      </p>
    </div>
  );
}
