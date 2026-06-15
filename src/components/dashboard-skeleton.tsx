import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Card><CardContent className="grid gap-3 p-5 sm:grid-cols-[1fr_140px]"><Skeleton className="h-10" /><Skeleton className="h-10" /></CardContent></Card>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card key={index}><CardContent className="space-y-3 p-5"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-8 w-full" /></CardContent></Card>
        ))}
      </section>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card><CardContent className="p-5"><Skeleton className="h-72" /></CardContent></Card>
        <Card><CardContent className="p-5"><Skeleton className="h-72" /></CardContent></Card>
      </div>
    </div>
  );
}
