"use client";

import React, { useState } from "react";
import axios from "axios";
import { useUserStore } from "../store/userStore";

interface InviteModalProps {
  onClose: () => void;
  onInvite: (userCodes: string[]) => Promise<void>;
}

interface UserSearchResult {
  userCode: string;
  name: string;
  email: string;
}

export function InviteModal({ onClose }: InviteModalProps) {
  const [friendName, setFriendName] = useState("");
  const [friendCodes, setFriendCodes] = useState<string[]>([]);
  const [searchResult, setSearchResult] = useState<UserSearchResult[]>([]);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);

  const { user } = useUserStore();
  const groupNumber = user?.groupNumberId;

  const handleSearch = async () => {
    if (!friendName.trim()) {
      alert("친구 이름을 입력해주세요.");
      return;
    }

    setIsSearchTriggered(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/group/toDoList/find`,
        { friend: friendName.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          withCredentials: true,
        },
      );

      const users = Array.isArray(response.data) ? response.data : [];
      setSearchResult(users);
    } catch (error) {
      console.error("친구 검색 실패", error);
      alert("친구 검색 중 오류가 발생했습니다.");
      setSearchResult([]);
    }
  };

  const handleSelectFriend = (friendCode: string) => {
    setFriendCodes((prev) =>
      prev.includes(friendCode) ? prev : [...prev, friendCode],
    );
  };

  // 🔧 수정된 handleInvite 함수
  const handleInvite = async () => {
    if (!groupNumber) {
      alert("그룹 번호를 찾을 수 없습니다.");
      return;
    }
    if (friendCodes.length === 0) {
      alert("초대할 친구를 선택해주세요.");
      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/group/toDoList/invite`,
        {
          groupID: groupNumber,
          receivers: friendCodes,
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      alert("초대가 완료되었습니다!");
      onClose();
    } catch (error) {
      alert("초대 실패");
      console.error(error);
    }
  };

  return (
    <div className="fixed w-full h-full top-0 left-0 bg-[#3A3D4350] flex items-center justify-center z-[3000] font-[pretendard]">
      <div className="w-[30rem] h-[14rem] bg-white rounded-lg p-6 relative">
        <h2 className="text-xl font-bold mb-4">친구 초대</h2>
        <div className="flex gap-2 mb-2">
          <input
            className="border px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-[#1570EF] rounded-md text-[14px]"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            placeholder="초대할 친구 이름"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button
            className="bg-[#1570EF] text-white px-3 py-1 rounded"
            onClick={handleSearch}
          >
            검색
          </button>
        </div>
        <div>
          {isSearchTriggered && searchResult.length === 0 && (
            <p className="text-gray-500 text-sm">검색 결과가 없습니다.</p>
          )}
          {searchResult.map((user) => (
            <div key={user.userCode} className="flex items-center gap-2 my-1">
              <div className="px-2 py-1 rounded bg-[#F2F2F3] text-[14px]">
                <span>
                  {user.name} ({user.email})
                </span>
              </div>
              <button
                className="bg-[#1570EF] text-white px-2 py-1 rounded text-[14px]"
                onClick={() => handleSelectFriend(user.userCode)}
                disabled={friendCodes.includes(user.userCode)}
              >
                {friendCodes.includes(user.userCode) ? "선택됨" : "초대"}
              </button>
            </div>
          ))}
        </div>
        <div className="absolute bottom-3 mt-[3rem] flex gap-2 w-[90%] justify-end">
          <button className="bg-[#F2F2F3] px-4 py-2 rounded" onClick={onClose}>
            취소
          </button>
          <button
            className="bg-[#1570EF] text-white px-4 py-2 rounded"
            onClick={handleInvite} // 🔧 수정된 부분: 직접 실행함
          >
            초대하기
          </button>
        </div>
      </div>
    </div>
  );
}
