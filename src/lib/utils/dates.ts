import { format, parseISO, addMinutes, isBefore, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import type { TimeSlot } from "@/lib/types";

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "d 'de' MMMM 'de' yyyy", { locale: es });
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
}

export function generateTimeSlots(start: string, end: string, duration: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const base = new Date(2000, 0, 1);
  let current = new Date(base.setHours(sh, sm, 0, 0));
  const endTime = new Date(2000, 0, 1, eh, em, 0, 0);
  while (isBefore(current, endTime)) {
    const next = addMinutes(current, duration);
    if (isAfter(next, endTime)) break;
    slots.push({ start_time: format(current, "HH:mm"), end_time: format(next, "HH:mm"), available: true });
    current = next;
  }
  return slots;
}

export function overlaps(
  a: { start_time: string; end_time: string },
  b: { start_time: string; end_time: string }
): boolean {
  return a.start_time < b.end_time && a.end_time > b.start_time;
}
