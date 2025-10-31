import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import { http } from 'wagmi';

// Define the Hedera Testnet chain configuration for Viem/Wagmi
export const hederaTestnet = defineChain({
  id: 296,
  name: 'Hedera Testnet',
  nativeCurrency: {
    name: 'HBAR',
    symbol: 'HBAR',
    decimals: 8, // HBAR has 8 decimal places
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.hashio.io/api'],
    },
  },
  testnet: true,
});

// Configure RainbowKit and Wagmi
export const config = getDefaultConfig({
  appName: 'AgriVault DAO',
  // IMPORTANT: Replace with your actual projectId from WalletConnect Cloud
  projectId: '51739b9dafb35a0539a875882cafc1bf', 
  chains: [hederaTestnet],
  // Use http transport for reliability
  transports: {
    [hederaTestnet.id]: http(),
  },
  ssr: false, // This is a client-side rendered Vite application
});