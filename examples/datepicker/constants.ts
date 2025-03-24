import { getYear } from "date-fns";

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
] as const;

export const YEARS = Array.from({ length: 10 }, (_, i) => getYear(new Date()) - 5 + i);

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
