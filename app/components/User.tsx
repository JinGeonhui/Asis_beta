import React from "react";

interface UserList {
  Name: string;
  Email: string;
}

function User({ Name, Email }: UserList) {
  return (
    <div className="w-[17rem] h-[2.5625rem] border border-[#1570EF] rounded-[0.3125rem] bg-[#F0F3F9] flex justify-center items-center">
      <div className="flex flex-row gap-[1.2rem] items-center">
        <p className="font-[pretnedard] font-normal text-[1rem]">{Name}</p>
        <p className="font-[pretendard text-[0.85rem] text-[#CECED2]">
          {Email}
        </p>
      </div>
    </div>
  );
}

export default User;
