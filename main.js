import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';
import { configureChains, createConfig, getAccount, watchAccount } from '@wagmi/core';
import { mainnet, avalanche } from '@wagmi/core/chains';
import { ethers } from 'ethers';

// WalletConnect Project ID
const projectId = 'c03b6a909922b731fa377f3e996455d5';

// Configure chains
const { chains, publicClient } = configureChains(
  [avalanche],
  [w3mProvider({ projectId })]
);

// Create wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
});

// Init Web3Modal
const ethereumClient = new EthereumClient(wagmiConfig, chains);
const modal = new Web3Modal({ projectId, themeMode: 'dark' }, ethereumClient);

// DOM
const connectBtn = document.getElementById('connectBtn');
const accountDisplay = document.getElementById('account');

// Connect wallet
connectBtn.addEventListener('click', async () => {
  modal.openModal();
});

// Watch account changes
watchAccount((account) => {
  if (account?.address) {
    accountDisplay.textContent = `Connected: ${account.address}`;
    connectBtn.textContent = 'Disconnect';
  } else {
    accountDisplay.textContent = '';
    connectBtn.textContent = 'Connect Wallet';
  }
});
