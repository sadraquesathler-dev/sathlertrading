"use client";

import { useMemo, useState } from "react";
import { format, getDay } from "date-fns";
import { CalendarDays, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getHolidayName, getMonthDays, isToday, isWeekend } from "@/lib/date-utils";
import { formatCurrency, toDateKey } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TradeResult, TradeResultInput } from "@/types/database";

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

export function TradeCalendar({ referenceDate, results, onSave }: { referenceDate: Date; results: TradeResult[]; onSave: (input: TradeResultInput) => Promise<void> }) {
  const [selected, setSelected] = useState<Date | null>(null);
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const resultByDate = useMemo(() => new Map(results.map((item) => [item.trade_date, item])), [results]);
  const days = getMonthDays(referenceDate);
  const leading = Array.from({ length: getDay(days[0]) });

  function openDay(day: Date) {
    const item = resultByDate.get(toDateKey(day));
    setSelected(day);
    setValue(item ? String(item.result_value) : "");
    setNotes(item?.notes ?? "");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setSaving(true);
    await onSave({ trade_date: toDateKey(selected), result_value: Number(value || 0), notes });
    setSaving(false);
    setSelected(null);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Calendário de operações</CardTitle>
        <CalendarDays className="h-4 w-4 text-accent" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
          {weekDays.map((day) => <div key={day} className="py-2 font-medium">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {leading.map((_, index) => <div key={`empty-${index}`} className="aspect-square" />)}
          {days.map((day) => {
            const key = toDateKey(day);
            const item = resultByDate.get(key);
            const amount = Number(item?.result_value ?? 0);
            const holiday = getHolidayName(day);
            return (
              <button
                key={key}
                onClick={() => openDay(day)}
                title={holiday ?? undefined}
                className={cn(
                  "flex aspect-square min-h-16 flex-col items-start justify-between rounded-md border border-border bg-secondary/25 p-2 text-left transition hover:border-primary/70 hover:bg-secondary/50",
                  (isWeekend(day) || holiday) && "opacity-45",
                  isToday(day) && "border-accent ring-1 ring-accent/70",
                  amount > 0 && "bg-profit/10 text-profit",
                  amount < 0 && "bg-loss/10 text-loss",
                )}
              >
                <span className="text-xs font-semibold">{format(day, "d")}</span>
                {holiday && <span className="w-full truncate text-[10px] text-warning">Feriado</span>}
                {item && <span className="w-full truncate text-[11px] font-semibold">{formatCurrency(amount)}</span>}
              </button>
            );
          })}
        </div>
      </CardContent>
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selected ? `Operacao de ${format(selected, "dd/MM/yyyy")}` : "Operacao"}</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="result">Resultado financeiro</Label>
              <Input id="result" type="number" step="0.01" value={value} onChange={(event) => setValue(event.target.value)} autoFocus />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Observacao</Label>
              <Textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Contexto, setup, emoção, gestão de risco..." />
            </div>
            <Button type="submit" disabled={saving} className="w-full"><Save className="h-4 w-4" />{saving ? "Salvando" : "Salvar operação"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
