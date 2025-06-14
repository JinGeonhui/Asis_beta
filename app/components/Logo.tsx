import React from "react";
import { ICON } from "@/app/constants";

export function Logo() {
  return (
    <div className="w-[303px] h-[72px] flex flex-row gap-1 items-center">
      <img src={`${ICON.SVG_ICON}/LogoIcon.svg`} className="w-[58px] h-[58px]" />
      <img src={`${ICON.SVG_ICON}/LogoTextFull.svg`} className="w-[190px] h-[70px]" />
    </div>
  );
}
