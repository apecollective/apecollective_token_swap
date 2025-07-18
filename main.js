const connectBtn = document.getElementById("connectBtn");
const accountP = document.getElementById("account");

// Your WalletConnect project ID here:
const projectId = "YOUR_PROJECT_ID";

const web3Modal = new window.Web3Modal({
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
    provider = new window.ethers.BrowserProvider(instance);
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

if (web3Modal.cachedProvider) {
  connectWallet();
}
