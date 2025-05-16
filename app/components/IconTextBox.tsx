import React from "react";

interface IconTextBoxProps {
  iconSrc?: string;
  iconAlt?: string;
  iconSize?: number;
  iconPosition?: "left" | "right";
  iconAsButton?: boolean;
  onIconClick?: () => void;
  text?: string;
  className?: string;
}

export function IconTextBox({
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
  const iconPadding = isLeft ? "pl-10 pr-4" : "pl-4 pr-6";
  const iconPositionStyle = isLeft ? "left-3" : "right-3.5";

  return (
    <div className="relative w-full">
      <div
        className={`w-full h-[56px] ${iconPadding} py-2 rounded-[8px] bg-[#F2F4F7] text-[#101828] flex items-center ${className}`}
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
            <img src={iconSrc} alt={iconAlt} className={`w-[${iconSize}px] h-[${iconSize}px]`} />
          </button>
        ) : (
          <div
            className={`absolute top-1/2 ${iconPositionStyle} -translate-y-1/2 pointer-events-none`}
          >
            <img src={iconSrc} alt={iconAlt} className={`w-[${iconSize}px] h-[${iconSize}px]`} />
          </div>
        )
      )}
    </div>
  );
}
