// import {
//   LayoutDashboard,
//   TrendingUp,
//   Brain,
//   Wallet,
//   History,
//   Settings
// }
// from "lucide-react";

import {
  Link,
  useLocation
}
from "react-router-dom";


function Sidebar() {

  const location =
    useLocation();

  const menus = [

    {
      title: "Dashboard",
      icon: "📊",
      path: "/"
    },

    {
      title: "Profit / Loss",
      icon: "📈",
      path: "/profit-loss"
    },

    {
      title: "AI Forecast",
      icon: "🧠",
      path: "/ai-forecast"
    },

    {
      title: "CandleChart",
      icon: "👝",
      path: "/candles"
    },

    // {
    //   title: "Trade History",
    //   icon: "🔍",
    //   path: "/history"
    // },

    // {
    //   title: "Settings",
    //   icon: "⚙️",
    //   path: "/settings"
    // }
  ];

  return (

    <div className="
      w-[260px]
      min-h-screen
      bg-slate-950
      border-r
      border-slate-800
      text-white
      p-5
      flex
      flex-col
    ">

      {/* LOGO */}
      <div className="
        mb-10
      ">

        <h1 className="
          text-3xl
          font-bold
          text-cyan-400
        ">

          AlgoTradeX

        </h1>

        <p className="
          text-slate-400
          mt-2
          text-sm
        ">

          AI Trading Platform

        </p>

      </div>

      {/* MENU */}
      <div className="
        flex
        flex-col
        gap-3
      ">

        {menus.map((menu) => (

          <Link
            key={menu.path}
            to={menu.path}
            className={`
              flex
              items-center
              gap-4
              px-4
              py-3
              rounded-xl
              transition-all
              duration-200

              ${
                location.pathname
                === menu.path

                ? "bg-cyan-500 text-white"

                : "text-slate-300 hover:bg-slate-800"
              }
            `}
          >

            {menu.icon}

            <span className="
              font-medium
            ">

              {menu.title}

            </span>

          </Link>
        ))}

      </div>

      {/* FOOTER */}
      <div className="
        mt-auto
        pt-6
        border-t
        border-slate-800
      ">

        <div className="
          bg-slate-900
          rounded-xl
          p-4
        ">

          <p className="
            text-sm
            text-slate-400
          ">

            System Status

          </p>

          <div className="
            flex
            items-center
            gap-2
            mt-2
          ">

            <div className="
              w-3
              h-3
              rounded-full
              bg-green-500
            "/>

            <p className="
              text-sm
              font-medium
            ">

              AI Running

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Sidebar;