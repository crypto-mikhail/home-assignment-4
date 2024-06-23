import { useQuery } from 'react-query';
import { Network, TransactionReceipt } from 'alchemy-sdk';

import { getAlchemy } from '../utils';

export type TransactionWithValue = Omit<TransactionReceipt, 'gasUsed' | 'effectiveGasPrice'> & {
  gasUsed: string;
  cumulativeGasUsed: string;
  effectiveGasPrice: string;
  value: string;
};

export async function fetchTransaction(hash: string, network: Network) {
  try {
    const alchemy = getAlchemy(network);
    const transaction = await alchemy.core.getTransaction(hash);
    const receipt = await alchemy.core.getTransactionReceipt(hash);

    return {
      ...receipt,
      value: transaction?.value.toString(),
      gasUsed: receipt?.gasUsed.toString(),
      effectiveGasPrice: receipt?.effectiveGasPrice.toString(),
      cumulativeGasUsed: receipt?.cumulativeGasUsed.toString(),
    };
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
}

export function useFetchTransaction(
  hash: string,
  network: Network,
  initialData: TransactionWithValue
) {
  return useQuery(['transaction', hash], () => fetchTransaction(hash, network), {
    enabled: !!hash && !!network,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    initialData,
  });
}
