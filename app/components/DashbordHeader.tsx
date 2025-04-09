"use client";

import React, { useEffect, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

function DashbordHeader() {
  const [currentTime, setCurrentTime] = useState(Temporal.Now.plainTimeISO());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Temporal.Now.plainTimeISO());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.hour;
  const minute = currentTime.minute;
  const ampm = hour < 12 ? "오전" : "오후";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = String(minute).padStart(2, "0");
  const formattedTime = `${ampm} ${displayHour} : ${displayMinute}`;

  const endOfDay = Temporal.PlainTime.from("23:59:59");
  const remaining = endOfDay.since(currentTime);
  const remainingTime = `오늘 하루까지 ${remaining.hours}시간 ${remaining.minutes}분 남았어요!`;

  return (
    <div className="w-[1290px] h-[212px] bg-white rounded-2xl relative overflow-hidden">
      <div className="absolute right-[425px] -top-1/2 w-[80%] h-[160%] bg-[#1570EF] -rotate-45" />

      <div className="relative z-10 text-white flex flex-col justify-center items-start h-full pl-[150px]">
        <h2 className="text-[45px] font-bold font-[pretendard] relative top-2 left-7">
          {formattedTime}
        </h2>
        <p className="text-[18px] mt-4 font-[pretendard] font-semibold relative top-8 right-10">
          {remainingTime}
        </p>
      </div>

      <div className="absolute right-6 bottom-6 flex items-end gap-4 z-0">
        <div className="w-24 h-24 bg-[#1570EF] rounded-full translate-y-1/2 relative top-7 left-[80px]" />
        <div className="w-24 h-40 bg-[#1570EF] rounded-t-full relative top-12 left-[95px]" />
        <div className="w-[100px] h-[100px] bg-[#1570EF] rounded-full relative top-[-140px] left-[155px]" />
        <div className="flex flex-col items-center justify-between gap-2 ml-6">
          <div className="w-4 h-4 bg-[#1570EF] rounded-full relative left-1 top-3" />
          <div className="w-[25px] h-[25px] bg-[#1570EF] rounded-full relative right-10 top-[-7px]" />
          <div className="w-[53px] h-[53px] bg-[#1570EF] rounded-full relative top-[-4px] left-[10px]" />
        </div>
      </div>
    </div>
  );
}

export default DashbordHeader;
