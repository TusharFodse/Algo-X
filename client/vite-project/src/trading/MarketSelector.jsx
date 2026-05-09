// import {
//   useSymbol
// }

import { useSymbol } from "../context/useSymbol";

// from "../../context/SymbolContext";


function MarketSelector() {

  const {
    symbol,
    setSymbol
  } = useSymbol();

  return (

    <div className="mb-6">

      <select

        value={symbol}

        onChange={(e)=>

          setSymbol(
            e.target.value
          )
        }

        className="
          bg-slate-800
          border
          border-slate-700
          p-3
          rounded-xl
          text-white
          font-semibold
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

        <option>
          BNBUSDT
        </option>

      </select>

    </div>
  );
}

export default MarketSelector;