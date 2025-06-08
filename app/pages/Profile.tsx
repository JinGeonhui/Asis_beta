import React from "react";
import SideBar from "../components/sidebar";
import UserCard from "../components/UserCard";
import UserCertificateCard from "../components/UserCertificateCard";

function Profile() {
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
      </div>
    </div>
  );
}

export default Profile;
