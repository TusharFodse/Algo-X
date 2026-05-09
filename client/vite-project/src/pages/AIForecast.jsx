import {
  useEffect,
  useState
}
from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend
}
from "recharts";

import { useSymbol }
from "../context/useSymbol";

import {
  getChartData
}
from "../services/api/marketApi";

function AIForecast() {

  const {
    symbol,
    setSymbol
  } = useSymbol();

  // =========================
  // STATES
  // =========================

  const [interval,
    setIntervalValue] =
      useState("5m");

  const [training,
    setTraining] =
      useState(false);

  const [message,
    setMessage] =
      useState("");

  const [forecastData,
    setForecastData] =
      useState([]);

  const [prediction,
    setPrediction] =
      useState(null);

  const [loading,
    setLoading] =
      useState(false);
      console.log(loading)

  // =========================
  // LOAD FORECAST
  // =========================

  async function loadForecast() {

    try {

      setLoading(true);

      // =========================
      // LIMIT
      // =========================

      let limit = 50;

      if (interval === "1d")
        limit = 365;

      if (interval === "4h")
        limit = 120;

      if (interval === "1h")
        limit = 100;

      // =========================
      // MARKET DATA
      // =========================

      const marketData =
        await getChartData(

          symbol,
          interval,
          limit
        );

      // =========================
      // CLEAN MARKET DATA
      // =========================

      const cleanMarket =

        marketData

        .filter(
          item =>

            item.price !== null &&

            item.price !== undefined &&

            !isNaN(item.price)
        )

        .map((item, index) => ({

          time:
            index + 1,

          real:
            Number(item.price)
        }));

      if (
        cleanMarket.length === 0
      ) return;

      // =========================
      // CURRENT PRICE
      // =========================

      const lastPrice =

        cleanMarket[
          cleanMarket.length - 1
        ].real;

      // =========================
      // AI FORECAST API
      // =========================

      const response =
        await fetch(

          "http://localhost:5001/forecast",

          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              symbol,

              prices:
                cleanMarket.map(
                  item => item.real
                )
            })
          }
        );

      const data =
        await response.json();

      // =========================
      // FUTURE FORECAST
      // =========================

      const futurePoints = [];

      // START EXACTLY
      // FROM LAST REAL POINT

      futurePoints.push({

        time:
          cleanMarket.length,

        real:
          lastPrice,

        predicted:
          lastPrice
      });

      // SMOOTH AI CURVE

      let futurePrice =
        lastPrice;

      const targetPrice =
        Number(
          data.predictedPrice
        );

      for (let i = 1; i <= 5; i++) {

        futurePrice += (

          targetPrice
          - futurePrice

        ) * 0.5;

        futurePoints.push({

          time:
            cleanMarket.length + i,

          predicted:
            Number(
              futurePrice
            )
        });
      }

      // =========================
      // MERGE DATA
      // =========================

      const merged = [

        ...cleanMarket,

        ...futurePoints
      ];

      setForecastData(merged);

      // =========================
      // ANALYTICS
      // =========================

      const diff =
        targetPrice
        - lastPrice;

      const confidence =
        (
          100 -
          Math.abs(
            diff / lastPrice
          ) * 100
        ).toFixed(2);

      setPrediction({

        currentPrice:
          lastPrice,

        predictedPrice:
          targetPrice,

        confidence,

        trend:
          diff > 0

          ? "Bullish"

          : "Bearish"
      });

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  }

  // =========================
  // FINETUNE MODEL
  // =========================

  async function handleFineTune() {

    try {

      setTraining(true);

      setMessage("");

      const response =
        await fetch(

          "http://localhost:5000/api/model/finetune",

          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              symbol
            })
          }
        );

      const data =
        await response.json();

      if (data.success) {

        setMessage(
          "Model Fine-Tuned Successfully"
        );

        loadForecast();

      } else {

        setMessage(
          "Training Failed"
        );
      }

    } catch (err) {

      console.log(err);

      setMessage(
        "Error Training Model"
      );

    } finally {

      setTraining(false);
    }
  }

  // =========================
  // AUTO LOAD
  // =========================

  useEffect(() => {

    const loadForcast=()=>{loadForecast()};
    loadForcast()

  }, [symbol, interval]);

  return (

    <div className="
      min-h-screen
      bg-[#020617]
      text-white
      p-8
    ">

      {/* HEADER */}
      <div className="
        flex
        justify-between
        items-center
        mb-8
        flex-wrap
        gap-4
      ">

        <div>

          <h1 className="
            text-4xl
            font-bold
          ">

            AI Forecast Dashboard

          </h1>

          <p className="
            text-slate-400
            mt-2
          ">

            Regression LSTM Forecasting

          </p>

          {/* SYMBOL BUTTONS */}
          <div className="
            flex
            gap-3
            mt-6
            flex-wrap
          ">

            {[
              "BTCUSDT",
              "ETHUSDT",
              "SOLUSDT"
            ].map((item) => (

              <button
                key={item}

                onClick={() =>
                  setSymbol(item)
                }

                className={`
                  px-5
                  py-2
                  rounded-xl
                  font-semibold
                  transition

                  ${
                    symbol === item

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

        {/* TRAIN BUTTON */}
        <button
          onClick={handleFineTune}
          disabled={training}
          className="
            bg-cyan-500
            hover:bg-cyan-600
            px-6
            py-3
            rounded-xl
            font-bold
          "
        >

          {
            training

            ? "Training..."

            : "Fine-Tune LSTM"
          }

        </button>

      </div>

      {/* MESSAGE */}
      {message && (

        <div className="
          bg-slate-900
          border
          border-slate-700
          p-4
          rounded-xl
          mb-6
        ">

          {message}

        </div>
      )}

      {/* STATS */}
      {prediction && (

        <div className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
          mb-8
        ">

          <div className="
            bg-slate-900
            p-6
            rounded-2xl
            border
            border-slate-700
          ">

            <p className="text-slate-400">
              Current Price
            </p>

            <h2 className="
              text-3xl
              font-bold
              mt-2
            ">

              $
              {
                prediction.currentPrice
                  .toFixed(2)
              }

            </h2>

          </div>

          <div className="
            bg-slate-900
            p-6
            rounded-2xl
            border
            border-slate-700
          ">

            <p className="text-slate-400">
              AI Predicted Price
            </p>

            <h2 className="
              text-3xl
              font-bold
              text-cyan-400
              mt-2
            ">

              $
              {
                prediction.predictedPrice
                  .toFixed(2)
              }

            </h2>

          </div>

          <div className="
            bg-slate-900
            p-6
            rounded-2xl
            border
            border-slate-700
          ">

            <p className="text-slate-400">
              AI Trend
            </p>

            <h2 className={`
              text-3xl
              font-bold
              mt-2

              ${
                prediction.trend ===
                "Bullish"

                ? "text-green-400"

                : "text-red-400"
              }
            `}>

              {prediction.trend}

            </h2>

          </div>

        </div>
      )}

      {/* INTERVAL */}
      <div className="
        flex
        gap-3
        mb-6
        flex-wrap
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
              setIntervalValue(item)
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

      {/* GRAPH */}
      <div className="
        bg-slate-900
        p-6
        rounded-2xl
        border
        border-slate-700
      ">

        <h2 className="
          text-2xl
          font-bold
          mb-6
        ">

          AI Forecast Graph

        </h2>

        <div className="
          h-[500px]
          min-w-0
        ">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart
              data={forecastData}
            >

              <XAxis dataKey="time" />

              <YAxis

                tickFormatter={
                  (value) =>
                    `$${value.toFixed(0)}`
                }

                domain={[
                  "auto",
                  "auto"
                ]}
              />

              <Tooltip />

              <Legend />

              {/* REAL */}
              <Line
                type="monotone"
                dataKey="real"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={false}
                connectNulls={true}
                name="Real Market"
              />

              {/* FORECAST */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#22c55e"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
                connectNulls={true}
                name="AI Forecast"
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}

export default AIForecast;