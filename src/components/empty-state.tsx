import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-secondary/15 p-8 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-secondary/40 text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
