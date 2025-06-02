"use client";

import React, { useEffect, useState } from "react";
import User from "../User";
import axios from "axios";

interface UserInfo {
  name: string;
  email: string;
}

interface GroupTeamUserListProps {
  onUserCountChange?: (count: number) => void;
}

function GroupTeamUserList({ onUserCountChange }: GroupTeamUserListProps) {
  const [userList, setUserList] = useState<UserInfo[]>([]);

  useEffect(() => {
    async function fetchUserList() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/group/toDoList/userlist`,
          {
            withCredentials: true,
            headers: {
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        setUserList(response.data);
        if (onUserCountChange) onUserCountChange(response.data.length);
      } 
      
      catch (error) {
        console.error("유저 목록 불러오기 실패:", error);
        setUserList([]);
        if (onUserCountChange) onUserCountChange(0);
      }
    }

    fetchUserList();
  }, [onUserCountChange]);

  return (
    <div className="w-[20rem] h-[32.6rem] bg-white rounded-md border shadow flex flex-col items-center">
      <div className="w-[86%] flex justify-between mt-[1rem]">
        <p className="font-[pretendard] text-[1.575rem] font-bold">현재 인원</p>
        <p className="font-[pretendard] text-[1.575rem] font-bold text-[#1570EF]">
          {userList.length}명
        </p>
      </div>

      <div className="w-[86%] flex flex-col gap-[1rem] mt-[1rem]">
        {userList.map((user, idx) => (
          <User key={idx} Name={user.name} Email={user.email} />
        ))}
      </div>
    </div>
  );
}

export default GroupTeamUserList;
