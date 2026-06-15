"use client";

import { useState } from "react";
import { BarChart3, LockKeyhole, LogIn, Mail, TrendingUp, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthPanel({
  onGoogleSignIn,
  onPasswordSignIn,
  onPasswordSignUp,
}: {
  onGoogleSignIn: () => void;
  onPasswordSignIn: (email: string, password: string) => Promise<void>;
  onPasswordSignUp: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState<"sign-in" | "sign-up" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(action: "sign-in" | "sign-up") {
    setLoadingAction(action);
    setMessage(null);
    setError(null);
    try {
      if (action === "sign-in") {
        await onPasswordSignIn(email, password);
      } else {
        await onPasswordSignUp(email, password);
        setMessage("Conta criada. Se a confirmação por email estiver ativa no Supabase, confirme seu email antes de entrar.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível autenticar.");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <Card className="neon-card relative w-full max-w-lg overflow-hidden rounded-[1.75rem] px-2 py-3">
      <div className="relative">
        <CardHeader className="items-center space-y-3 pb-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-white/[.05] text-cyan-200 shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_16px_36px_rgba(0,0,0,.28)]">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold text-white">Acesso ao painel</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">Faça login para continuar</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="auth-email" className="pl-10" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="auth-password">Senha</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="auth-password" className="pl-10" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Sua senha" />
            </div>
          </div>
          {error && <div className="rounded-md border border-loss/50 bg-loss/10 px-3 py-2 text-sm text-loss">{error}</div>}
          {message && <div className="rounded-md border border-profit/50 bg-profit/10 px-3 py-2 text-sm text-profit">{message}</div>}
          <Button type="button" className="neon-button h-11 w-full text-base font-semibold" onClick={() => submit("sign-in")} disabled={!email || !password || loadingAction !== null}>
            <LogIn className="h-5 w-5" />{loadingAction === "sign-in" ? "Entrando" : "Entrar"}
          </Button>
          <Button type="button" variant="outline" className="h-11 w-full border-white/10 bg-white/[.035] hover:border-cyan-300/30 hover:bg-white/[.06]" onClick={() => submit("sign-up")} disabled={!email || !password || loadingAction !== null}>
            <UserPlus className="h-4 w-4" />{loadingAction === "sign-up" ? "Criando" : "Criar conta"}
          </Button>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <span>ou</span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
          </div>
          <Button type="button" variant="secondary" className="h-11 w-full border-cyan-300/20 bg-white/[.045] text-base hover:border-cyan-300/40 hover:bg-white/[.07] hover:shadow-[0_0_30px_rgba(34,211,238,.1)]" onClick={onGoogleSignIn}>
            <span className="text-lg font-bold text-accent">G</span><BarChart3 className="h-4 w-4" />Entrar com Google
          </Button>
          <p className="text-center text-xs text-muted-foreground">Seus dados estão protegidos com criptografia.</p>
        </CardContent>
      </div>
    </Card>
  );
}
