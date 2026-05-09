import {
  useEffect,
  useState
}
from "react";

import {
  SymbolContext
}
from "./SymbolContext";

export function SymbolProvider({
  children
}) {

  const [walletAddress,
    setWalletAddress] =
      useState(null);

  // =====================================
  // INITIAL SYMBOL
  // =====================================

  const [symbol, setSymbol] =
    useState(() => {

      if (!walletAddress)
        return "BTCUSDT";

      return (

        localStorage.getItem(
          `symbol_${walletAddress}`
        )

        || "BTCUSDT"
      );
    });

  // =====================================
  // LOAD SYMBOL WHEN WALLET CHANGES
  // =====================================

  useEffect(() => {

    if (!walletAddress)
      return;

    const saved =
      localStorage.getItem(

        `symbol_${walletAddress}`
      );

    // only update if different
    if (
      saved &&
      saved !== symbol
    ) {

      const async_symbol=()=>{setSymbol(saved)};
      async_symbol()
    }

  }, [walletAddress]);

  // =====================================
  // SAVE SYMBOL
  // =====================================

  useEffect(() => {

    if (!walletAddress)
      return;

    localStorage.setItem(

      `symbol_${walletAddress}`,

      symbol
    );

  }, [symbol, walletAddress]);

  return (

    <SymbolContext.Provider
      value={{

        symbol,

        setSymbol,

        walletAddress,

        setWalletAddress
      }}
    >

      {children}

    </SymbolContext.Provider>
  );
}