"use client";

import React, { useState } from "react";
import SideBar from "../components/sidebar";
import DashbordHeader from "../components/DashbordHeader";
import CalendarDemo from "../components/CalednarDemo";
import PersonalTodoListBox from "../components/PersonalTodoListBox";

function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="w-full h-screen flex flex-row">
      {" "}
      {/* h-screen으로 전체 높이 고정 */}
      <div id="LeftSection" className="w-[20%] h-screen flex flex-col">
        {" "}
        {/* h-screen 추가 */}
        <SideBar />
      </div>
      {/* RangeSection에만 overflow-y-auto, h-screen, flex-col */}
      <div
        id="RangeSection"
        className="w-[80%] h-screen flex flex-col overflow-y-auto"
      >
        <div id="Header" className="pl-10 mt-[2rem] flex-shrink-0">
          <DashbordHeader />
        </div>

        <div className="mt-[1.5rem] w-full pl-10 flex flex-row flex-1">
          <PersonalTodoListBox
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          <div id="MiddleContainer" className="flex flex-col w-[24rem] pl-[3%]">
            <CalendarDemo
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
