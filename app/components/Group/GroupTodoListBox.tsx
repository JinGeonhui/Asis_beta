"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ClickBar } from "../ClickBar";
import { Button } from "@/components/ui/button";
import { GroupInsertModal } from "./GroupInsertModal";
import { EditMoadl } from "../EditModal";
import { DeleteMoadl } from "../DeleteModal";
import { InviteModal } from "../InviteModal";
import { useRouter } from "next/navigation";

interface TodoList {
  title: string;
  category: string;
  completed?: boolean;
  tdlID: number;
  groupNumber?: number;
  ownerCode?: string;
  part?: number;
  all?: number;
}

interface OptimisticState {
  completed: boolean;
  part: number;
}

interface Props {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  userCount: number;
}

function formatDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function getDayName(date: Date) {
  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  return days[date.getDay()];
}

function isToday(date: Date) {
  const now = new Date();
  return (
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate()
  );
}

function GroupTodoListBox({ selectedDate, onSelectDate, userCount }: Props) {
  const [todolist, setTodolist] = useState<TodoList[]>([]);
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedTdl, setSelectedTdl] = useState<TodoList | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [groupNumber, setGroupNumber] = useState<number | null>(null);
  const [ownerName, setOwnerName] = useState<string>(""); // 방장 이름
  const [optimisticMap, setOptimisticMap] = useState<
    Record<number, OptimisticState>
  >({});
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setToken(accessToken);
  }, []);
  const router = useRouter();

  // AI EXPO용 테스터 이름 고정
  const myName = "진건희";

  // 할 일 리스트 가져오는 API
  const fetchTodolist = async () => {
    try {
      if (isToday(selectedDate)) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/group/toDoList/get`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          },
        );

        const ownerCode = response.data.ownerCode;
        setOwnerName(response.data.ownerName); // 방장 이름 저장
        const sups = response.data.getSups || [];
        const mapped = sups.map((item: any) => ({
          title: item.title,
          category: item.category,
          completed: item.completed ?? false,
          tdlID: item.tdlID,
          groupNumber: item.groupNumber,
          ownerCode: ownerCode,
          part: item.part,
        }));
        setTodolist(mapped);

        if (sups.length > 0) setGroupNumber(sups[0].groupNumber);
      } else {
        const formattedDate = formatDate(selectedDate);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/calendar/group`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
            params: { date: formattedDate },
          },
        );

        setOwnerName("");
        const tdlArr = (response.data.tdl || []).map((item: any) => ({
          title: item.title,
          category: item.category,
          completed: item.completed ?? false,
          tdlID: item.tdlID,
          groupNumber: item.groupNumber,
          ownerCode: item.ownerCode,
          part: item.part,
        }));
        setTodolist(tdlArr);
        if (tdlArr.length > 0) setGroupNumber(tdlArr[0].groupNumber);
      }
    } catch (error) {
      console.error("에러 발생(fetchTodolist):", error);
      setTodolist([]);
      setOwnerName("");
    }
  };

  // 날짜 데이터가 입력될 시 TDL 가져오는 API 다시 불러오기
  useEffect(() => {
    fetchTodolist();
  }, [selectedDate]);

  // 서버 push(WebSocket 등)로 todolist가 오면 setTodolist로 동기화 + 낙관적 상태 초기화
  useEffect(() => {
    // 실제 WebSocket 연결 및 구독 코드를 넣으세요!
    // 예시:
    // socket.onmessage = (msg) => {
    //   setTodolist(msg.data);
    //   setOptimisticMap({}); // push 오면 낙관적 상태 초기화
    // };
  }, []);

  // 클릭 핸들러: UI에만 낙관적 상태 반영, 서버에는 PUT 요청
  const handleToggleTdl = async (item: TodoList) => {
    setSelectedTdl(item);

    // 1) 낙관적 상태로만 UI 즉시 반영
    setOptimisticMap((prev) => {
      const optimistic = prev[item.tdlID];
      let newCompleted = optimistic ? !optimistic.completed : !item.completed;
      let newPart = optimistic ? optimistic.part : (item.part ?? 0);
      if (!optimistic) {
        newPart = !item.completed ? newPart + 1 : newPart - 1;
      } else {
        newPart = newCompleted ? newPart + 1 : newPart - 1;
      }
      if (newPart < 0) newPart = 0;
      if (newPart > userCount) newPart = userCount;
      return {
        ...prev,
        [item.tdlID]: {
          completed: newCompleted,
          part: newPart,
        },
      };
    });

    // 2) 서버에는 기존대로 PUT 요청
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/group/toDoList/success`,
        {
          title: item.title,
          completed: !item.completed,
          ownerID: item.ownerCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
          },
        },
      );
      // 서버 push가 오면 setTodolist로 동기화 + 낙관적 상태 초기화
    } catch (err) {
      // 실패 시 낙관적 상태 롤백
      setOptimisticMap((prev) => {
        const newMap = { ...prev };
        delete newMap[item.tdlID];
        return newMap;
      });
      console.error("완료 상태 업데이트 실패:", err);
    }
  };

  // "보이는" 리스트: todolist + optimisticMap
  const visibleList: TodoList[] = todolist.map((tdl) => {
    const opt = optimisticMap[tdl.tdlID];
    if (!opt) return tdl;
    return {
      ...tdl,
      completed: opt.completed,
      part: opt.part,
    };
  });

  // 카테고리별로 그룹화 (visibleList 기준)
  const grouped = visibleList.reduce(
    (acc, tdl) => {
      const cat = tdl.category || "기타";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(tdl);
      return acc;
    },
    {} as Record<string, TodoList[]>,
  );

  const handleInvite = async (userCodes: string[]) => {
    if (!groupNumber) {
      alert("그룹 번호를 찾을 수 없습니다.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/group/toDoList/invite`,
        {
          groupID: groupNumber,
          receivers: userCodes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
          },
        },
      );
      alert("초대가 완료되었습니다!");
    } catch (error) {
      alert("초대 실패");
      console.error(error);
    }
  };

  // 방장 여부
  const isOwner = myName && ownerName && myName === ownerName;

  return (
    <>
      {inviteModalOpen && (
        <InviteModal
          onClose={() => setInviteModalOpen(false)}
          onInvite={handleInvite}
          myEmail={
            typeof window !== "undefined"
              ? window.localStorage.getItem("email") || ""
              : ""
          }
        />
      )}

      {insertModalOpen && (
        <GroupInsertModal onClose={() => setInsertModalOpen(false)} />
      )}

      {editModalOpen && selectedTdl && (
        <EditMoadl onClose={() => setEditModalOpen(false)} tdl={selectedTdl} />
      )}
      {deleteModalOpen && selectedTdl && (
        <DeleteMoadl
          onClose={() => setDeleteModalOpen(false)}
          tdl={selectedTdl}
        />
      )}

      <div className="w-[59.8125rem] h-[53.5625rem] bg-white rounded-lg flex flex-col items-center border shadow relative overflow-hidden">
        <div
          id="TopDetail"
          className="w-[94%] relative flex flex-row justify-between mt-[1rem]"
        >
          <div id="Date" className="flex flex-row gap-[0.37rem]">
            <p className="font-[pretendard] text-[1.875rem] font-bold">
              {formatDate(selectedDate)}
            </p>
            <p className="font-[pretendard] text-[0.9375rem] font-bold text-[#DBDEE3] mt-[0.8rem]">
              {getDayName(selectedDate)}
            </p>
          </div>
          <p className="font-[pretendard] text-[1.875rem] font-bold">
            {visibleList.filter((t) => t.completed).length}/{visibleList.length}
          </p>
        </div>

        <div
          id="TodoListContainer"
          className="w-[90%] h-[38.5rem] mt-[1.2rem] flex flex-col gap-[0.8rem] overflow-x-hidden scrollbar-hide overflow-y-scroll"
        >
          {Object.keys(grouped).length === 0 ? (
            <p className="text-gray-400">할 일이 없습니다.</p>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} style={{ marginBottom: "1.5rem" }}>
                <div className="font-bold text-lg mb-2"># {category}</div>
                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <ClickBar
                      key={item.tdlID}
                      text={item.title}
                      selected={selectedTdl?.tdlID === item.tdlID}
                      completed={item.completed ?? false}
                      onClick={() => handleToggleTdl(item)}
                      group={true}
                      progress={`${item.part ?? 0}/${userCount}`}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 방장에게만 버튼 노출 */}
        {isOwner && (
          <div className="w-[94%] flex flex-row justify-end absolute bottom-4 gap-[1rem]">
            <Button onClick={() => setInsertModalOpen(true)}>추가하기</Button>
            <Button
              onClick={() => setEditModalOpen(true)}
              disabled={!selectedTdl}
            >
              수정하기
            </Button>
            <Button
              onClick={() => setDeleteModalOpen(true)}
              disabled={!selectedTdl}
            >
              삭제하기
            </Button>
            <Button onClick={() => setInviteModalOpen(true)}>초대하기</Button>
          </div>
        )}
      </div>
    </>
  );
}

export default GroupTodoListBox;
