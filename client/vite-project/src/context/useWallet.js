import {
  useContext
}
from "react";

import {
  WalletContext
}
from "../context/walletContext";

export function useWallet() {

  return useContext(
    WalletContext
  );
}