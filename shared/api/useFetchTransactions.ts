import { useQuery } from 'react-query';
import { AssetTransfersCategory, AssetTransfersWithMetadataResult, Network } from 'alchemy-sdk';

import { getAlchemy } from '../utils';

export async function fetchTransactions(address: string, network: Network) {
  try {
    const alchemy = getAlchemy(network);
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
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

export function useFetchTransactions(
  address: string,
  network: Network,
  initialData: AssetTransfersWithMetadataResult[]
) {
  return useQuery(['transactions', address, network], () => fetchTransactions(address, network), {
    enabled: !!address && !!network,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    initialData,
  });
}
