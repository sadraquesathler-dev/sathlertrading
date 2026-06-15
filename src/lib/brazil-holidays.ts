import { format } from "date-fns";

type Holiday = {
  date: Date;
  name: string;
};

function easterDate(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getBrazilNationalHolidays(year: number): Holiday[] {
  const easter = easterDate(year);
  return [
    { date: new Date(year, 0, 1), name: "Confraternização Universal" },
    { date: addDays(easter, -48), name: "Carnaval" },
    { date: addDays(easter, -47), name: "Carnaval" },
    { date: addDays(easter, -2), name: "Sexta-feira Santa" },
    { date: addDays(easter, 60), name: "Corpus Christi" },
    { date: new Date(year, 3, 21), name: "Tiradentes" },
    { date: new Date(year, 4, 1), name: "Dia do Trabalho" },
    { date: new Date(year, 8, 7), name: "Independência do Brasil" },
    { date: new Date(year, 9, 12), name: "Nossa Senhora Aparecida" },
    { date: new Date(year, 10, 2), name: "Finados" },
    { date: new Date(year, 10, 15), name: "Proclamação da República" },
    { date: new Date(year, 10, 20), name: "Consciência Negra" },
    { date: new Date(year, 11, 25), name: "Natal" },
  ];
}

export function getBrazilHoliday(date: Date) {
  const key = format(date, "yyyy-MM-dd");
  return getBrazilNationalHolidays(date.getFullYear()).find((holiday) => format(holiday.date, "yyyy-MM-dd") === key) ?? null;
}

export function isBrazilNationalHoliday(date: Date) {
  return Boolean(getBrazilHoliday(date));
}
