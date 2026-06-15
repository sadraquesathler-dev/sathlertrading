export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

export const percentFormatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number) {
  return percentFormatter.format(Number.isFinite(value) ? value / 100 : 0);
}

export function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
