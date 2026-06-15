"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GoalEditor({ value, onSave }: { value: number; onSave: (value: number) => Promise<void> }) {
  const [target, setTarget] = useState(String(value || ""));
  const [saving, setSaving] = useState(false);

  useEffect(() => setTarget(String(value || "")), [value]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    await onSave(Number(target || 0));
    setSaving(false);
  }

  return (
    <Card>
      <CardHeader><CardTitle>Objetivo Mensal</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="target">Valor alvo</Label>
            <Input id="target" type="number" min="0" step="0.01" value={target} onChange={(event) => setTarget(event.target.value)} placeholder="12000" />
          </div>
          <Button type="submit" disabled={saving}><Save className="h-4 w-4" />{saving ? "Salvando" : "Salvar"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
