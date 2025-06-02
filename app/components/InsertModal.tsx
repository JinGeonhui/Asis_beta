"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface Modalprops {
  onClose: () => void;
  text?: string | null;
}

export function InsertModal({ onClose, text }: Modalprops) {
  const modalBackground = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const TitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy}.${mm}.${dd}`;

    const dto = {
      title: title,
      endDate: formattedDate,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/toDoList/insert`,
        dto,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        onClose();
        location.reload();
      }
    } catch (error) {
      console.error("TodoList 추가 중 오류:", error);
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
          location.reload();
        }
      }}
    >
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[4000]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-60"></div>
        </div>
      )}

      <div
        id="container"
        className="w-[37.5rem] h-[13.25rem] bg-white rounded-[0.75rem] flex flex-col items-center"
      >
        <div className="w-full mt-[1rem]">
          <p className="font-[pretendard] text-[1.5rem] font-bold pl-[1.4rem]">
            새로운 할 일을 추가해주세요.
          </p>
        </div>
        <input
          className="w-[94%] h-[3.5rem] focus:outline-none focus:ring-1 focus:ring-[#1570EF] bg-[#F2F4F7] pl-[0.94rem] mt-[0.81rem] font-[pretendard] text-[0.8125rem] text-black rounded-[0.375rem] placeholder:text-[#CECED2]"
          placeholder="새로운 내용의 TDL을 적어주세요."
          value={title}
          onChange={TitleChange}
          disabled={loading}
        />
        <div className="w-[94%] flex justify-end mt-[2rem]">
          <Button onClick={handleSubmit} disabled={loading}>
            추가하기
          </Button>
        </div>
      </div>
    </div>
  );
}
