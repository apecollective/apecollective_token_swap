const connectBtn = document.getElementById("connectBtn");
const accountP = document.getElementById("account");

const projectId = "YOUR_PROJECT_ID"; // Replace with your actual WalletConnect project ID

const web3Modal = new window.WalletConnectModal.default({
  projectId,
  standaloneChains: ["eip155:43114"], // Avalanche C-Chain
  themeMode: "dark"
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
  } catch (e) {
    console.error("Connection failed:", e);
    accountP.textContent = "Connection failed: " + e.message;
  }
}

async function disconnectWallet() {
  await web3Modal.clear();
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

if (web3Modal.getIsConnected?.()) {
  connectWallet();
}
