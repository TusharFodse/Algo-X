import { useEffect, useState } from "react";

import { ethers } from "ethers";

import { useWallet }
from "../context/useWallet";

function PortfolioCard() {

  const { wallet } =
    useWallet();

  const [ethBalance,
    setEthBalance] =
      useState("0");

  async function loadBalance() {

  try {

    if (!wallet?.address)
      return;

    // fresh provider from MetaMask
    const provider =
      new ethers.BrowserProvider(
        window.ethereum
      );

    // get real balance
    const balanceWei =
      await provider.getBalance(
        wallet.address
      );

    // convert wei -> ETH
    const balanceEth =
      ethers.formatEther(
        balanceWei
      );

    console.log(
      "REAL BALANCE:",
      balanceEth
    );

    setEthBalance(balanceEth);

  } catch (err) {

    console.log(err);
  }
}

  useEffect(() => {

    const loadbalnce=()=>{loadBalance()};
    loadbalnce()

  }, [wallet]);

  return (

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
        mb-5
      ">
        Real Wallet Portfolio
      </h2>

      <div className="space-y-5">

        {/* WALLET ADDRESS */}
        <div>

          <p className="text-slate-400">
            Wallet Address
          </p>

          <h1 className="
            text-sm
            break-all
            mt-2
            text-cyan-400
          ">

            {
    wallet?.address
    ? `${wallet.address.slice(0,6)}...${wallet.address.slice(-4)}`
    : "No Wallet"
  }

          </h1>

        </div>

        {/* ETH BALANCE */}
        <div>

          <p className="text-slate-400">
            Sepolia ETH Balance
          </p>

          <h1 className="
            text-3xl
            font-bold
            text-green-400
            mt-2
          ">

            {ethBalance} ETH

          </h1>

        </div>

      </div>

    </div>
  );
}

export default PortfolioCard;