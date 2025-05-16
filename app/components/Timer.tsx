import React from "react";

function Timer() {
  return (
    <div
      id="Container"
      className="w-[20rem] h-[10rem] bg-white rounded-md border shadow flex flex-col"
    >
      <p className="font-[pretendard] text-[1.5rem] font-bold pl-[1.4rem] mt-[0.7rem]">
        타이머
      </p>
      <div className="w-full flex flex-col items-center mt-[1.8rem]">
        <p className="font-[pretndard] text-[1.5rem] font-bold">00:00:00</p>
      </div>
    </div>
  );
}

export default Timer;
