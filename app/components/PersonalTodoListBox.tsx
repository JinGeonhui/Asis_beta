"use client";

import React, { useState, useEffect } from "react";
import { ClickBar } from "./ClickBar";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { InsertModal } from "./InsertModal";
import { PersonalDeleteMoadl } from "./PersonalEditModal";
import { PersonalEditMoadl } from "./PersonalEditModal";

interface TodoList {
  title: string;
  category: string;
  startDate: string;
  completed: boolean;
}

interface Props {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

function isToday(date: Date) {
  const now = new Date();
  return (
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate()
  );
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

function PersonalTodoListBox({ selectedDate, onSelectDate }: Props) {
  const [todolist, setTodolist] = useState<TodoList[]>([]);
  const [filteredList, setFilteredList] = useState<TodoList[]>([]);
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTdl, setSelectedTdl] = useState<string | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

    const [token, setToken] = useState<string | null>(null);
  
    useEffect(() => {
      const accessToken = localStorage.getItem("accessToken");
      setToken(accessToken);
    }, []);

  // TDL 불러오기
  useEffect(() => {
    const fetchTodolist = async () => {
      try {
        if (isToday(selectedDate)) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/toDoList/get`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "69420",
              },
            },
          );
          setTodolist(response.data);
        } else {
          const formattedDate = formatDate(selectedDate);
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/calendar/private`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "69420",
              },
              params: { date: formattedDate },
            },
          );
          setTodolist(response.data.tdl || []);
        }
      } catch (error) {
        console.error("Error fetching todolist:", error);
        setTodolist([]);
      }
    };
    fetchTodolist();
  }, [selectedDate]);

  useEffect(() => {
    setIsReadOnly(!isToday(selectedDate));
  }, [selectedDate]);

  // 날짜별로 필터링
  useEffect(() => {
    if (!isToday(selectedDate)) {
      setFilteredList(todolist);
    } else {
      const formattedDate = formatDate(selectedDate);
      setFilteredList(
        todolist.filter((tdl) => tdl.startDate === formattedDate),
      );
    }
  }, [todolist, selectedDate]);

  // TDL 선택 + 완료/미완료 토글
  const handleClickBar = async (title: string) => {
    if (isReadOnly) return;

    setSelectedTdl(title);

    const target = todolist.find((t) => t.title === title);
    if (!target) return;

    const updatedList = todolist.map((tdl) =>
      tdl.title === title ? { ...tdl, completed: !tdl.completed } : tdl,
    );
    setTodolist(updatedList);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/toDoList/success`,
        {
          title: target.title,
          completed: !target.completed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        },
      );
    } catch (err) {
      console.error("완료 상태 업데이트 실패:", err);
    }
  };

  const completedCount = filteredList.filter((t) => t.completed).length;

  // 카테고리별로 그룹화
  const grouped = filteredList.reduce(
    (acc, tdl) => {
      if (!acc[tdl.category]) acc[tdl.category] = [];
      acc[tdl.category].push(tdl);
      return acc;
    },
    {} as Record<string, TodoList[]>,
  );

  return (
    <>
      {insertModalOpen && (
        <InsertModal onClose={() => setInsertModalOpen(false)} />
      )}

      {editModalOpen && selectedTdl && (
        <PersonalEditMoadl
          onClose={() => setEditModalOpen(false)}
          text={selectedTdl}
        />
      )}

      {deleteModalOpen && selectedTdl && (
        <PersonalDeleteMoadl
          onClose={() => setDeleteModalOpen(false)}
          text={selectedTdl}
        />
      )}

      <div className="w-[58rem] h-[38.125rem] bg-white rounded-lg flex flex-col items-center border shadow relative overflow-hidden">
        <div className="w-[90%] relative flex flex-row justify-between mt-[1rem]">
          <div className="flex flex-row gap-[0.37rem]">
            <p className="font-[pretendard] text-[1.875rem] font-bold">
              {formatDate(selectedDate)}
            </p>
            <p className="font-[pretendard] text-[0.9375rem] font-bold text-[#DBDEE3] mt-[0.8rem]">
              {getDayName(selectedDate)}
            </p>
          </div>
          <p className="font-[pretendard] text-[1.875rem] font-bold">
            {completedCount}/{filteredList.length}
          </p>
        </div>

        <div
          className="w-[90%] h-[28.5rem] mt-[1.2rem] flex flex-col gap-[0.8rem] overflow-y-auto"
          style={{ maxHeight: "30rem" }}
        >
          {Object.keys(grouped).length === 0 ? (
            <p className="text-gray-400">할 일이 없습니다.</p>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} style={{ marginBottom: "1.5rem" }}>
                <div className="font-bold text-lg mb-2"># {category}</div>
                <div className="flex flex-col gap-2">
                  {items.map((item, index) => (
                    <ClickBar
                      key={item.title + index}
                      text={item.title}
                      selected={selectedTdl === item.title}
                      completed={item.completed}
                      onClick={() => handleClickBar(item.title)}
                      group={false}
                      disabled={isReadOnly}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="w-[90%] flex flex-row justify-end absolute bottom-4 gap-[1rem]">
          <Button
            onClick={() => setInsertModalOpen(true)}
            disabled={isReadOnly}
          >
            추가하기
          </Button>
          <Button
            onClick={() => setEditModalOpen(true)}
            disabled={!selectedTdl || isReadOnly}
          >
            수정하기
          </Button>
          <Button
            onClick={() => setDeleteModalOpen(true)}
            disabled={!selectedTdl || isReadOnly}
          >
            삭제하기
          </Button>
        </div>
      </div>
    </>
  );
}

export default PersonalTodoListBox;
