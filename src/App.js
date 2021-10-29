import React from "react";
import "./styles.css";
import "antd/dist/antd.css";
import { Button } from "antd";
import "./nftlabs-utils";

import { initializeSDKConnections, queryApps } from "./nftlabs-utils";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider"

const {NFTLabsSDK} = require("@nftlabs/sdk");
const { ethers } = require('ethers')



const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      // hard coded test key will be parameter
      infuraId: `${process.env.REACT_APP_INFURA_ID}`,
    }
  }
};

let provider = null;
let web3 = null;
let accounts = null;
let mintSDK = null;
let sdkProvider = null;

let nftURI = null;

export default function App() {
  async function mint() {
    if (!provider) {
      const web3Modal = new Web3Modal({
        network: "mumbai",
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
    const chainId = await web3.eth.getChainId();
    console.log(`chain ID ${chainId}`);

    // init SDK connections
    initializeSDKConnections();

   // mintSDK = new NFTLabsSDK(web3.eth.provider);
   // console.log(`initialized SDK connection`);
    queryApps();
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

  if(!nftURI){
    print("ERROR: set URI to mint");
    return;
  }

  const web3Modal = new Web3Modal({
    network: "mumbai",
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
    document.getElementById("statusArea").appendChild(p);
  }

  function setURIValue(path) {
    nftURI = path;
    console.log(`URI to NFT set to ${nftURI}`);
  }

  return (
    <div className="App">
      <h1>Simple Mint NFT App</h1>
      <h2>Using web3Modal and NFT Labs SDK</h2>
      <div className="nftURI">
        Metadata URI <input onChange={e => setURIValue(e.target.value)} placeholder="path to URI file" size="100"/> 
      </div>
      <div className="showConnectBtn">
        <br/>
        <Button id="mintButton" type="primary" onClick={() => onConnect()}>
          Mint NFT
        </Button>
        <label id="statusArea" style={{color:'tomato'}}></label>
      </div>
      
    </div>
  );
}
