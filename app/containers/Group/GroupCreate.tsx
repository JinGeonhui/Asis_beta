"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SettingPage } from "../templates";
import { useUserStore } from "@/app/store/userStore";
import { IconInput, IconTextBox, ChoosedBox, TdlBox } from "@/app/components";
import { ICON } from "@/constants";

export default function GroupCreate() {
  const [userId, setUserId] = useState("");
  const [friendData, setFriendData] = useState<
    { name: string; email: string; userCode: string }[]
  >([]);
  const [selectedFriends, setSelectedFriends] = useState<typeof friendData>([]);
  const [inputValue, setInputValue] = useState("");
  const [tdls, setTdls] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const eventSourceRef = useRef<EventSource | null>(null);
  const router = useRouter();
  const { user } = useUserStore();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userId.trim() && user?.userCode) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const src = new EventSource(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/api/sse/group-invite?userCode=${user.userCode}`,
        { withCredentials: true },
      );

      src.addEventListener("friendList", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (Array.isArray(data) && data.length > 0) {
            setFriendData(data);
            setErrorMessage("");
          } else {
            setFriendData([]);
            setErrorMessage("검색된 유저가 없습니다.");
          }
        } catch (err) {
          console.error("SSE JSON 파싱 오류", err);
          setFriendData([]);
          setErrorMessage("친구 정보를 불러오는 중 오류 발생");
        }
      });

      src.addEventListener("error", (e) => {
        console.error("SSE 오류", e);
        setFriendData([]);
        setErrorMessage("검색 중 오류가 발생했습니다.");
      });

      src.addEventListener("ping", () => {});

      eventSourceRef.current = src;

      const dto = {
        friend: userId,
      };

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/api/group/toDoList/find`,
          dto,
          { withCredentials: true },
        );
      } catch (error) {
        console.error("친구 검색 트리거 실패", error);
      }
    }
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handleEnterTDL = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      setTdls((prev) => [...prev, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleAddFriend = (f: (typeof selectedFriends)[0]) => {
    if (!selectedFriends.some((fr) => fr.email === f.email)) {
      setSelectedFriends((prev) => [...prev, f]);
    }
  };

  const handleRemoveFriend = (email: string) => {
    setSelectedFriends((prev) => prev.filter((f) => f.email !== email));
  };

  const handleSubmit = async () => {
    const payload = {
      titles: tdls,
      receivers: selectedFriends.map((f) => f.userCode),
      category: "운동",
    };
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/api/group/toDoList/create`,
        payload,
        {
          headers: { "ngrok-skip-browser-warning": "69420" },
          withCredentials: true,
        },
      );
      if (res.status === 200) router.push("/");
    } catch (error) {
      console.error("단체 TDL 방 생성 실패", error);
    }
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <SettingPage>
      {!user ? (
        <div className="w-full h-screen flex items-center justify-center text-xl">
          유저 정보를 불러오는 중...
        </div>
      ) : (
        <div className="w-full h-screen flex flex-col items-center">
          <div className="w-full flex-1 overflow-y-scroll overflow-x-hidden scrollbar-hide pb-[300px] flex flex-col items-center">
            <div className="w-[703px] mt-32 font-[pretendard] flex flex-col items-start">
              <p className="font-bold text-[30px]">
                단체 TDL을 함께할 친구를 초대해주세요
              </p>
              <div className="w-full flex flex-col gap-[22px] mt-8">
                <div className="flex flex-col gap-[14px] w-full">
                  <p className="font-medium">검색</p>
                  <IconInput
                    iconSrc={`${ICON.SVG_ICON}/Search.svg`}
                    iconPosition="right"
                    placeholder="초대할 사람의 이름을 적고, Enter 키를 눌러주세요"
                    value={userId}
                    onChange={handleUserIdChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="flex flex-col gap-[14px] w-full">
                  <p className="font-medium">검색 결과</p>
                  {errorMessage ? (
                    <IconTextBox
                      iconSrc={`${ICON.SVG_ICON}/Plus.svg`}
                      iconPosition="right"
                      text={errorMessage}
                      iconAsButton={false}
                    />
                  ) : friendData.length > 0 ? (
                    friendData.map((friend, index) => (
                      <IconTextBox
                        key={`${friend.userCode}-${index}`}
                        iconSrc={`${ICON.SVG_ICON}/Plus.svg`}
                        iconPosition="right"
                        text={`${friend.name} (${friend.email})`}
                        iconAsButton={true}
                        onIconClick={() => handleAddFriend(friend)}
                      />
                    ))
                  ) : (
                    <IconTextBox
                      iconSrc={`${ICON.SVG_ICON}/Plus.svg`}
                      iconPosition="right"
                      text="검색된 유저가 없습니다."
                      iconAsButton={false}
                    />
                  )}
                </div>
                {selectedFriends.length > 0 && (
                  <div className="flex flex-col gap-[14px] w-full">
                    <p className="font-medium">현재 초대할 인원</p>
                    <div className="flex flex-col gap-[13px]">
                      {selectedFriends.map((friend, index) => (
                        <ChoosedBox
                          key={`${friend.email}-${index}`}
                          iconSrc={`${ICON.SVG_ICON}/BlueX.svg`}
                          iconPosition="right"
                          text={friend.name}
                          iconAsButton={true}
                          onIconClick={() => handleRemoveFriend(friend.email)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-[703px] mt-20 font-[pretendard] flex flex-col items-start gap-[14px]">
              <p className="font-bold text-[30px]">
                단체 TDL의 목표 TDL을 작성해주세요
              </p>
              <div className="w-full flex flex-col gap-[13px]">
                <p className="font-medium">
                  추가할 TDL을 작성하고 Enter키를 눌러주세요
                </p>
                <input
                  className="w-full h-[56px] pl-4 py-2 rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#1570EF] bg-[#F2F4F7] placeholder:color-[#95979D]"
                  placeholder="TDL을 적어주세요"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleEnterTDL}
                />
              </div>
              {tdls.length > 0 && (
                <div className="flex flex-col gap-[14px] w-full">
                  <p className="font-medium">현재 추가된 TDL</p>
                  <div className="flex flex-col gap-[13px]">
                    {tdls.map((tdlItem, index) => (
                      <TdlBox
                        key={index}
                        iconSrc={`${ICON.SVG_ICON}/GrayX.svg`}
                        iconPosition="right"
                        text={tdlItem}
                        iconAsButton={true}
                        onIconClick={() =>
                          setTdls((prev) => prev.filter((_, i) => i !== index))
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-[703px] flex flex-col items-end mt-10">
              <button
                className="w-[100px] h-[41px] font-[pretendard] font-semibold text-[18px] bg-[#1570EF] text-white rounded-[8px]"
                onClick={handleSubmit}
              >
                생성하기
              </button>
            </div>
          </div>
        </div>
      )}
    </SettingPage>
  );
}
