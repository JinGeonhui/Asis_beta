import React from "react";
import Logo from "../Logo";

function SettingPage({ children }: any) {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="absolute top-8 left-12">
        <Logo />
      </div>

      {children}
    </div>
  );
}

export default SettingPage;
