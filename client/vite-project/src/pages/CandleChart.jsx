import {
  useEffect,
  useRef,
  useState
}
from "react";

import axios from "axios";

import {

  createChart,

  CandlestickSeries

}
from "lightweight-charts";
import { useSymbol }
from "../context/useSymbol";

function CandleChart() {

  const { symbol } =
    useSymbol();

  const chartContainerRef =
    useRef();

  const chartRef =
    useRef(null);

  const candleSeriesRef =
    useRef(null);

  const [interval,
    setIntervalValue] =
      useState("5m");

  // =========================
  // LOAD DATA
  // =========================

  async function loadData() {

    try {

      const res =
        await axios.get(

          `http://localhost:5000/api/market/candles?symbol=${symbol}&interval=${interval}`
        );

      const formatted =

        res.data.map(
          item => ({

            time:
              item.time / 1000,

            open:
              item.open,

            high:
              item.high,

            low:
              item.low,

            close:
              item.close
          })
        );

      candleSeriesRef.current
        .setData(formatted);

    } catch (err) {

      console.log(err);
    }
  }

  // =========================
  // CREATE CHART
  // =========================

  useEffect(() => {

    const chart =
      createChart(

        chartContainerRef.current,

        {

          width:
            chartContainerRef.current
              .clientWidth,

          height: 600,

          layout: {

            background: {
              color: "#0f172a"
            },

            textColor:
              "#CBD5E1"
          },

          grid: {

            vertLines: {
              color: "#1e293b"
            },

            horzLines: {
              color: "#1e293b"
            }
          },

          crosshair: {

            mode: 1
          },

          rightPriceScale: {

            borderColor:
              "#334155"
          },

          timeScale: {

            borderColor:
              "#334155"
          }
        }
      );

    const candleSeries =

      chart.addSeries(
  CandlestickSeries,
  {
    upColor: "#22c55e",
    downColor: "#ef4444",
    borderVisible: false,
    wickUpColor: "#22c55e",
    wickDownColor: "#ef4444",
  }
)

    chartRef.current =
      chart;

    candleSeriesRef.current =
      candleSeries;

    loadData();

    // resize
    const handleResize =
      () => {

        chart.applyOptions({

          width:
            chartContainerRef.current
              .clientWidth
        });
      };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

      chart.remove();
    };

  }, []);

  // =========================
  // RELOAD DATA
  // =========================

  useEffect(() => {

    loadData();

  }, [symbol, interval]);

  return (

    <div className="
      min-h-screen
      bg-[#020617]
      text-white
      p-6
    ">

      {/* HEADER */}
      <div className="
        flex
        justify-between
        items-center
        mb-6
      ">

        <h1 className="
          text-4xl
          font-bold
        ">

          {symbol} Candlestick Chart

        </h1>

        {/* INTERVAL */}
        <div className="
          flex
          gap-3
        ">

          {[
            "1m",
            "5m",
            "15m",
            "1h",
            "4h",
            "1d"
          ].map((item) => (

            <button
              key={item}

              onClick={() =>
                setIntervalValue(item)
              }

              className={`
                px-4
                py-2
                rounded-xl
                font-bold
                transition

                ${
                  interval === item

                  ? "bg-cyan-500"

                  : "bg-slate-800"
                }
              `}
            >

              {item}

            </button>
          ))}

        </div>

      </div>

      {/* CHART */}
      <div
        ref={chartContainerRef}

        className="
          w-full
          h-[600px]
          rounded-2xl
          overflow-hidden
          border
          border-slate-700
        "
      />

    </div>
  );
}

export default CandleChart;