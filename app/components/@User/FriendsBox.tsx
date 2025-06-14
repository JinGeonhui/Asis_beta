"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// FriendCard 컴포넌트
function FriendCard({
  name,
  code,
  type,
}: {
  name: string;
  code: string;
  type: "friend" | "sent" | "received";
}) {
  const bgColor =
    type === "friend"
      ? "bg-blue-100 text-blue-900"
      : type === "sent"
        ? "bg-purple-100 text-purple-900"
        : "bg-green-100 text-green-900";

  return (
    <div
      className={`min-w-[17rem] h-[9rem] rounded-md flex flex-col justify-between p-4 flex-shrink-0 shadow-lg ${bgColor}`}
    >
      <div className="text-xl font-bold">{name}</div>
      <div className="text-sm">
        <p>ID: {code}</p>
      </div>
    </div>
  );
}

// 전체 사용자 친구 카드
function UserFriendCard() {
  const [friends, setFriends] = useState([
    { name: "친구1", code: "id001" },
    { name: "친구2", code: "id002" },
  ]);

  const [sentRequests, setSentRequests] = useState([
    { name: "보낸요청1", code: "id101" },
  ]);

  const [receivedRequests, setReceivedRequests] = useState([
    { name: "받은요청1", code: "id201" },
  ]);

  const [newRequest, setNewRequest] = useState({ name: "", code: "" });

  const handleSendRequest = () => {
    if (newRequest.name && newRequest.code) {
      setSentRequests((prev) => [...prev, newRequest]);
      setNewRequest({ name: "", code: "" });
    }
  };

  return (
    <div className="w-[95%] bg-white mt-5 rounded-xl p-6 flex flex-col gap-6 shadow-md font-[pretendard] mb-8">
      <div className="flex justify-between items-center">
        <p className="font-bold text-2xl">친구 목록</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button>친구 추가하기</Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col gap-4">
            <p className="font-semibold text-lg">친구 추가</p>
            <Input
              placeholder="이름"
              value={newRequest.name}
              onChange={(e) =>
                setNewRequest({ ...newRequest, name: e.target.value })
              }
            />
            <Input
              placeholder="고유 ID"
              value={newRequest.code}
              onChange={(e) =>
                setNewRequest({ ...newRequest, code: e.target.value })
              }
            />
            <Button onClick={handleSendRequest}>추가</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* 친구 목록 */}
      <div>
        <p className="text-lg font-semibold mb-2">친구</p>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {friends.map((f, i) => (
            <FriendCard key={i} name={f.name} code={f.code} type="friend" />
          ))}
        </div>
      </div>

      {/* 보낸 요청 */}
      <div>
        <p className="text-lg font-semibold mb-2">보낸 친구 요청</p>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {sentRequests.map((f, i) => (
            <FriendCard key={i} name={f.name} code={f.code} type="sent" />
          ))}
        </div>
      </div>

      {/* 받은 요청 */}
      <div>
        <p className="text-lg font-semibold mb-2">받은 친구 요청</p>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {receivedRequests.map((f, i) => (
            <FriendCard key={i} name={f.name} code={f.code} type="received" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserFriendCard;
