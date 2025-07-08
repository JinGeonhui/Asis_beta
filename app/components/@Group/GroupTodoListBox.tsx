"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClickBar } from "../ClickBar";
import { Button } from "@/components/ui/button";
import { GroupInsertModal } from "./GroupInsertModal";
import { EditMoadl } from "./GroupModals";
import { DeleteMoadl } from "./GroupModals";
import { InviteModal } from "../InviteModal";
import { useRouter } from "next/navigation";
import { useSSE } from "@/hooks/useSSE";
import { useUserStore } from "@/app/store/userStore";

export interface TodoList {
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
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
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
  const [ownerName, setOwnerName] = useState<string>("");
  const [optimisticMap, setOptimisticMap] = useState<Record<number, OptimisticState>>({});
  const [isReadOnly, setIsReadOnly] = useState(false);
  const router = useRouter();
  const { user } = useUserStore();
  const groupNumber = user?.groupNumberId ?? null;

  useEffect(() => {
    setIsReadOnly(!isToday(selectedDate));
  }, [selectedDate]);

  const myName = "진건희";

  const fetchTodolist = async () => {
    if (!groupNumber) return;
    if (isToday(selectedDate)) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/group/toDoList/get`,
          {
            headers: { "ngrok-skip-browser-warning": "69420" },
            withCredentials: true,
          }
        );
        const ownerCode = response.data.ownerCode;
        setOwnerName(response.data.ownerName);
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
      } catch (error) {
        console.error("에러(오늘)", error);
        setTodolist([]);
        setOwnerName("");
      }
      return;
    }

    try {
      const formattedDate = formatDate(selectedDate);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/calendar/group`,
        {
          headers: { "ngrok-skip-browser-warning": "69420" },
          params: { date: formattedDate },
          withCredentials: true,
        }
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
    } catch (error) {
      console.error("에러(과거)", error);
      setTodolist([]);
      setOwnerName("");
    }
  };

  useEffect(() => {
    fetchTodolist();
  }, [selectedDate, groupNumber]);

  const baseSSEUrl = `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/sse/group`;

  useSSE({
    url: `${baseSSEUrl}?groupNum=${groupNumber}`,
    event: "group",
    onMessage: () => fetchTodolist(),
    onError: (err) => console.error("SSE 오류(group):", err),
  });

  useSSE({
    url: `${baseSSEUrl}?groupNum=${groupNumber}`,
    event: "group-detail",
    onMessage: () => fetchTodolist(),
    onError: (err) => console.error("SSE 오류(group-detail):", err),
  });

  useSSE({
    url: `${baseSSEUrl}?groupNum=${groupNumber}`,
    event: "group-delete",
    onMessage: () => fetchTodolist(),
    onError: (err) => console.error("SSE 오류(group-delete):", err),
  });

  const handleToggleTdl = async (item: TodoList) => {
    if (isReadOnly) return;
    setSelectedTdl(item);
    setOptimisticMap((prev) => {
      const optimistic = prev[item.tdlID];
      let newCompleted = optimistic ? !optimistic.completed : !item.completed;
      let newPart = optimistic ? optimistic.part : (item.part ?? 0);
      newPart = newCompleted ? newPart + 1 : newPart - 1;
      newPart = Math.max(0, Math.min(newPart, userCount));
      return {
        ...prev,
        [item.tdlID]: { completed: newCompleted, part: newPart },
      };
    });

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
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
    } catch (err) {
      setOptimisticMap((prev) => {
        const newMap = { ...prev };
        delete newMap[item.tdlID];
        return newMap;
      });
      console.error("완료 상태 업데이트 실패:", err);
    }
  };

  const visibleList = todolist.map((tdl) => {
    const opt = optimisticMap[tdl.tdlID];
    return opt ? { ...tdl, completed: opt.completed, part: opt.part } : tdl;
  });

  const grouped = visibleList.reduce((acc, tdl) => {
    const cat = tdl.category || "기타";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tdl);
    return acc;
  }, {} as Record<string, TodoList[]>);

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
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      alert("초대가 완료되었습니다!");
    } catch (error) {
      alert("초대 실패");
      console.error(error);
    }
  };

  const isOwner = myName && ownerName && myName === ownerName;

  return (
    <>
      {inviteModalOpen && (
        <InviteModal
          userCode={`${user?.email}`}
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
      <div className="w-[70%] h-[100%] bg-white rounded-lg flex flex-col items-center border shadow relative overflow-hidden">
        <div className="w-[94%] relative flex flex-row justify-between mt-[1rem]">
          <div className="flex flex-row gap-[0.37rem]">
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
        <div className="w-[90%] h-[38.5rem] mt-[1.2rem] flex flex-col gap-[0.8rem] overflow-x-hidden scrollbar-hide overflow-y-scroll">
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
        {isOwner && (
          <div className="w-[94%] flex flex-row justify-end absolute bottom-4 gap-[1rem]">
            <Button onClick={() => setInsertModalOpen(true)}>추가하기</Button>
            <Button onClick={() => router.push("/Group/Edit")}>수정하기</Button>
            <Button onClick={() => router.push("/Group/Delete")}>삭제하기</Button>
            <Button onClick={() => setInviteModalOpen(true)}>초대하기</Button>
          </div>
        )}
      </div>
    </>
  );
}

export default GroupTodoListBox;
