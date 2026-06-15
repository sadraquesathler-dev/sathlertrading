"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { BarChart3, LogOut, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppHeader({ user, onSignIn, onSignOut }: { user: User | null; onSignIn: () => void; onSignOut: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/82 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/12 text-primary">
            <TrendingUp className="h-5 w-5" />
          </span>
          <span className="truncate text-base font-semibold">Trade Performance</span>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost"><Link href="/">Dashboard</Link></Button>
          <Button asChild variant="ghost"><Link href="/annual">Anual</Link></Button>
          <Button asChild variant="ghost"><Link href="/roi">ROI</Link></Button>
          <Button asChild variant="ghost"><Link href="/growth">Growth</Link></Button>
          <Button asChild variant="ghost"><Link href="/simulador">Simulador</Link></Button>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground sm:flex">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="max-w-44 truncate">{user.email}</span>
              </div>
              <Button variant="outline" size="icon" onClick={onSignOut} aria-label="Sair"><LogOut className="h-4 w-4" /></Button>
            </>
          ) : (
            <Button onClick={onSignIn}><BarChart3 className="h-4 w-4" />Entrar com Google</Button>
          )}
        </div>
      </div>
    </header>
  );
}
