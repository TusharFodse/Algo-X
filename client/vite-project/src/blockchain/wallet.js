import { ethers }
from "ethers";

export async function connectWallet() {

  try {

    // MetaMask check
    if (!window.ethereum) {

      throw new Error(
        "MetaMask not installed"
      );
    }

    // request wallet access
    const accounts =
      await window.ethereum.request({

        method:
          "eth_requestAccounts"
      });

    // provider
    const provider =
      new ethers.BrowserProvider(
        window.ethereum
      );

    // signer
    const signer =
      await provider.getSigner();

    // network
    const network =
      await provider.getNetwork();
      console.log(" Network :- ",network,"Address :- ",accounts[0]," Signer :-",signer)
    return {

      address: accounts[0],

      chainId:
        Number(network.chainId),

      network:
        network.name,

      signer

    };
    

  } catch (err) {

    console.log(err);

    throw err;
  }
}