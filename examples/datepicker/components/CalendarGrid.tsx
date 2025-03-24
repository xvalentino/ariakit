import * as Ariakit from "@ariakit/react";
import { format, isSameDay, isWithinInterval } from "date-fns";
import { WEEKDAYS } from "../constants.ts";
import type { CalendarGridProps } from "../types.ts";

export const CalendarGrid = ({
  weeks,
  currentDate,
  dateRange,
  onDateClick
}: CalendarGridProps) => {
  const [startDate, endDate] = dateRange;

  return (
    <Ariakit.CompositeProvider>
      <Ariakit.Composite className="calendar-grid">
        {WEEKDAYS.map((day) => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {weeks.map((week, weekIndex) => (
          <Ariakit.CompositeRow key={weekIndex} className="calendar-week">
            {week.map((day) => {
              const isSelected = startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate });
              const isStart = startDate && isSameDay(day, startDate);
              const isEnd = endDate && isSameDay(day, endDate);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();

              return (
                <Ariakit.CompositeItem
                  key={day.toString()}
                  className={`calendar-day ${isSelected ? "selected" : ""} ${isStart ? "start" : ""} ${isEnd ? "end" : ""} ${!isCurrentMonth ? "other-month" : ""}`}
                  onClick={() => onDateClick(day)}
                  data-weekday={format(day, "EEE")}
                >
                  {format(day, "d")}
                </Ariakit.CompositeItem>
              );
            })}
          </Ariakit.CompositeRow>
        ))}
      </Ariakit.Composite>
    </Ariakit.CompositeProvider>
  );
};
