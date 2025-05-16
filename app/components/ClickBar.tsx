'use client'

import React from "react";

interface ClickBarProps {
  text: string; //표실할 Text값
  className?: string;
  selected: boolean; //선택이 됬는지 안됬는지
  completed: boolean; //완료 상태인지 아닌지
  onClick: () => void;
  group: boolean; // 그룹용인지 여부
  progress?: string; // 각 TDL 완수율 예: "2/3" (단체 TDL에서만 사용)
  disabled?: boolean; // TodoList를 과거의 날짜를 받아오면 수정이 불가능하게 하기 위한 설정
}

export function ClickBar({
  text,
  className = "",
  onClick,
  completed,
  group,
  progress,
}: ClickBarProps) {
  const progressColor = completed ? "#fff" : "#1570EF";

  return (
    <div className="relative w-full" onClick={onClick}>
      <div
        className={`
          w-full h-[56px] flex rounded-[8px] items-center px-4 cursor-pointer justify-between
          ${completed ? "bg-[#1570EF] text-white" : "bg-[#F2F4F7] text-[#101828]"}
          ${className}
        `}
      >
        <span>{text}</span>
        {group && progress && (
          <p
            style={{
              color: progressColor,
              fontFamily: "Pretendard",
              fontSize: "0.99413rem",
              fontWeight: 700,
              margin: 0
            }}
          >
            {progress}
          </p>
        )}
      </div>
    </div>
  );
}
