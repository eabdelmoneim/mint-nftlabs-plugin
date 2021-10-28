import React from "react";
import "./styles.css";
import "antd/dist/antd.css";
import { Button } from "antd";

import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider"
import NFTLabsSDK from "@nftlabs/sdk"

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      // hard coded test key will be parameter
      infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
    }
  }
};

let provider = null;
let web3 = null;
let accounts = null;

export default function App() {
  async function mint() {
    if (!provider) {
      const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions, // required
        disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
      });
      web3 = await connect(web3Modal);
      console.log("Web3Modal instance is", web3);
    }

    // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  console.log("Got accounts", accounts);
  let selectedAccount = accounts[0];
  console.log(`Wallet address: ${selectedAccount.toLowerCase()}`);
   
  }

  async function connect(web3Modal) {
    provider = await web3Modal.connect();
    return new Web3(provider);
  }

  /**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function initializeMinting() {

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  // document.querySelector("#showConnectBtn").setAttribute("disabled", "disabled");
  await mint(provider);
  // document.querySelector("#showConnectBtn").removeAttribute("disabled");
}


  /**
 * Connect wallet button pressed.
 */
async function onConnect() {

  const web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });

  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  web3 = new Web3(provider);

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    mint();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    mint();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    mint();
  });

  await initializeMinting()
}

  function print(str) {
    const p = document.createElement("p");
    p.innerText = str;
    document.getElementById("userWalletAddress").appendChild(p);
  }

  return (
    <div className="App">
      <h1>Simple Mint NFT App</h1>
      <h2>Using web3Modal and NFT Labs SDK</h2>

      <div className="showConnectBtn">
        <Button type="primary" onClick={() => onConnect()}>
          Connect Wallet
        </Button>
      </div>
    </div>
  );
}
