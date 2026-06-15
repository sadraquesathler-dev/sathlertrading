"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LockKeyhole, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordPage() {
  const supabase = useMemo(() => createClient(), []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;

    supabase.auth.exchangeCodeForSession(code).then(({ error: authError }) => {
      if (authError) setError(authError.message);
      window.history.replaceState({}, document.title, window.location.pathname);
    });
  }, [supabase]);

  async function updatePassword() {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres.");
        return;
      }
      if (password !== confirmPassword) {
        setError("As senhas não conferem.");
        return;
      }

      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) throw authError;
      setMessage("Senha alterada com sucesso.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="cosmic-page min-h-screen">
      <div className="cosmic-nebula" />
      <div className="meteor-field" />
      <div className="planet-horizon" />
      <section className="container flex min-h-screen items-center justify-center py-10">
        <Card className="neon-card relative w-full max-w-lg overflow-hidden rounded-[1.75rem] px-2 py-3">
          <CardHeader className="items-center space-y-3 pb-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-white/[.05] text-cyan-200 shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_16px_36px_rgba(0,0,0,.28)]">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold text-white">Redefinir senha</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">Informe sua nova senha para continuar.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="new-password" className="pl-10" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nova senha" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">Confirmar nova senha</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="confirm-new-password" className="pl-10" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirme a nova senha" />
              </div>
            </div>
            {error && <div className="rounded-md border border-loss/50 bg-loss/10 px-3 py-2 text-sm text-loss">{error}</div>}
            {message && <div className="rounded-md border border-profit/50 bg-profit/10 px-3 py-2 text-sm text-profit">{message}</div>}
            <Button type="button" className="neon-button h-11 w-full text-base font-semibold" onClick={updatePassword} disabled={!password || !confirmPassword || loading}>
              {loading ? "Atualizando" : "Atualizar senha"}
            </Button>
            <Button asChild type="button" variant="secondary" className="h-11 w-full border-cyan-300/20 bg-white/[.045] text-base hover:border-cyan-300/40 hover:bg-white/[.07] hover:shadow-[0_0_30px_rgba(34,211,238,.1)]">
              <Link href="/">Ir para login</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
