"use client";

import * as React from "react";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useState } from "react";

interface DatePickerProps {
  startYear?: number;
  endYear?: number;
  selectedDate: Date; // The current selected date from the parent
  onDateChange: (newDate: Date) => void; // Callback to notify the parent of the change
}

export function DatePicker({
  startYear = getYear(new Date()) - 90,
  endYear = getYear(new Date()) - 18,
  selectedDate,
  onDateChange,
}: DatePickerProps) {
  const [localdate, setDate] = React.useState<Date>(selectedDate);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  );

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(localdate, months.indexOf(month));
    setDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(localdate, Number.parseInt(year));
    setDate(newDate);
  };

  const handleSelect = (selectedData: Date | undefined) => {
    if (selectedData) {
      setDate(selectedData);
      onDateChange(selectedData);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[250px] justify-start text-left font-normal",
            !localdate && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {localdate ? format(localdate, "dd-MMM-yyyy") : <span>Birthday</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex justify-between p-2">
          <Select
            onValueChange={handleMonthChange}
            value={months[getMonth(localdate)]}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="May" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleYearChange}
            value={getYear(localdate).toString()}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="2000" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          selected={localdate}
          onSelect={handleSelect}
          initialFocus
          month={localdate}
          onMonthChange={setDate}
        />
      </PopoverContent>
    </Popover>
  );
}
