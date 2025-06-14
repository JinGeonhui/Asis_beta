import React from "react";
import { Logo } from "@/app/components";

function SettingPage({ children }: any) {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="absolute top-[2rem] left-[3.5rem]">
        <Logo />
      </div>

      {children}
    </div>
  );
}

export default SettingPage;
