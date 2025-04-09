import React from "react";
import SideBar from "../components/sidebar";
import DashbordHeader from "../components/DashbordHeader";

function Home() {
  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="absolute w-[1422px] h-full right-0">
        <div className="absolute left-[65px] top-[40px]">
          <DashbordHeader />
        </div>
      </div>
    </div>
  );
}

export default Home;
