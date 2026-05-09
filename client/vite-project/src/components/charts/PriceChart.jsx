import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
}
from "recharts";

import {
  useEffect,
  useState
}
from "react";


import {
  getChartData
}
from "../../services/api/marketApi";
import { useSymbol } from "../../context/useSymbol";
import MarketSelector from "../../trading/MarketSelector";
// import { useWallet } from "../../context/useWallet";
// import { getHistory } from "../../services/api/historyApi";


// Start 


// ====================================
// PRICE CHART
// ====================================

function PriceChart() {

  const { symbol } =
    useSymbol();

  const [data, setData] =
    useState([]);

  const [interval,
    setChartInterval] =
      useState("5m");

  // ====================================
  // LOAD CHART DATA
  // ====================================

  async function loadChart() {

    try {

      let limit = 50;

      if (interval === "1d")
        limit = 365;

      // REAL MARKET DATA
      const res =
        await getChartData(

          symbol,

          interval,

          limit
        );

      setData(res);

    } catch (err) {

      console.log(err);
    }
  }

  // ====================================
  // INITIAL LOAD
  // ====================================

  useEffect(() => {

    const load=()=>{loadChart()};
    load()

  }, [interval, symbol]);

  // ====================================
  // AUTO REFRESH
  // ====================================

  useEffect(() => {

    const timer =
      setInterval(

        loadChart,

        10000
      );

    return () =>
      clearInterval(timer);

  }, [interval, symbol]);

  return (

    <div className="
      bg-slate-900
      p-6
      rounded-2xl
      border
      border-slate-700
      mt-6
    ">

      {/* MARKET SELECTOR */}
      <MarketSelector />

      {/* HEADER */}
      <div className="
        flex
        justify-between
        items-center
        mb-6
      ">

        <h2 className="
          text-2xl
          font-bold
        ">

          {symbol} Live Chart

        </h2>

        {/* TIMEFRAME */}
        <div className="
          flex
          gap-2
        ">

          {[
            "5m",
            "15m",
            "1h",
            "4h",
            "1d"
          ].map((item) => (

            <button
              key={item}
              onClick={() =>
                setChartInterval(item)
              }
              className={`
                px-4
                py-2
                rounded-lg
                font-semibold
                transition

                ${
                  interval === item

                  ? "bg-cyan-500 text-white"

                  : "bg-slate-800"
                }
              `}
            >

              {item}

            </button>
          ))}

        </div>

      </div>

      {/* LEGEND */}
      <div className="
        flex
        gap-6
        mb-4
        text-sm
      ">

        <div className="
          flex items-center gap-2
        ">

          <div className="
            w-6 h-1
            bg-cyan-400
          "/>

          <p>
            Real Market
          </p>

        </div>

      </div>

      {/* CHART */}
      <div className="
        h-[500px]
        w-full
      ">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart data={data}>

            <XAxis dataKey="time" />

            <YAxis
  domain={["auto", "auto"]}
/>

            <Tooltip />

            {/* REAL MARKET LINE */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default PriceChart;