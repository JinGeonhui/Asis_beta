"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { SettingPage } from "../../templates/SettingPage";
import { ClickStrokeBar } from "../../components/ClickStrokeBar";
import { DateMoadl } from "@/app/components/DateModal";

export function GroupDate() {
  const [tdls, setTdls] = useState<string[]>([]);
  const [selectedTdl, setSelectedTdl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const token = window.localStorage.getItem("accessToken");
  const router = useRouter();

  const email = "s23054@gsm.hs.kr";

  function ModalClick() {
    setModalOpen(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/group/toDoList/get`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
            withCredentials: true,
          },
        );
        console.log(response.data); // 서버가 보내준 데이터 확인

        const titles = response.data.getSups.map((item: any) => item.title);
        setTdls(titles); // 🔥 title만 추출해서 저장
      } catch (error) {
        console.error("ID 불러오기 실패", error);
      }
    };

    fetchData();
  }, []);

  return (
    <SettingPage>
      {modalOpen && selectedTdl && (
        <DateMoadl onClose={() => setModalOpen(false)} text={selectedTdl} />
      )}

      <div className="w-full h-screen flex flex-col items-center">
        <div className="w-full flex-1 overflow-y-scroll overflow-x-hidden scrollbar-hide pb-[300px] flex flex-col items-center">
          <div className="w-[703px] relative top-[150px] font-[pretendard] flex flex-col items-start">
            <p className="font-bold text-[30px]">기간제 TDL로 변경해주세요</p>

            <div className="w-full flex flex-col gap-[22px] relative top-[31px]">
              {tdls.length > 0 && (
                <div className="flex flex-col gap-[14px] w-full">
                  <p className="font-medium">기간제 설정할 TDL을 눌러주세요</p>
                  <div className="flex flex-col gap-[13px]">
                    {tdls.map((tdlItem, index) => (
                      <ClickStrokeBar
                        key={index}
                        text={tdlItem}
                        selected={selectedTdl === tdlItem}
                        onClick={() => setSelectedTdl(tdlItem)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-[703px] flex flex-col items-end relative top-[246px]">
            <button
              className="w-[100px] h-[41px] font-[pretendard] font-semibold text-[18px] bg-[#1570EF] text-white rounded-[8px]"
              onClick={ModalClick}
            >
              설정하기
            </button>
          </div>
        </div>
      </div>
    </SettingPage>
  );
}
