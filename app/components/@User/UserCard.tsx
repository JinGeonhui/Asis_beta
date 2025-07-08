"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/app/store/userStore";
import { usePasswordModalStore } from "@/app/store/usePassword";
import axios from "axios";

function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}

const handleLogout = () => {
  deleteCookie("access_token");
  deleteCookie("refresh_token");
  window.localStorage.clear();
  window.location.href = "/Signin";
};

function UserCard() {
  const { user } = useUserStore();
  const { openModal } = usePasswordModalStore();
  const [todoRate, setTodoRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchTodoRate = async () => {
      if (!user) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/api/calendar/private/month`,
          {
            headers: {
              "ngrok-skip-browser-warning": "69420",
            },
            withCredentials: true,
          },
        );

        const { part, every } = res.data;
        if (
          typeof part === "number" &&
          typeof every === "number" &&
          every !== 0
        ) {
          const rate = Math.round((part / every) * 100);
          setTodoRate(rate);
        } else {
          setTodoRate(null);
        }
      } catch (error) {
        console.error(error);
        setTodoRate(null);
      }
    };

    fetchTodoRate();
  }, [user]);

  if (!user) {
    return <div className="text-center mt-10">유저 정보를 불러오는 중...</div>;
  }

  return (
    <div className="w-[95%] bg-white mt-5 rounded-xl p-6 flex flex-col justify-between min-h-[200px] shadow-md font-[pretendard]">
      <div className="flex flex-row gap-[4rem]">
        <div className="flex flex-col gap-1.5">
          <p className="font-bold text-2xl">{user.name}</p>
          <p className="font-medium text-sm text-gray-400">{user.email}</p>
          <p className="font-medium text-sm text-gray-400">
            ID: {user.userCode}
          </p>
          <p className="font-regular text-sm text-[#1570EF]">프로필 공개</p>
        </div>

        <div className="flex flex-col gap-[1rem] font-bold">
          <p className="text-2xl">Todo 성공률</p>
          <p className="text-5xl text-[#1570EF]">
            {todoRate !== null ? `${todoRate}%` : "-"}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button onClick={openModal}>비밀번호 변경</Button>
        <Button onClick={handleLogout}>로그아웃</Button>
      </div>
    </div>
  );
}

export default UserCard;
