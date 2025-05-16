"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  selectedDate: Date; //선택한 날짜
  onSelectDate: (date: Date) => void;
}

function CalendarDemo({ selectedDate, onSelectDate }: Props) {
  return (
    <div className="w-[20rem] h-[19rem] bg-white flex justify-center items-center rounded-md border shadow">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          if (date) onSelectDate(date);
        }}
      />
    </div>
  );
}

export default CalendarDemo;
