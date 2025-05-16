"use client";

import React, { useState, useRef, useEffect } from "react";
import { Client as StompClient } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface InviteModalProps {
  onClose: () => void;
  onInvite: (userCodes: string[]) => void;
  myEmail: string | null | undefined;
}

const WS_URL = `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/ws`;

export function InviteModal({ onClose, onInvite, myEmail }: InviteModalProps) {
  const [friendName, setFriendName] = useState("");
  const [userCodes, setUserCodes] = useState<string[]>([]);
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const clientRef = useRef<StompClient | null>(null);

  // AI EXPO용 이메일 적용
  const safeEmail = myEmail && myEmail.trim() ? myEmail : "s23054@gsm.hs.kr";

  useEffect(() => {
    const socket = new SockJS(WS_URL);
    const client = new StompClient({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/group/create/${safeEmail}`, (message) => {
          const data = JSON.parse(message.body);
          setSearchResult(Array.isArray(data) ? data : [data]);
        });
      },
    });
    client.activate();
    clientRef.current = client;
    return () => {
      client.deactivate();
    };
  }, [safeEmail]);

  // 친구 이름 검색 및 userCode 획득
  const handleSearch = () => {
    if (!friendName.trim()) return;
    clientRef.current?.publish({
      destination: "/app/group/friends",
      body: JSON.stringify({
        email: safeEmail,
        friend: friendName,
      }),
      headers: { "content-type": "application/json" },
    });
  };

  const handleSelectUser = (userCode: string) => {
    setUserCodes((prev) =>
      prev.includes(userCode) ? prev : [...prev, userCode],
    );
  };

  const handleInvite = () => {
    if (userCodes.length === 0) return;
    onInvite(userCodes);
    onClose();
    location.reload();
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
          />
          <button
            className="bg-[#1570EF] text-white px-3 py-1 rounded"
            onClick={handleSearch}
          >
            검색
          </button>
        </div>
        <div>
          {searchResult.map((user) => (
            <div
              key={user.userCode}
              className="flex items-center gap-2 my-1 font-[pretendard] "
            >
              <div className="px-2 py-1 rounded bg-[#F2F2F3] text-[14px]">
                <span>
                  {user.name} ({user.email})
                </span>
              </div>
              <button
                className="bg-[#1570EF] text-white px-2 py-1 rounded text-[14px]"
                onClick={() => handleSelectUser(user.userCode)}
                disabled={userCodes.includes(user.userCode)}
              >
                {userCodes.includes(user.userCode) ? "선택됨" : "초대"}
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
            onClick={handleInvite}
          >
            초대하기
          </button>
        </div>
      </div>
    </div>
  );
}
