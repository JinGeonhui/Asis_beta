"use client";

import React, { useState } from "react";

interface InputWithImageIconProps {
  iconSrc?: string;
  iconAlt?: string;
  iconPosition?: "left" | "right";
  iconAsButton?: boolean;
  iconSize?: string;
  onIconClick?: () => void;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
}

export function IconInput({
  iconSrc,
  iconAlt = "icon",
  iconPosition = "left",
  iconAsButton = false,
  iconSize = "20",
  onIconClick,
  placeholder = "",
  type = "text",
  value,
  onChange,
  onKeyDown,
  disabled,
  autoFocus,
  maxLength,
  minLength,
}: InputWithImageIconProps) {
  const [internalValue, setInternalValue] = useState("");

  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  const isLeft = iconPosition === "left";
  const iconPadding = isLeft ? "pl-10 pr-4" : "pl-4 pr-10";
  const iconPositionStyle = isLeft ? "left-3" : "right-5";

  const showIcon = iconSrc && inputValue.trim() !== "";

  return (
    <div className="relative w-full">
      <input
        type={type}
        value={inputValue}
        onChange={handleChange}
        className={`h-[52px] w-full ${iconPadding} rounded-[8px] bg-[#F2F4F7] pl-[1rem] font-[pretendard] text-[15px] font-medium focus:outline-none focus:ring-1 focus:ring-[#1570EF]`}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        disabled={disabled}
        autoFocus={autoFocus}
        maxLength={maxLength}
        minLength={minLength}
      />

      {showIcon &&
        (iconAsButton ? (
          <button
            type="button"
            onClick={onIconClick}
            className={`absolute top-1/2 ${iconPositionStyle} -translate-y-1/2`}
          >
            <img
              src={iconSrc}
              alt={iconAlt}
              className={`w-[${iconSize}px] h-[${iconSize}px]`}
            />
          </button>
        ) : (
          <div
            className={`absolute top-1/2 ${iconPositionStyle} pointer-events-none -translate-y-1/2`}
          >
            <img
              src={iconSrc}
              alt={iconAlt}
              className={`w-[${iconSize}px] h-[${iconSize}px]`}
            />
          </div>
        ))}
    </div>
  );
}
