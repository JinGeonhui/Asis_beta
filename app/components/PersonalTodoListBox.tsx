"use client";

import React, { useState, useEffect } from "react";
import { ClickBar } from "./ClickBar";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { InsertModal } from "./InsertModal";
import { PersonalDeleteMoadl, PersonalEditMoadl } from "./PersonalModals";

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

  useEffect(() => {
    const fetchTodolist = async () => {
      try {
        if (isToday(selectedDate)) {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/toDoList/get`,
            {
              headers: {
                "ngrok-skip-browser-warning": "69420",
              },
              withCredentials: true,
            },
          );
          setTodolist(res.data);
        } else {
          const formatted = formatDate(selectedDate);
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/calendar/private`,
            {
              headers: {
                "ngrok-skip-browser-warning": "69420",
              },
              params: { date: formatted },
              withCredentials: true,
            },
          );
          setTodolist(res.data.tdl || []);
        }
      } catch (err) {
        console.error("Error fetching todolist:", err);
        setTodolist([]);
      }
    };
    fetchTodolist();
  }, [selectedDate]);

  useEffect(() => {
    setIsReadOnly(!isToday(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    if (!isToday(selectedDate)) {
      setFilteredList(todolist);
    } else {
      const formatted = formatDate(selectedDate);
      setFilteredList(todolist.filter((t) => t.startDate === formatted));
    }
  }, [todolist, selectedDate]);

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
            "ngrok-skip-browser-warning": "69420",
          },
          withCredentials: true,
        },
      );
    } catch (err) {
      console.error("완료 상태 업데이트 실패:", err);
    }
  };

  const completedCount = filteredList.filter((t) => t.completed).length;

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

      {/* flex-1로 RangeSection의 세로 공간을 꽉 채우도록 하고, 내부 리스트에만 스크롤이 생기게 함 */}
      <div className="w-[66.5%] bg-white rounded-lg flex flex-col items-center border shadow flex-1 min-h-0">
        {/* 헤더 */}
        <div className="w-[90%] flex flex-row justify-between mt-6 mb-4 flex-shrink-0">
          <div className="flex flex-col">
            <span className="text-[1.875rem] font-bold">
              {formatDate(selectedDate)}
            </span>
            <span className="text-sm font-semibold text-[#A0A4AA]">
              {getDayName(selectedDate)}
            </span>
          </div>
          <span className="text-[1.875rem] font-bold">
            {completedCount}/{filteredList.length}
          </span>
        </div>

        {/* 리스트 스크롤 영역: flex-1, min-h-0, overflow-y-auto로 내부만 스크롤 */}
        <div className="w-[90%] flex-1 min-h-0 overflow-y-auto pr-2 pb-4">
          {Object.keys(grouped).length === 0 ? (
            <p className="text-gray-400">할 일이 없습니다.</p>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-6">
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

        {/* 버튼 영역 */}
        <div className="w-[90%] py-4 flex justify-end gap-3 flex-shrink-0">
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
