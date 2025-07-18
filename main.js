import { Web3Modal } from "https://cdn.jsdelivr.net/npm/@web3modal/standalone@2.4.1/dist/index.esm.js";
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.10.0/dist/ethers.esm.min.js";

const connectBtn = document.getElementById("connectBtn");
const accountP = document.getElementById("account");

// Replace with your WalletConnect Cloud Project ID from https://cloud.walletconnect.com
const projectId = "c03b6a909922b731fa377f3e996455d5";

const web3Modal = new Web3Modal({
  projectId,
  walletConnectVersion: 2,
  themeMode: "dark",
  chains: [
    {
      chainId: 43114,
      name: "Avalanche C-Chain",
      rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
      currency: "AVAX",
    },
  ],
});

let provider = null;
let signer = null;

async function connectWallet() {
  try {
    const instance = await web3Modal.connect();
    provider = new ethers.BrowserProvider(instance);
    signer = await provider.getSigner();
    const address = await signer.getAddress();
    accountP.textContent = `Connected: ${address}`;
    connectBtn.textContent = "Disconnect Wallet";

    instance.on("accountsChanged", () => window.location.reload());
    instance.on("disconnect", () => disconnectWallet());
  } catch (e) {
    console.error("Connection failed:", e);
    accountP.textContent = "Connection failed: " + e.message;
  }
}

async function disconnectWallet() {
  if (provider?.provider?.disconnect) {
    await provider.provider.disconnect();
  }
  await web3Modal.clearCachedProvider();
  provider = null;
  signer = null;
  accountP.textContent = "";
  connectBtn.textContent = "Connect Wallet";
}

connectBtn.addEventListener("click", () => {
  if (signer) {
    disconnectWallet();
  } else {
    connectWallet();
  }
});

// Auto connect cached wallet
if (web3Modal.cachedProvider) {
  connectWallet();
}
