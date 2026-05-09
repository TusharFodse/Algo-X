import { useEffect, useState }
from "react";
import { getHistory } from "../services/api/historyApi";
import { useWallet } from "../context/useWallet";



function TradeHistory() {

  const [trades, setTrades] =
    useState([]);
const { wallet } =useWallet();
  async function loadHistory() {

    try {
      if (!wallet){
          setTrades([]);
          return;
        }
      const data =
        await getHistory(wallet.address);
        console.log("Data is ",data)

      setTrades(data);

    } catch (err) {

      console.log(err);
    }
  }

  useEffect(() => {

  const asyncload=()=>{loadHistory()};
  asyncload()

  // auto refresh
  const interval = setInterval(() => {

    loadHistory();

  }, 5000);

  return () =>
    clearInterval(interval);

}, [wallet]);

  return (

    <div className="
      bg-slate-900
      p-6
      rounded-2xl
      border
      border-slate-700
      mt-6
    ">

      <h2 className="
        text-2xl
        font-bold
        mb-5
      ">
        Trade History
      </h2>

      <div className="
        overflow-x-auto
      ">

        <table className="
          w-full
          text-left
        ">

          <thead>

            <tr className="
              border-b
              border-slate-700
            ">

              <th className="py-3">
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

              <th>
                Blockchain
              </th>

            </tr>

          </thead>

          <tbody>
            {trades.length === 0 && (

  <tr>

    <td
      colSpan="5"
      className="
        text-center
        py-8
        text-slate-400
      "
    >

      No Trade History

    </td>

  </tr>
)}
            {trades.map((trade) => (

              <tr
                key={trade._id}
                className="
                  border-b
                  border-slate-800
                "
              >

                <td className="
                  py-4
                  font-bold
                ">

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

                <td>

                  {trade.txHash ? (

                    <a
                      href={
                        `https://sepolia.etherscan.io/tx/${trade.txHash}`
                      }
                      target="_blank"
                      className="
                        text-cyan-400
                      "
                    >
                      View Tx
                    </a>

                  ) : (

                    <span className="
                      text-yellow-400
                    ">
                      Pending
                    </span>
                  )}

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default TradeHistory;