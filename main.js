import { Web3Modal } from '@web3modal/standalone';
import { ethers } from 'ethers';

const connectBtn = document.getElementById('connectBtn');
const accountDisplay = document.getElementById('account');

const web3Modal = new Web3Modal({
  projectId: 'c03b6a909922b731fa377f3e996455d5', // Use your WalletConnect projectId
  themeMode: 'dark',
  walletConnectVersion: 2,
  standaloneChains: ['eip155:43114'] // AVAX C-Chain
});

let provider = null;
let signer = null;

connectBtn.addEventListener('click', async () => {
  try {
    const instance = await web3Modal.connect();
    provider = new ethers.BrowserProvider(instance);
    signer = await provider.getSigner();

    const address = await signer.getAddress();
    accountDisplay.textContent = `Connected: ${address}`;
    connectBtn.textContent = 'Disconnect';

    connectBtn.onclick = () => {
      web3Modal.clearCachedProvider();
      provider = null;
      signer = null;
      accountDisplay.textContent = '';
      connectBtn.textContent = 'Connect Wallet';
    };
  } catch (err) {
    console.error('Connection failed:', err);
  }
});
