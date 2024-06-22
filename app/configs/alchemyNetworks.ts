import { Network } from 'alchemy-sdk';

export const networksConfig: Partial<{ [key in Network]: Network }> = {
  [Network.ETH_MAINNET]: Network.ETH_MAINNET,
  [Network.MATIC_MAINNET]: Network.MATIC_MAINNET,
};
