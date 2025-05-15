"use client";

import React, { useState } from "react";

function SideBar() {
  const [selected, setSelected] = useState("dashboard");

  const menus = [
    {
      id: "dashboard",
      icon: "homeNotIcon.svg",
      label: "대시보드",
    },
    {
      id: "profile",
      icon: "userNotIcon.svg",
      label: "프로필",
    },
    {
      id: "certificate",
      icon: "bookNotIcon.svg",
      label: "자격증 정보",
    },
  ];

  return (
    <div className="w-[285px] h-[905px] bg-white flex justify-start flex-col items-center gap-5 py-4">
      <div className="w-[228px] h-[61px] flex flex-row gap-[10px] items-center p-1">
        <img src="LogoIcon.svg" className="w-[45px] h-[45px]" />
        <img src="LogoTextIcon.svg" className="w-[61px] h-[61px]" />
      </div>

      <div className="w-full flex flex-col items-center gap-3">
        {menus.map((menu) => {
          const isSelected = selected === menu.id;
          const iconSrc = isSelected ? menu.icon.replace("Not", "") : menu.icon;

          return (
            <div
              key={menu.id}
              onClick={() => setSelected(menu.id)}
              className={`w-[80%] h-[50px] flex flex-row justify-start items-center gap-[15px] rounded-[10px] px-4 cursor-pointer ${
                isSelected ? "bg-[#F0F3F9]" : "bg-white"
              }`}
            >
              <img src={iconSrc} className="w-[21px] h-[21px]" />
              <p
                className={`font-[Pretendard] font-semibold text-lg ${
                  isSelected ? "text-[#2A3B5F]" : "text-[#9DA3AD]"
                }`}
              >
                {menu.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SideBar;
