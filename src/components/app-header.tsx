"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { BarChart3, LogOut, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppHeader({ user, onSignIn, onSignOut }: { user: User | null; onSignIn: () => void; onSignOut: () => void }) {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <div className="cosmic-header container flex h-16 items-center justify-between gap-4 rounded-2xl px-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-white/[.05] text-cyan-200 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
            <TrendingUp className="h-5 w-5" />
          </span>
          <span className="truncate text-lg font-semibold tracking-normal text-white">
            Performance <span className="gradient-text">de Trading</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link className="relative text-sm font-semibold text-white after:absolute after:-bottom-2.5 after:left-1/2 after:h-px after:w-8 after:-translate-x-1/2 after:bg-cyan-300" href="/">Painel</Link>
          <Link className="text-sm font-semibold text-muted-foreground transition hover:text-cyan-200" href="/annual">Anual</Link>
          <Link className="text-sm font-semibold text-muted-foreground transition hover:text-cyan-200" href="/roi">ROI</Link>
          <Link className="text-sm font-semibold text-muted-foreground transition hover:text-cyan-200" href="/growth">Crescimento</Link>
          <Link className="text-sm font-semibold text-muted-foreground transition hover:text-cyan-200" href="/simulador">Simulador</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-muted-foreground backdrop-blur-xl sm:flex">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                <span className="max-w-44 truncate">{user.email}</span>
              </div>
              <Button variant="outline" size="icon" onClick={onSignOut} aria-label="Sair"><LogOut className="h-4 w-4" /></Button>
            </>
          ) : (
            <Button onClick={onSignIn} className="neon-button hidden h-10 px-4 sm:inline-flex"><BarChart3 className="h-4 w-4" />Entrar com Google</Button>
          )}
        </div>
      </div>
    </header>
  );
}
