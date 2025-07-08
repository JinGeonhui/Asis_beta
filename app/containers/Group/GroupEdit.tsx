"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

import { SettingPage } from "../templates";
import { ClickStrokeBar } from "@/app/components";
import { EditMoadl, TodoList } from "@/app/components/@Group/GroupModals";

export default function GroupEdit() {
  const [tdls, setTdls] = useState<TodoList[]>([]);
  const [selectedTdl, setSelectedTdl] = useState<TodoList | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/api/group/toDoList/get`,
          {
            headers: {
              "ngrok-skip-browser-warning": "69420",
            },
            withCredentials: true,
          },
        );
        // 객체 전체를 저장!
        const todoListArr: TodoList[] = response.data.getSups.map(
          (item: any) => ({
            tdlID: item.tdlID,
            title: item.title,
            category: item.category,
            completed: item.completed,
            groupNumber: item.groupNumber,
          }),
        );
        setTdls(todoListArr);
      } catch (error) {
        console.error("ID 불러오기 실패", error);
      }
    };

    fetchData();
  }, []);

  function ModalClick() {
    setModalOpen(true);
  }

  return (
    <SettingPage>
      {modalOpen && selectedTdl && (
        <EditMoadl onClose={() => setModalOpen(false)} tdl={selectedTdl} />
      )}

      <div className="w-full h-screen flex flex-col items-center">
        <div className="w-full flex-1 overflow-y-scroll overflow-x-hidden scrollbar-hide pb-[300px] flex flex-col items-center">
          <div className="w-[56%] relative top-[34%] font-[pretendard] flex flex-col items-start">
            <p className="font-bold text-[30px]">수정할 TDL을 선택해주세요</p>

            <div className="w-full flex flex-col gap-[22px] relative top-[14%]">
              {tdls.length > 0 && (
                <div className="flex flex-col gap-[14px] w-full">
                  <p className="font-medium">수정할 TDL 목록</p>
                  <div className="flex flex-col gap-[13px]">
                    {tdls.map((tdlItem) => (
                      <ClickStrokeBar
                        key={tdlItem.tdlID}
                        text={tdlItem.title}
                        selected={selectedTdl?.tdlID === tdlItem.tdlID}
                        onClick={() => setSelectedTdl(tdlItem)}
                        focusColor="#1570EF"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-[56%] flex flex-col items-end relative top-[50%]">
            <button
              className="w-[100px] h-[41px] font-[pretendard] font-semibold text-[18px] bg-[#1570EF] text-white rounded-[8px]"
              onClick={ModalClick}
              disabled={!selectedTdl}
            >
              수정하기
            </button>
          </div>
        </div>
      </div>
    </SettingPage>
  );
}
