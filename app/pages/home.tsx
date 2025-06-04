"use client";

import React, { useState } from "react";
import SideBar from "../components/sidebar";
import DashbordHeader from "../components/DashbordHeader";
import CalendarDemo from "../components/CalednarDemo";
import PersonalTodoListBox from "../components/PersonalTodoListBox";

function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="flex flex-row">
      <SideBar />
      
      <div id="RangeSection" className="w-full flex flex-col">
        <div id="Header" className="pl-10 mt-[2rem]">
          <DashbordHeader />
        </div>

        <div className="mt-[1.5rem] w-full pl-10 flex flex-row">
          <PersonalTodoListBox
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          <div
            id="MiddleContainer"
            className="flex flex-col w-[24rem] pl-[3%]"
          >
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
