/* eslint-disable no-unused-vars */

import React from "react";
import TopBar from "./TopBar";

const Notifications = () => {
  return (
    <>
      <div className="topbar block lg:hidden" >
        <TopBar />
      </div>
      <div className="w-full bg-primary px-6 py-5 h-screen overflow-y-auto">
        <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
          <span>Notifications</span>
          <span>0</span>
        </div>

        <div className="w-full h-full items-center justify-center pt-4 border-[#66666645]">
          <p className="text-lg text-ascent-2">
            You don't have any notifications !!
          </p>
        </div>
      </div>
    </>
  );
};

export default Notifications;
