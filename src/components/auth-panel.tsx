"use client";

import { useState } from "react";
import { BarChart3, LogIn, UserPlus } from "lucide-react";
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
        setMessage("Conta criada. Se a confirmacao por email estiver ativa no Supabase, confirme seu email antes de entrar.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel autenticar.");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Acesso ao dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="auth-email">Email</Label>
          <Input id="auth-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="auth-password">Senha</Label>
          <Input id="auth-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Sua senha" />
        </div>
        {error && <div className="rounded-md border border-loss/40 bg-loss/10 px-3 py-2 text-sm text-loss">{error}</div>}
        {message && <div className="rounded-md border border-profit/40 bg-profit/10 px-3 py-2 text-sm text-profit">{message}</div>}
        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="button" onClick={() => submit("sign-in")} disabled={!email || !password || loadingAction !== null}>
            <LogIn className="h-4 w-4" />{loadingAction === "sign-in" ? "Entrando" : "Entrar"}
          </Button>
          <Button type="button" variant="outline" onClick={() => submit("sign-up")} disabled={!email || !password || loadingAction !== null}>
            <UserPlus className="h-4 w-4" />{loadingAction === "sign-up" ? "Criando" : "Criar conta"}
          </Button>
        </div>
        <Button type="button" variant="secondary" className="w-full" onClick={onGoogleSignIn}>
          <BarChart3 className="h-4 w-4" />Entrar com Google
        </Button>
      </CardContent>
    </Card>
  );
}
