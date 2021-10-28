const { NFTLabsSDK } = require("@nftlabs/sdk");

const { ethers } = require('ethers');

let dAppWallet = null;
let sdk = null;
let sdkProvider = null;

export async function initializeSDKConnections() {
    console.log(`=== initializing SDK connections ===`);
    console.log(`env vars: ${process.env.REACT_APP_PROVIDER_URL} and ${process.env.REACT_APP_ADMIN_WALLET_PRIVATE_KEY}`)
    if(process.env.REACT_APP_PROVIDER_URL==null || process.env.REACT_APP_ADMIN_WALLET_PRIVATE_KEY==null){
      throw Error('PROVIDER_URL, ADMIN_WALLET_PRIVATE_KEY must be defined in .env')
    }
    
    // instantiate two SDK connections one so we can switch b/w role Admin and role client
    sdkProvider = new ethers.providers.JsonRpcProvider(`${process.env.REACT_APP_PROVIDER_URL}`);
    dAppWallet = new ethers.Wallet(`${process.env.REACT_APP_ADMIN_WALLET_PRIVATE_KEY}`, sdkProvider); 
    sdk = new NFTLabsSDK(dAppWallet);
    console.log(`initialized admin SDK connection`)
    //clientSdk = new NFTLabsSDK(clientWallet)
    //console.log(`initialized client SDK connection`)
  }

export async function queryApps(){ 

    console.log(`=== Query Apps ===`)
    // let's traverse the apps=>modules tree
    const apps = await sdk.getApps()
    if(apps.length > 0) {   
      for(const app of apps) {    
          console.log(`Found App: ${app.metadata.name} = ${app.address}`) 
      }
    } else {
      throw Error(`could not find any apps associated with ${sdk.address} - you need to use private key of wallet used to create apps in Console UI`)
    }
  }