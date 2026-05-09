// import { useWallet }
// from "../hooks/useWallet";

import { useSymbol } from "../context/useSymbol";
import { useWallet } from "../context/useWallet";
import {
  connectWallet
}
from "./wallet";

function WalletConnect() {

  const {
    wallet,
    setWallet
  } = useWallet();
  const {setWalletAddress} = useSymbol();

  async function handleConnect() {

    try {

      const data =
        await connectWallet();

      // network validation first
      if (data.chainId !== 11155111) {

        alert(
          "Please switch to Sepolia"
        );

        return;
      }

      // then save wallet
      setWallet(data)
      
      setWalletAddress(data.address);

    } catch (err) {

      alert(err.message);
    }
  }

  return (

    <div>

      {/* NOT CONNECTED */}
      {!wallet ? (

        <button
          onClick={handleConnect}
          className="
            bg-cyan-500
            px-5
            py-2
            rounded-xl
            font-bold
          "
        >

          Connect Wallet

        </button>

      ) : (

        /* CONNECTED */

        <div className="
          bg-slate-800
          px-4
          py-2
          rounded-xl
          text-sm
        ">

          <p className="
            text-cyan-400
          ">

            {wallet.address.slice(0, 6)}
            ...
            {wallet.address.slice(-4)}

          </p>

          <p className="
            text-slate-400
            text-xs
          ">

            {wallet.network}

          </p>

        </div>
      )}

    </div>
  );
}

export default WalletConnect;