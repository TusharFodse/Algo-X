import { ethers }
from "ethers";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const ABI = [

  "function addTrade(string memory action,uint256 price,string memory strategy,string memory symbol) public"
];

export async function logTradeWithMetaMask(

  signer,

  action,

  price,

  strategy,

  symbol
) {

  try {

    const contract =
      new ethers.Contract(

        CONTRACT_ADDRESS,

        ABI,

        signer
      );

    const tx =
      await contract.addTrade(

        action,

        Math.floor(price),

        strategy,

        symbol
      );

    console.log(
      "Tx Sent:",
      tx.hash
    );

    await tx.wait();

    return {

      success: true,

      hash: tx.hash
    };

  } catch (err) {

    console.log(err);

    return {

      success: false,

      error: err.message
    };
  }
}