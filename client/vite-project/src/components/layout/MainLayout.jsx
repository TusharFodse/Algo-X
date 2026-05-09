import Sidebar
from "../layout/SideBar";

// import Navbar
// from "../Navbar";


import {
  Outlet
}
from "react-router-dom";
import Navbar from "./Navbar";

function MainLayout() {

  return (

    <div className="
      flex
      min-h-screen
      bg-[#020617]
      text-white
    ">

      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="
        flex-1
        flex
        flex-col
      ">

        {/* TOP NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <div className="
          p-6
          flex-1
          overflow-y-auto
        ">

          <Outlet />

        </div>

      </div>

    </div>
  );
}

export default MainLayout;