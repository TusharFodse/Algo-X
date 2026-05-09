import {
  useState
}
from "react";

import {
  WalletContext
}
from "./walletContext";

export function WalletProvider({
  children
}) {

  const [wallet, setWallet] =
    useState(null);

  return (

    <WalletContext.Provider
      value={{
        wallet,
        setWallet
      }}
    >

      {children}

    </WalletContext.Provider>
  );
}