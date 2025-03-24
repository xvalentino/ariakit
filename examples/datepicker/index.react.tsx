"use client";

import * as Ariakit from "@ariakit/react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, setYear, setMonth } from "date-fns";
import { useState, useMemo } from "react";
import { MonthYearSelector } from "./components/MonthYearSelector.tsx";
import { CalendarGrid } from "./components/CalendarGrid.tsx";
import type { DateRange } from "./types.ts";
import { formatDateRange, parseDateInput } from "./utils.ts";
import "./style.css";

export default function Example() {
  const [dateRange, setDateRange] = useState<DateRange>([null, null]);
  const [startDate, endDate] = dateRange;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [isValid, setIsValid] = useState(true);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weeks = useMemo(() => {
    const weekDays: Date[][] = [];
    let currentWeek: Date[] = [];

    const firstDay = monthStart.getDay();
    const prevMonth = subMonths(monthStart, 1);
    const prevMonthEnd = endOfMonth(prevMonth);

    // Add empty cells for days before the first day of the month
    for (let i = firstDay - 1; i >= 0; i--) {
      currentWeek.push(new Date(prevMonthEnd.getFullYear(), prevMonthEnd.getMonth(), prevMonthEnd.getDate() - i));
    }

    // Add all days of the current month
    days.forEach(day => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weekDays.push(currentWeek);
        currentWeek = [];
      }
    });

    // Add empty cells for days after the last day of the month
    if (currentWeek.length > 0 && currentWeek.length < 7) {
      const remainingDays = 7 - currentWeek.length;
      const nextMonth = addMonths(monthStart, 1);
      for (let i = 0; i < remainingDays; i++) {
        currentWeek.push(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i + 1));
      }
      weekDays.push(currentWeek);
    }

    return weekDays;
  }, [days, monthStart]);

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setDateRange([date, null]);
      setStartInput(format(date, "yyyy-MM-dd"));
      setEndInput("");
    } else {
      if (date < startDate) {
        setDateRange([date, startDate]);
        setStartInput(format(date, "yyyy-MM-dd"));
        setEndInput(format(startDate, "yyyy-MM-dd"));
      } else {
        setDateRange([startDate, date]);
        setEndInput(format(date, "yyyy-MM-dd"));
      }
    }
  };

  const handleStartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartInput(value);
    const date = parseDateInput(value);
    setDateRange([date, endDate]);
    setIsValid(date !== null);
  };

  const handleEndInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndInput(value);
    const date = parseDateInput(value);
    setDateRange([startDate, date]);
    setIsValid(date !== null);
  };

  const handleMonthChange = (month: number) => {
    setCurrentDate(setMonth(currentDate, month));
  };

  const handleYearChange = (year: number) => {
    setCurrentDate(setYear(currentDate, year));
  };

  const formattedRange = useMemo(() => formatDateRange(dateRange), [dateRange]);

  return (
    <div className="wrapper">
      <Ariakit.SelectProvider>
        <Ariakit.SelectLabel className="label">
          Select Date Range
        </Ariakit.SelectLabel>
        <Ariakit.Select className="button">
          <div className="date-inputs">
            <input
              type="date"
              value={startInput}
              onChange={handleStartInputChange}
              className="date-input"
              aria-invalid={!isValid}
            />
            <input
              type="date"
              value={endInput}
              onChange={handleEndInputChange}
              className="date-input"
              aria-invalid={!isValid}
            />
            <div className="date-display">
              {formattedRange || "Select dates"}
            </div>
          </div>
        </Ariakit.Select>
        <Ariakit.SelectPopover gutter={4} sameWidth className="popover">
          <div className="calendar">
            <div className="calendar-header">
              <MonthYearSelector
                currentDate={currentDate}
                onMonthChange={handleMonthChange}
                onYearChange={handleYearChange}
              />
            </div>
            <CalendarGrid
              weeks={weeks}
              currentDate={currentDate}
              dateRange={dateRange}
              onDateClick={handleDateClick}
            />
          </div>
        </Ariakit.SelectPopover>
      </Ariakit.SelectProvider>
    </div>
  );
}
