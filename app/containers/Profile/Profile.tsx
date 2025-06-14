import React from "react";
import SideBar from "@/app/components/Sidebar";
import UserCard from "@/app/components/@User/UserCard";
import UserCertificateCard from "@/app/components/@User/UserCertificateCard";
import UserFriendCard from "@/app/components/@User/FriendsBox";

export default function Profile() {
  return (
    <div className="w-full h-screen flex flex-row">
      <div id="LeftSection" className="w-[20%] h-screen flex flex-col">
        {" "}
        <SideBar />
      </div>

      <div
        id="RangeSection"
        className="w-full h-screen flex flex-col overflow-y-auto items-center"
      >
        <UserCard />
        <UserCertificateCard />
        <UserFriendCard />
      </div>
    </div>
  );
}
