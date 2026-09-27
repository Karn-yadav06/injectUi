"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date) => void;
}

export function DatePicker({ label, value = new Date(), onChange }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(value);
  const [isOpen, setIsOpen] = useState(false);

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const monthName = selectedDate.toLocaleString("default", { month: "long" });

  const handleSelectDay = (day: number) => {
    const nextDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(nextDate);
    onChange?.(nextDate);
    setIsOpen(false);
  };

  const daysCount = daysInMonth(currentMonth, currentYear);
  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

  return (
    <div className="relative w-full max-w-xs text-left">
      {label && <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 text-sm hover:border-slate-600 transition-colors"
      >
        <span className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-indigo-400" />
          {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 z-30 w-64 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3 text-sm font-semibold text-white">
            <span>{monthName} {currentYear}</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setSelectedDate(new Date(currentYear, currentMonth - 1, 1))}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate(new Date(currentYear, currentMonth + 1, 1))}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d} className="text-slate-500 font-semibold py-1">{d}</span>
            ))}
            {daysArray.map((day) => {
              const isSelected = day === selectedDate.getDate();
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleSelectDay(day)}
                  className={`py-1.5 rounded text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-indigo-600 text-white font-bold"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
