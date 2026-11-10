import type { ReactNode } from "react";

export function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col h-full rounded-xl border border-border bg-card p-4 min-w-0 shadow-xs overflow-hidden">
      <div className="shrink-0 mb-3">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {children}
      </div>
    </section>
  );
}