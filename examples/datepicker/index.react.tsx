"use client";

import * as Ariakit from "@ariakit/react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, addMonths, subMonths, getYear, getMonth, setYear, setMonth, parseISO } from "date-fns";
import { useState, useMemo } from "react";
import "./style.css";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS = Array.from({ length: 10 }, (_, i) => getYear(new Date()) - 5 + i);

export default function Example() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [isValid, setIsValid] = useState(true);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group days into weeks, ensuring each week starts on Sunday
  const weeks = useMemo(() => {
    const weekDays: Date[][] = [];
    let currentWeek: Date[] = [];

    // Add empty cells for days before the first Sunday
    const firstDay = monthStart.getDay();
    const prevMonth = subMonths(monthStart, 1);
    const prevMonthEnd = endOfMonth(prevMonth);
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

    // Add empty cells for days after the last Saturday
    if (currentWeek.length > 0 && currentWeek.length < 7) {
      const remainingDays = 7 - currentWeek.length;
      const nextMonth = addMonths(monthEnd, 1);
      for (let i = 0; i < remainingDays; i++) {
        currentWeek.push(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i + 1));
      }
      weekDays.push(currentWeek);
    }

    return weekDays;
  }, [days, monthStart, monthEnd]);

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
    if (value) {
      try {
        const date = parseISO(value);
        setDateRange([date, endDate]);
        setIsValid(true);
      } catch {
        setIsValid(false);
      }
    } else {
      setDateRange([null, endDate]);
      setIsValid(true);
    }
  };

  const handleEndInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndInput(value);
    if (value) {
      try {
        const date = parseISO(value);
        setDateRange([startDate, date]);
        setIsValid(true);
      } catch {
        setIsValid(false);
      }
    } else {
      setDateRange([startDate, null]);
      setIsValid(true);
    }
  };

  const handleMonthChange = (month: number) => {
    setCurrentDate(setMonth(currentDate, month));
  };

  const handleYearChange = (year: number) => {
    setCurrentDate(setYear(currentDate, year));
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const formattedRange = useMemo(() => {
    if (!startDate && !endDate) return "";
    if (!endDate) return format(startDate!, "MMM d, yyyy");
    return `${format(startDate!, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
  }, [startDate, endDate]);

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
              <div className="calendar-navigation">
                <button onClick={handlePrevMonth} className="nav-button">
                  ←
                </button>
                <Ariakit.SelectProvider defaultValue={getMonth(currentDate).toString()}>
                  <Ariakit.Select className="month-select">
                    {MONTHS[getMonth(currentDate)]}
                  </Ariakit.Select>
                  <Ariakit.SelectPopover gutter={4} sameWidth className="month-popover">
                    {MONTHS.map((month, index) => (
                      <Ariakit.SelectItem
                        key={month}
                        value={index.toString()}
                        className="month-item"
                        onClick={() => handleMonthChange(index)}
                      >
                        {month}
                      </Ariakit.SelectItem>
                    ))}
                  </Ariakit.SelectPopover>
                </Ariakit.SelectProvider>
                <Ariakit.SelectProvider defaultValue={getYear(currentDate).toString()}>
                  <Ariakit.Select className="year-select">
                    {getYear(currentDate)}
                  </Ariakit.Select>
                  <Ariakit.SelectPopover gutter={4} sameWidth className="year-popover">
                    {YEARS.map((year) => (
                      <Ariakit.SelectItem
                        key={year}
                        value={year.toString()}
                        className="year-item"
                        onClick={() => handleYearChange(year)}
                      >
                        {year}
                      </Ariakit.SelectItem>
                    ))}
                  </Ariakit.SelectPopover>
                </Ariakit.SelectProvider>
                <button onClick={handleNextMonth} className="nav-button">
                  →
                </button>
              </div>
            </div>
            <Ariakit.CompositeProvider>
              <Ariakit.Composite className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
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
                          onClick={() => handleDateClick(day)}
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
          </div>
        </Ariakit.SelectPopover>
      </Ariakit.SelectProvider>
    </div>
  );
}
