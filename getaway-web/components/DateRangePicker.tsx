"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type DateRangePickerProps = {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  label?: string;
};

export default function DateRangePicker({
  value,
  onChange,
  label = "Depart — Return",
}: DateRangePickerProps) {
  return (
    <Popover>
      {/* Trigger — styled to match the FieldWrapper input style */}
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 w-full text-left transition-colors duration-200 cursor-pointer focus:outline-none"
        >
          <CalendarIcon
            size={13}
            style={{ color: "#b8b3ad", flexShrink: 0 }}
          />

          {/* Show formatted range if selected, otherwise show placeholder label */}
          {value?.from ? (
            <span className="text-[15px]" style={{ color: "#1a1714" }}>
              {format(value.from, "MMM d")}
              {value.to ? ` — ${format(value.to, "MMM d")}` : ""}
            </span>
          ) : (
            <span className="text-[15px] font-light" style={{ color: "#b8b3ad" }}>
              {label}
            </span>
          )}
        </button>
      </PopoverTrigger>

      {/* Calendar popover — styled to match the card aesthetic */}
      <PopoverContent
        className="w-auto p-0 rounded-2xl overflow-hidden"
        align="start"
        style={{
          background: "#fdfcf9",
          border: "1px solid rgba(26,23,20,0.08)",
          boxShadow: "0 8px 32px rgba(26,23,20,0.12)",
        }}
      >
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
          defaultMonth={value?.from}
          initialFocus
          // Style the selected range and today indicator with terracotta
          classNames={{
            day_selected: "bg-[#c4714a] text-white hover:bg-[#a85a38]",
            day_today: "font-bold text-[#c4714a]",
            day_range_middle: "bg-[rgba(196,113,74,0.12)] text-[#1a1714] rounded-none",
            day_range_start: "bg-[#c4714a] text-white rounded-l-full",
            day_range_end: "bg-[#c4714a] text-white rounded-r-full",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}