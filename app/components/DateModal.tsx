"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Modalprops {
  onClose: () => void;
  text?: string | null;
}

export function DateMoadl({ onClose, text }: Modalprops) {
  const modalBackground = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    setToken(access_token);
  }, []);
  const router = useRouter();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const dto = {
      title: text,
      change: value,
    };

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/group/toDoList/modify`,
      dto,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );

    try {
      if (response.status === 200) {
        router.push("/");
      }
    } catch {
      console.error();
    }
  };

  return (
    <div
      id="back"
      className="fixed w-full h-full top-0 left-0 bg-[#3A3D4350] flex items-center justify-center z-[3000]"
      ref={modalBackground}
      onClick={(e) => {
        if (e.target === modalBackground.current) {
          onClose();
        }
      }}
    >
      <div
        id="container"
        className="w-[37.5rem] h-[22.25rem] bg-white rounded-[0.75rem]"
      >
        <p className="font-[pretendard] font-bold text-[24px] mt-[1.75rem] ml-[3rem]">
          해당 TDL의 내용을 수정하시겠습니까?
        </p>
        <div className="flex flex-col items-center">
          <div className="w-[31.8125rem] h-[11.25rem] border-[1.5px] border-[#1570EF] rounded-[0.375rem] flex flex-col font-[pretendard] mt-[1.94rem]">
            <p className="ml-[1.5rem] mt-[0.61rem] text-[0.9375rem]">
              선택된 TDL
            </p>
            <div className="w-[28.75rem] h-[2.48806rem] mt-[0.81rem] ml-auto mr-auto flex flex-col justify-center pl-[1.11rem] bg-[#F2F4F7] rounded-[0.35544rem]">
              {text}
            </div>

            <div className="w-[28.75rem] h-[2.1875rem] flex flex-row relative justify-between ml-auto mr-auto mt-[0.8rem]">
              <div className="font-[pretendard] w-[11.92919rem] h-full">
                <p>시작 날짜</p>
                <input
                  className="font-[pretendard] w-full h-full border-[1.5px] rounded-[0.37281rem] border-[#1570EF] pl-[0.5rem] placeholder:text-[#CECED2]"
                  placeholder="YYYY.MM.DD"
                />
              </div>

              <div className="font-[pretendard] w-[11.92919rem] h-full">
                <p>최종 날짜</p>
                <input
                  className="font-[pretendard] w-full h-full border-[1.5px] rounded-[0.37281rem] border-[#1570EF] pl-[0.5rem] placeholder:text-[#CECED2]"
                  placeholder="YYYY.MM.DD"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-[31.8125rem] flex flex-row items-end justify-end gap-[0.5rem] ml-auto mr-auto mt-[1.44rem]">
          <button
            className="w-[4.6875rem] h-[2.10131rem] rounded-[0.48494rem] bg-[#F2F2F3] font-[pretendard] font-bold"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="w-[4.6875rem] h-[2.10131rem] rounded-[0.48494rem] text-white bg-[#1570EF] font-[pretendard] font-bold"
            onClick={handleSubmit}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
