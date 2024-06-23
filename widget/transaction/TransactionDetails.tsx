import { Box, Typography, Link } from '@mui/material';
import { Network } from 'alchemy-sdk';

import { shortenHash } from '../../shared/utils';

interface TransactionDetailsProps {
  network: Network;
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  status: string;
  fee: string;
}

export function TransactionDetails({
  network,
  hash,
  from,
  to,
  amount,
  timestamp,
  status,
  fee,
}: TransactionDetailsProps) {
  const blockScanLink = `https://${network === Network.ETH_MAINNET ? 'etherscan.io' : 'polygonscan.com'}/tx/${hash}`;

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Typography>
        Hash:{' '}
        <Link href={blockScanLink} target="_blank" underline="hover">
          {shortenHash(hash)}
        </Link>
      </Typography>
      <Typography>From: {from}</Typography>
      <Typography>To: {to}</Typography>
      <Typography>
        Amount: {amount} {network === Network.ETH_MAINNET ? 'ETH' : 'MATIC'}
      </Typography>
      <Typography>Block Number: {timestamp}</Typography>
      <Typography>Status: {status}</Typography>
      {status === 'Successful' && <Typography>Transaction Fee: {fee}</Typography>}
    </Box>
  );
}
