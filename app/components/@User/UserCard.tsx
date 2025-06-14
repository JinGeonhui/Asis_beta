"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import useUserStore from "../../store/userStore";

function UserCard() {
  const { user } = useUserStore();

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
          <p className="text-5xl text-[#1570EF]">28%</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button>비밀번호 변경</Button>
        <Button>로그아웃</Button>
      </div>
    </div>
  );
}

export default UserCard;
