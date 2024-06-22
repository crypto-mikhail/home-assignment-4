import { Alchemy, Network } from 'alchemy-sdk';

import { networksConfig } from '../../app/configs';

export function getAlchemy(network: Network) {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: networksConfig[network],
  };
  return new Alchemy(config);
}
