"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ICON } from "../constants/route";
import axios from "axios";

export function SideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const menus = [
    {
      id: "user",
      icon: `${ICON.SVG_ICON}/homeNotIcon.svg`,
      label: "개인 대시보드",
    },
    {
      id: "users",
      icon: `${ICON.SVG_ICON}/userNotIcon.svg`,
      label: "단체 대시보드",
    },
    {
      id: "profile",
      icon: `${ICON.SVG_ICON}/userNotIcon.svg`,
      label: "프로필",
    },
  ];

  const getInitialSelected = () => {
    if (pathname.startsWith("/Group")) return "users";
    if (pathname === "/Profile") return "profile";
    if (pathname === "/") return "user";
    return "user";
  };

  const [selected, setSelected] = useState(getInitialSelected());

  useEffect(() => {
    if (pathname.startsWith("/Group")) {
      setSelected("users");
      window.localStorage.setItem("sidebarSelected", "users");
    } else if (pathname === "/") {
      setSelected("user");
      window.localStorage.setItem("sidebarSelected", "user");
    } else if (pathname === "/Profile") {
      setSelected("profile");
      window.localStorage.setItem("sidebarSelected", "profile");
    }
  }, [pathname]);

  const handleMenuClick = (menuId: string) => {
    setSelected(menuId);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("sidebarSelected", menuId);
    }
  };

  const handleGroupDashboardClick = async () => {
    handleMenuClick("users");
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/group/toDoList/isMember`,
        {
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
          withCredentials: true,
        },
      );
      if (response.data === true) {
        router.push("/Group/Main");
      } else {
        router.push("/Group/Create");
      }
    } catch (error) {
      router.push("/Group/Create");
    }
  };

  const handleUserDashboardClick = () => {
    handleMenuClick("user");
    router.push("/");
  };

  const handleProfileClick = () => {
    handleMenuClick("profile");
    router.push("/Profile");
  };

  return (
    <div className="w-[15rem] h-screen bg-white flex justify-start flex-col items-center gap-5 py-4">
      <div
        className="w-[228px] h-[61px] flex flex-row gap-[10px] items-center p-[5%]"
        onClick={() => router.push("/")}
      >
        <img
          src={`${ICON.SVG_ICON}/LogoIcon.svg`}
          className="w-[45px] h-[45px]"
        />
        <img
          src={`${ICON.SVG_ICON}/LogoTextIcon.svg`}
          className="w-[61px] h-[61px]"
        />
      </div>
      <div className="w-full flex flex-col items-center gap-3">
        {menus.map((menu) => {
          const isSelected = selected === menu.id;
          const iconSrc = isSelected ? menu.icon.replace("Not", "") : menu.icon;

          if (menu.id === "users") {
            return (
              <div
                key={menu.id}
                onClick={handleGroupDashboardClick}
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
          }

          if (menu.id === "profile") {
            return (
              <div
                key={menu.id}
                onClick={handleProfileClick}
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
          }

          return (
            <div
              key={menu.id}
              onClick={handleUserDashboardClick}
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
