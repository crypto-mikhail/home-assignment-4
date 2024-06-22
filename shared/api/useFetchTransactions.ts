import { useQuery } from 'react-query';
import { Alchemy, AssetTransfersCategory, Network } from 'alchemy-sdk';

import { getAlchemy } from '../utils/getAlchemy';

async function fetchTransactions(address: string, alchemy: Alchemy) {
  const response = await alchemy.core.getAssetTransfers({
    fromBlock: '0x0',
    fromAddress: address,
    category: [
      AssetTransfersCategory.EXTERNAL,
      AssetTransfersCategory.INTERNAL,
      AssetTransfersCategory.ERC20,
      AssetTransfersCategory.ERC721,
      AssetTransfersCategory.ERC1155,
    ],
    withMetadata: true,
    maxCount: 100,
  });

  return response.transfers;
}

export function useFetchTransactions(address: string, network: Network) {
  const alchemy = getAlchemy(network);

  return useQuery(
    ['transactions', address],
    () => {
      if (alchemy === undefined) return [];

      return fetchTransactions(address, alchemy);
    },
    {
      enabled: !!address && !!alchemy,
    }
  );
}
