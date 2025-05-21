import React from "react";
import SettingPage from "./templates/SettingPage";
import { IconInput } from "./IconInput";
import { IconTextBox } from "./IconTextBox";
import { ChoosedBox } from "./ChoosedBox";

export function ShareCreate() {
  return (
    <SettingPage>
      <div className="w-full h-screen flex flex-col items-center">
        <div className="w-full flex-1 overflow-y-scroll overflow-x-hidden scrollbar-hide pb-[300px] flex flex-col items-center">
          <div className="w-[703px] relative top-[150px] font-[pretendard] flex flex-col items-start">
            <p className="font-bold text-[30px]">
              공유 TDL에 함께할 친구를 초대해주세요
            </p>

            <div className="w-full flex flex-col gap-[22px] relative top-[31px]">
              <div className="flex flex-col gap-[14px] w-full">
                <p className="font-medium">검색</p>
                <IconInput
                  iconSrc="/Search.svg"
                  iconPosition="right"
                  placeholder="초대할 사람의 이름을 적어주세요"
                />
              </div>

              <div className="flex flex-col gap-[14px] w-full">
                <p className="font-medium">검색 결과</p>
                <IconTextBox
                  iconSrc="/Plus.svg"
                  iconPosition="right"
                  iconAsButton={true}
                />
              </div>

              <div className="flex flex-col gap-[14px] w-full">
                <p className="font-medium">현재 초대할 인원</p>
                <div className="flex flex-col gap-[13px]">
                  <ChoosedBox
                    iconSrc="/BlueX.svg"
                    iconPosition="right"
                    text="곽민성"
                    iconAsButton={true}
                  />
                  <ChoosedBox
                    iconSrc="/BlueX.svg"
                    iconPosition="right"
                    text="진건희"
                    iconAsButton={true}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-[703px] font-[pretendard] flex flex-col items-start relative top-[215px] gap-[14px]">
            <p className="font-bold text-[30px]">공유 TDL 설정을 해주세요</p>
            <div className="w-full flex flex-col gap-[13px]">
              <p className="font-medium">설정하고 싶은 내용을 클릭해주세요</p>
            </div>
          </div>

          <div className="w-[703px] flex flex-col items-end relative top-[246px]">
            <button className="w-[100px] h-[41px] font-[pretendard] font-semibold text-[18px] bg-[#1570EF] text-white rounded-[8px]">
              생성하기
            </button>
          </div>
        </div>
      </div>
    </SettingPage>
  );
}
