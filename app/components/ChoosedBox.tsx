import React from "react";

interface IconTextBoxProps {
  iconSrc?: string; //아이콘 Src값
  iconAlt?: string; //아이콘 Alt값
  iconSize?: number; //아이콘 크기
  iconPosition?: "left" | "right"; //아이콘 배치 위치
  iconAsButton?: boolean; //아이콘 버튼 역할 유무
  onIconClick?: () => void; //아이콘 전용 onClick
  text?: string; //표시할 Text 값
  className?: string; //tailwind의 classname 스타일링을 위해 재선언
}

export function ChoosedBox({
  iconSrc,
  iconAlt = "icon",
  iconPosition = "left",
  iconAsButton = false,
  onIconClick,
  text = "",
  className = "",
  iconSize = 6,
}: IconTextBoxProps) {
  const isLeft = iconPosition === "left";
  const iconPadding = isLeft ? "pl-10 pr-4" : "pl-4 pr-10";
  const iconPositionStyle = isLeft ? "left-3" : "right-3.5";

  return (
    <div className="relative w-full">
      <div
        className={`w-full h-[56px] ${iconPadding} py-2 rounded-[8px] bg-[#E6F0FE] text-[#1570EF] flex items-center ${className}`}
      >
        {text}
      </div>
      {iconSrc && (
        iconAsButton ? (
          <button
            type="button"
            onClick={onIconClick}
            className={`absolute top-1/2 ${iconPositionStyle} -translate-y-1/2`}
          >
            <img src={"/BlueX.svg"} alt={iconAlt} className={`w-[${iconSize}px] h-[${iconSize}px]`} />
          </button>
        ) : (
          <div
            className={`absolute top-1/2 ${iconPositionStyle} -translate-y-1/2 pointer-events-none`}
          >
            <img src={"/BlueX.svg"} alt={iconAlt} className={`w-[${iconSize}px] h-[${iconSize}px]`} />
          </div>
        )
      )}
    </div>
  );
}
