"use client";

import React, { useState, useRef } from "react";
import axios from "axios";

function getToday() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

interface ModalProps {
  onClose: () => void;
  text?: string | null;
}

export function PersonalEditMoadl({ onClose, text }: ModalProps) {
  const modalBackground = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!text || !value) return;

    const todayStr = getToday();

    const dto = {
      title: text,
      change: value,
      endDate: todayStr,
      changeDate: todayStr,
    };

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/api/toDoList/modify`,
        dto,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      if (response.status == 200) {
        onClose();
        location.reload();
      }
    } catch (error) {
      console.error("수정 실패", error);
    } finally {
      setLoading(false);
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
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[4000]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-60"></div>
        </div>
      )}

      <div className="w-[37.5rem] h-[20.25rem] bg-white rounded-[0.75rem]">
        <p className="font-[pretendard] font-bold text-[24px] mt-[1.75rem] ml-[3rem]">
          해당 TDL의 내용을 수정하시겠습니까?
        </p>
        <div className="flex flex-col items-center">
          <div className="w-[31.8125rem] h-[6.25rem] border-[1.5px] border-[#1570EF] rounded-[0.375rem] flex flex-col font-[pretendard] mt-[1.94rem]">
            <p className="ml-[1.5rem] mt-[0.61rem] text-[0.9375rem]">
              선택된 TDL
            </p>
            <div className="w-[28.75rem] h-[2.48806rem] mt-[0.81rem] ml-auto mr-auto flex flex-col justify-center pl-[1.11rem] bg-[#F2F4F7] rounded-[0.35544rem]">
              {text}
            </div>
          </div>
          <input
            className="w-[31.8125rem] h-[2.1875rem] focus:outline-none focus:ring-1 focus:ring-[#1570EF] bg-[#F2F4F7] pl-[0.94rem] mt-[0.81rem] font-[pretendard] text-[0.8125rem] text-black rounded-[0.375rem] placeholder:text-[#CECED2]"
            placeholder="새로운 내용의 TDL을 적어주세요."
            value={value}
            onChange={onChange}
          />
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

export function PersonalDeleteMoadl({ onClose, text }: ModalProps) {
  const modalBackground = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("access_token");

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const todayStr = getToday();
    const dto = {
      title: text,
      endDate: todayStr,
    };

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/api/toDoList/delete`,
        {
          data: dto,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        onClose();
        location.reload();
      }
    } catch (error) {
      console.error("삭제 중 오류:", error);
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
        className="w-[37.5rem] h-[18.25rem] bg-white rounded-[0.75rem]"
      >
        <p className="font-[pretendard] font-bold text-[24px] mt-[1.75rem] ml-[3rem]">
          해당 TDL의 내용을 제거하시겠습니까?
        </p>
        <div className="flex flex-col items-center">
          <div className="w-[31.8125rem] h-[6.25rem] border-[1.5px] border-[#D23B3B] rounded-[0.375rem] flex flex-col font-[pretendard] mt-[1.94rem]">
            <p className="ml-[1.5rem] mt-[0.61rem] text-[0.9375rem]">
              선택된 TDL
            </p>
            <div className="w-[28.75rem] h-[2.48806rem] mt-[0.81rem] ml-auto mr-auto flex flex-col justify-center pl-[1.11rem] bg-[#F2F4F7] rounded-[0.35544rem]">
              {text}
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
            className="w-[4.6875rem] h-[2.10131rem] rounded-[0.48494rem] text-white bg-[#D23B3B] font-[pretendard] font-bold"
            onClick={handleSubmit}
          >
            제거
          </button>
        </div>
      </div>
    </div>
  );
}
