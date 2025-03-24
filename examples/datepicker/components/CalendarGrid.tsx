import * as Ariakit from "@ariakit/react";
import { format, isSameDay, isWithinInterval } from "date-fns";
import { WEEKDAYS } from "../constants.ts";
import type { CalendarGridProps } from "../types.ts";
import { useState } from "react";

export const CalendarGrid = ({
  weeks,
  currentDate,
  dateRange,
  onDateClick
}: CalendarGridProps) => {
  const [startDate, endDate] = dateRange;
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const getPreviewRange = (day: Date) => {
    if (!startDate || (startDate && endDate)) return null;
    if (day < startDate) {
      return { start: day, end: startDate };
    }
    return { start: startDate, end: day };
  };

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

              const previewRange = hoveredDate ? getPreviewRange(hoveredDate) : null;
              const isPreview = previewRange && isWithinInterval(day, previewRange);

              return (
                <Ariakit.CompositeItem
                  key={day.toString()}
                  className={`calendar-day ${isSelected ? "selected" : ""} ${isStart ? "start" : ""} ${isEnd ? "end" : ""} ${isPreview ? "preview" : ""} ${!isCurrentMonth ? "other-month" : ""}`}
                  onClick={() => onDateClick(day)}
                  onMouseEnter={() => setHoveredDate(day)}
                  onMouseLeave={() => setHoveredDate(null)}
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
