"use client"

import React from "react";
import { useState } from "react";

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-8 min-h-screen w-auto place-items-center">
      <div>
        <span>Menu</span>
      </div>
      <div>
        <ul>
          <li>Booked</li>
          <li>History</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
