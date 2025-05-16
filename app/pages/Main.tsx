'use client'

import React, { useState } from "react";
import SideBar from "../components/SideBar";
import GroupTodoListBox from "@/app/components/Group/GroupTodoListBox";
import CalendarDemo from "../components/CalednarDemo";
import GroupTeamUserList from "@/app/components/Group/GroupTeamUserList";

function Main(){
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [userCount, setUserCount] = useState(0); // 현재 인원 상태 추가

    return(
        <div className="flex flex-row">
            <SideBar />
            <div id="RangeSection" className="w-full flex flex-col">
                <div className="mt-[1.5rem] w-full pl-10 flex flex-row">
                    <GroupTodoListBox selectedDate={selectedDate} onSelectDate={setSelectedDate} userCount={userCount} />
                    <div id="MiddleContainer" className="flex flex-col w-[24rem] gap-[2rem] pl-12">
                        <CalendarDemo selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                        <GroupTeamUserList onUserCountChange={setUserCount} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main
