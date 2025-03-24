import * as Ariakit from "@ariakit/react";
import { getMonth, getYear } from "date-fns";
import { MONTHS, YEARS } from "../constants.ts";
import type { MonthYearSelectorProps } from "../types.ts";

export const MonthYearSelector = ({
  currentDate,
  onMonthChange,
  onYearChange
}: MonthYearSelectorProps) => (
  <div className="calendar-navigation">
    <button onClick={() => onMonthChange(getMonth(currentDate) - 1)} className="nav-button">
      ←
    </button>
    <Ariakit.SelectProvider defaultValue={getMonth(currentDate).toString()}>
      <Ariakit.Select className="month-select">
        {MONTHS[getMonth(currentDate)]}
      </Ariakit.Select>
      <Ariakit.SelectPopover gutter={4} sameWidth className="month-popover">
        {MONTHS.map((month: string, index: number) => (
          <Ariakit.SelectItem
            key={month}
            value={index.toString()}
            className="month-item"
            onClick={() => onMonthChange(index)}
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
        {YEARS.map((year: number) => (
          <Ariakit.SelectItem
            key={year}
            value={year.toString()}
            className="year-item"
            onClick={() => onYearChange(year)}
          >
            {year}
          </Ariakit.SelectItem>
        ))}
      </Ariakit.SelectPopover>
    </Ariakit.SelectProvider>
    <button onClick={() => onMonthChange(getMonth(currentDate) + 1)} className="nav-button">
      →
    </button>
  </div>
);
