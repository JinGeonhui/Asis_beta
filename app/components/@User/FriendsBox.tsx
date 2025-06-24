"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/app/store/userStore";
import axios from "axios";

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

function UserFriendCard() {
  const [friends, setFriends] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [newCode, setNewCode] = useState("");
  const { user } = useUserStore();

  const postInitialFriendRequest = async () => {
    try {
      await axios.post("/friends", {}, { withCredentials: true });
    } catch (err) {
      console.error("초기 친구 요청 실패:", err);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/friends`, { withCredentials: true });
      setFriends(res.data);
    } catch (err) {
      console.error("친구 목록 조회 실패:", err);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/friends/requested/${user?.userCode}`,
        { withCredentials: true },
      );
      const sent = res.data.filter((req: any) => req.status === "PENDING");
      setSentRequests(sent);
    } catch (err) {
      console.error("보낸 요청 조회 실패:", err);
    }
  };

  const fetchReceivedRequests = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/friends/requests`,
        { withCredentials: true },
      );
      const received = res.data.filter((req: any) => req.status === "PENDING");
      setReceivedRequests(received);
    } catch (err) {
      console.error("받은 요청 조회 실패:", err);
    }
  };

  const handleSendRequest = async () => {
    if (!newCode) return;
    try {
      await axios.post(
        "/friends/request",
        { userCode: newCode },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
      await fetchSentRequests();
      setNewCode("");
    } catch (err) {
      console.error("친구 요청 실패:", err);
    }
  };

  useEffect(() => {
    postInitialFriendRequest();
    fetchFriends();
    fetchSentRequests();
    fetchReceivedRequests();
  }, []);

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
              placeholder="상대 고유 ID"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
            />
            <Button onClick={handleSendRequest}>추가</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <p className="text-lg font-semibold mb-2">친구</p>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {friends.map((f, i) => (
            <FriendCard key={i} name={f.name} code={f.userCode} type="friend" />
          ))}
        </div>
      </div>

      <div>
        <p className="text-lg font-semibold mb-2">보낸 친구 요청</p>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {sentRequests.map((f, i) => (
            <FriendCard key={i} name={f.name} code={f.userCode} type="sent" />
          ))}
        </div>
      </div>

      <div>
        <p className="text-lg font-semibold mb-2">받은 친구 요청</p>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {receivedRequests.map((f, i) => (
            <FriendCard
              key={i}
              name={f.senderName}
              code={f.senderUserCode}
              type="received"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserFriendCard;