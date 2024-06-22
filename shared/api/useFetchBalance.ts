import { useQuery } from 'react-query';
import { ethers } from 'ethers';
import { Alchemy, Network } from 'alchemy-sdk';

import { getAlchemy } from '../utils/getAlchemy';

const fetchBalance = async (address: string, alchemy: Alchemy) => {
  const response = await alchemy.core.getBalance(address);
  const balanceInNativeAsset = ethers.formatEther(response._hex);

  return balanceInNativeAsset;
};

export const useFetchBalance = (address: string, network: Network) => {
  const alchemy = getAlchemy(network);

  return useQuery(
    ['balance', address],
    () => {
      if (alchemy === undefined) return undefined;

      return fetchBalance(address, alchemy);
    },
    {
      enabled: !!address && !!alchemy,
    }
  );
};
