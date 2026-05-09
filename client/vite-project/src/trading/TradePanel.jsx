import { useState } from "react";

import { runTrade }
from "../services/api/tradeApi";

import { useWallet }
from "../context/useWallet";

import {
  logTradeWithMetaMask
}
from "../blockchain/tradeLogger";

import {
  saveTradeHistory
}
from "../services/api/savehistory";

function TradePanel({ setTradeData }) {

  const { wallet } =
    useWallet();

  const [symbol,
    setSymbol] =
      useState("BTCUSDT");

  const [loading,
    setLoading] =
      useState(false);

  // AI prediction
  const [prediction,
    setPrediction] =
      useState(null);

  // confirmed blockchain trade
  const [data,
    setData] =
      useState(null);

  // =========================
  // STEP 1
  // AI ANALYSIS ONLY
  // =========================

  async function handleAIAnalysis() {

    try {

      setLoading(true);

      if (!wallet) {

        alert(
          "Connect wallet first"
        );

        return;
      }

      // ONLY AI SIGNAL
      const res =
        await runTrade(

          symbol,

          wallet.address
        );

      // SHOW RESULT
      setPrediction(res);

      // reset old blockchain status
      setData(null);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  }

  // =========================
  // STEP 2
  // CONFIRM BLOCKCHAIN TRADE
  // =========================

  async function confirmTrade() {

    try {

      if (!prediction) return;

      // HOLD => no trade
      if (
        prediction.signal === "HOLD"
      ) {

        alert(
          "AI recommends HOLD"
        );

        return;
      }

      // =========================
      // METAMASK TRANSACTION
      // =========================

      const tx =
        await logTradeWithMetaMask(

          wallet.signer,

          prediction.signal,

          prediction.price,

          "Hybrid-AI",

          symbol
        );

      // FAILED
      if (!tx.success) {

        alert(
          "Transaction Failed"
        );

        return;
      }

      // =========================
      // SAVE HISTORY
      // =========================

      await saveTradeHistory({

        walletAddress:
          wallet.address,

        // signal:
        //   prediction.signal,

        action:
          prediction.signal,

        price:
          prediction.price,

        confidence:
          prediction.confidence,

        txHash:
          tx.hash,

        symbol
      });

      // =========================
      // FINAL DATA
      // =========================

      const finalTrade = {

        ...prediction,

        txHash:
          tx.hash,

        blockchainStatus:
          "CONFIRMED"
      };

      setData(finalTrade);

      // parent refresh
      if (setTradeData) {

        setTradeData(finalTrade);
      }

    } catch (err) {

      console.log(err);
    }
  }

  return (

    <div className="
      bg-slate-900
      p-6
      rounded-2xl
      border
      border-slate-700
    ">

      {/* TITLE */}
      <h2 className="
        text-2xl
        font-bold
        mb-5
      ">

        AI Trading Panel

      </h2>

      {/* SYMBOL */}
      <select
        value={symbol}

        onChange={(e)=>

          setSymbol(
            e.target.value
          )
        }

        className="
          bg-slate-800
          p-3
          rounded-xl
          mb-4
          text-white
        "
      >

        <option>
          BTCUSDT
        </option>

        <option>
          ETHUSDT
        </option>

        <option>
          SOLUSDT
        </option>

      </select>

      {/* BUTTONS */}
      <div className="
        flex
        gap-4
        mb-6
      ">

        {/* RUN AI */}
        <button

          onClick={handleAIAnalysis}

          disabled={loading}

          className="
            bg-cyan-500
            hover:bg-cyan-600
            px-5
            py-3
            rounded-xl
            font-bold
          "
        >

          {
            loading

            ? "Analyzing..."

            : "Run AI Analysis"
          }

        </button>

        {/* CONFIRM */}
        {prediction && (

          <button

            onClick={confirmTrade}

            className="
              bg-green-500
              hover:bg-green-600
              px-5
              py-3
              rounded-xl
              font-bold
            "
          >

            Confirm Trade

          </button>
        )}

      </div>

      {/* AI RESULT */}
      {prediction && (

        <div className="
          mt-6
          space-y-3
        ">

          <h1>

            Signal:

            <span className={`
              ml-2
              font-bold

              ${
                prediction.signal
                === "BUY"

                ? "text-green-400"

                : prediction.signal
                === "SELL"

                ? "text-red-400"

                : "text-yellow-400"
              }
            `}>

              {prediction.signal}

            </span>

          </h1>

          <h1>

            Price:
            ${prediction.price}

          </h1>

          <h1>

            Confidence:
            {prediction.confidence}

          </h1>

          <h1>

            AI Probability:
            {prediction.probability}

          </h1>

          {/* BLOCKCHAIN STATUS */}
          {data && (

            <h1>

              Status:

              <span className="
                text-cyan-400
                ml-2
              ">

                {data.blockchainStatus}

              </span>

            </h1>
          )}

        </div>
      )}

    </div>
  );
}

export default TradePanel;