export type DateRange = [Date | null, Date | null];

export type MonthYearSelectorProps = {
  currentDate: Date;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
};

export type CalendarGridProps = {
  weeks: Date[][];
  currentDate: Date;
  dateRange: DateRange;
  onDateClick: (date: Date) => void;
};
