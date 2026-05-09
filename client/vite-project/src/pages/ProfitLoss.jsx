
import {
  useEffect,
  useState
}
from "react";

import {
  useWallet
}
from "../context/useWallet";

import {
  getHistory
}
from "../services/api/historyApi";

function ProfitLoss() {

  const { wallet } =
    useWallet();

  const [trades, setTrades] =
    useState([]);

  const [stats, setStats] =
    useState({
      totalTrades: 0,
      buyTrades: 0,
      sellTrades: 0,
      estimatedProfit: 0,
      estimatedLoss: 0
    });

  async function loadTrades() {

    try {

      if (!wallet?.address)
        return;

      const data =
        await getHistory(
          wallet.address
        );

      setTrades(data);

      // =========================
      // SIMPLE PROFIT/LOSS LOGIC
      // =========================

      let buyTotal = 0;
      let sellTotal = 0;

      let buyCount = 0;
      let sellCount = 0;

      data.forEach((trade) => {

        if (trade.action === "BUY") {

          buyTotal += trade.price;
          buyCount++;
        }

        if (trade.action === "SELL") {

          sellTotal += trade.price;
          sellCount++;
        }
      });

      const pnl =
        sellTotal - buyTotal;

      setStats({

        totalTrades:
          data.length,

        buyTrades:
          buyCount,

        sellTrades:
          sellCount,

        estimatedProfit:
          pnl > 0 ? pnl : 0,

        estimatedLoss:
          pnl < 0
            ? Math.abs(pnl)
            : 0
      });

    } catch (err) {

      console.log(err);
    }
  }

  useEffect(() => {

    const load_trade=()=>{loadTrades()};
    load_trade()

  }, [wallet]);

  return (

    <div className="
      min-h-screen
      bg-[#020617]
      text-white
      p-6
    ">

      <h1 className="
        text-4xl
        font-bold
        mb-8
      ">
        Profit / Loss Dashboard
      </h1>

      {/* STATS */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4
        gap-6
        mb-10
      ">

        {/* TOTAL TRADES */}
        <div className="
          bg-slate-900
          border
          border-slate-700
          rounded-2xl
          p-6
        ">

          <p className="text-slate-400">
            Total Trades
          </p>

          <h2 className="
            text-3xl
            font-bold
            mt-2
          ">
            {stats.totalTrades}
          </h2>

        </div>

        {/* BUY */}
        <div className="
          bg-slate-900
          border
          border-slate-700
          rounded-2xl
          p-6
        ">

          <p className="text-slate-400">
            BUY Trades
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-green-400
            mt-2
          ">
            {stats.buyTrades}
          </h2>

        </div>

        {/* SELL */}
        <div className="
          bg-slate-900
          border
          border-slate-700
          rounded-2xl
          p-6
        ">

          <p className="text-slate-400">
            SELL Trades
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-red-400
            mt-2
          ">
            {stats.sellTrades}
          </h2>

        </div>

        {/* PNL */}
        <div className="
          bg-slate-900
          border
          border-slate-700
          rounded-2xl
          p-6
        ">

          <p className="text-slate-400">
            Estimated PnL
          </p>

          <h2 className={`
            text-3xl
            font-bold
            mt-2

            ${
              stats.estimatedProfit > 0
              ? "text-green-400"
              : "text-red-400"
            }
          `}>

            ${
              stats.estimatedProfit > 0
              ? stats.estimatedProfit.toFixed(2)
              : stats.estimatedLoss.toFixed(2)
            }

          </h2>

        </div>

      </div>

      {/* TRADE TABLE */}
      <div className="
        bg-slate-900
        border
        border-slate-700
        rounded-2xl
        p-6
      ">

        <h2 className="
          text-2xl
          font-bold
          mb-6
        ">
          Trade Performance
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>

              <tr className="border-b border-slate-700">

                <th className="py-4">
                  Signal
                </th>

                <th>
                  Symbol
                </th>

                <th>
                  Price
                </th>

                <th>
                  Confidence
                </th>

              </tr>

            </thead>

            <tbody>

              {trades.map((trade) => (

                <tr
                  key={trade._id}
                  className="border-b border-slate-800"
                >

                  <td className="py-4">

                    <span className={
                      trade.action === "BUY"
                      ? "text-green-400"
                      : "text-red-400"
                    }>

                      {trade.action}

                    </span>

                  </td>

                  <td>
                    {trade.symbol}
                  </td>

                  <td>
                    ${trade.price}
                  </td>

                  <td>
                    {trade.confidence}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default ProfitLoss;
