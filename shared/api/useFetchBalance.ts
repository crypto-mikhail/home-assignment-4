import { useQuery } from 'react-query';
import { ethers } from 'ethers';
import { Network } from 'alchemy-sdk';

import { getAlchemy } from '../utils';

export async function fetchBalance(address: string, network: Network) {
  try {
    const alchemy = getAlchemy(network);
    const response = await alchemy.core.getBalance(address);
    const balanceInNativeAsset = ethers.formatEther(response._hex);

    return balanceInNativeAsset;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
}

export const useFetchBalance = (address: string, network: Network, initialData: string) => {
  return useQuery(['balance', address, network], () => fetchBalance(address, network), {
    enabled: !!address && !!network,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    initialData,
  });
};
