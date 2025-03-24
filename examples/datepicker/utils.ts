import { format, parseISO } from "date-fns";
import type { DateRange } from "./types.ts";

export const formatDateRange = (dateRange: DateRange): string => {
  const [startDate, endDate] = dateRange;
  if (!startDate && !endDate) return "";
  if (!endDate) return format(startDate!, "MMM d, yyyy");
  return `${format(startDate!, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
};

export const parseDateInput = (value: string): Date | null => {
  if (!value) return null;
  try {
    return parseISO(value);
  } catch {
    return null;
  }
};
