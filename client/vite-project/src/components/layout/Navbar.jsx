import WalletConnect from "../../blockchain/WalletConnect";

function Navbar() {
  return (

    <div className="
      w-full
      bg-slate-900
      border-b
      border-slate-700
      px-8
      py-4
      flex
      justify-between
      items-center
    ">

      <h1 className="
        text-2xl
        font-bold
        text-cyan-400
      ">
        AlgoTradeX
      </h1>

      <div className="flex gap-5">

        <WalletConnect/>

      </div>

    </div>
  );
}

export default Navbar;