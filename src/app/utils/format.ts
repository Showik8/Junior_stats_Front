/**
 * Shared date/time formatting utilities for the public pages.
 * All use "ka-GE" locale for Georgian formatting.
 */

/** "25 ნოემბერი" — day + month */
export function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ka-GE", {
    day: "numeric",
    month: "long",
  });
}

/** "ორშაბათი, 25 ნოემბერი 2024" — full date with weekday */
export function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ka-GE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "14:30" — time only */
export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("ka-GE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Check if two dates are the same day */
export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
