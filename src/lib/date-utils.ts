import { addDays, endOfMonth, format, getDay, isSameDay, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getBrazilHoliday, isBrazilNationalHoliday } from "./brazil-holidays";

export function isWeekend(date: Date) {
  const day = getDay(date);
  return day === 0 || day === 6;
}

export function isBusinessDay(date: Date) {
  return !isWeekend(date) && !isBrazilNationalHoliday(date);
}

export function getHolidayName(date: Date) {
  return getBrazilHoliday(date)?.name ?? null;
}

export function getMonthDays(date: Date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days: Date[] = [];
  let cursor = start;
  while (cursor <= end) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
}

export function getRemainingBusinessDays(date: Date) {
  const end = endOfMonth(date);
  let cursor = date;
  let count = 0;
  while (cursor <= end) {
    if (isBusinessDay(cursor)) count += 1;
    cursor = addDays(cursor, 1);
  }
  return count;
}

export function getBusinessDaysUntilEndOfMonth(date: Date) {
  const days: Date[] = [];
  let cursor = date;
  const end = endOfMonth(date);
  while (cursor <= end) {
    if (isBusinessDay(cursor)) days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
}

export function getMonthLabel(date: Date) {
  return format(date, "MMMM yyyy", { locale: ptBR });
}

export function isToday(date: Date) {
  return isSameDay(date, new Date());
}
