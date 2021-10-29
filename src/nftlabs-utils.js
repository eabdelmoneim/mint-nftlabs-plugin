const { NFTLabsSDK } = require("@nftlabs/sdk");

const { ethers } = require('ethers');

let dAppWallet = null;
let sdk = null;
let sdkProvider = null;
let appModule = null;
let nftModule = null;

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
    console.log(`initialized SDK connection`);

    const apps = await sdk.getApps();
    if(apps.length > 0) {
        appModule = apps[0];
        console.log(`Found App: ${appModule.metadata.name} = ${appModule.address}`);

        // initialize nft module
        if(process.env.REACT_APP_NFT_MODULE_ADDRESS != null) {
            nftModule = sdk.getNFTModule(process.env.REACT_APP_NFT_MODULE_ADDRESS);
            console.log(`found NFT Module with address ${process.env.REACT_APP_NFT_MODULE_ADDRESS}`)
        }
    } else {
        throw Error(`no apps defined in thirdweb console`)
    }

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

export async function mintNFT(uri, toAccount) {
    
    // verify SDK has been initialized
    // if not initialize here
    if(nftModule == null) {
        initializeSDKConnections();
    }


    console.log(`minting to ${toAccount} with uri ${uri}`)
    let nftMetadata = await nftModule.mintTo(toAccount, uri); 
    console.log(`successfully minted NFT ${nftMetadata.id}`);
    
}
