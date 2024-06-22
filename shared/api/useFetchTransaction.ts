import { useQuery } from 'react-query';
import { Alchemy, Network } from 'alchemy-sdk';

import { getAlchemy } from '../utils/getAlchemy';

async function fetchTransaction(hash: string, alchemy: Alchemy) {
  const transaction = await alchemy.core.getTransaction(hash);
  const receipt = await alchemy.core.getTransactionReceipt(hash);
  return {
    ...transaction,
    ...receipt,
  };
}

export function useFetchTransaction(hash: string, network: Network) {
  const alchemy = getAlchemy(network);

  return useQuery(
    ['transaction', hash],
    () => {
      if (alchemy === undefined) return undefined;

      return fetchTransaction(hash, alchemy);
    },
    {
      enabled: !!hash && !!alchemy,
    }
  );
}
