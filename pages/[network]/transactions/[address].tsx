import { Box, CircularProgress, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { AssetTransfersWithMetadataResult, Network } from 'alchemy-sdk';
import React from 'react';

import {
  fetchBalance,
  fetchTransactions,
  useFetchBalance,
  useFetchTransactions,
} from '../../../shared/api';
import { SortableTransactionList } from '../../../features/SortableTransactionList';
import LoadingIndicator from '../../../shared/ui/LoadingIndicator';
import { shortenHash, useIsMobile } from '../../../shared/utils';

interface TransactionsPageProps {
  address: string;
  network: Network;
  initialData: {
    transactions: AssetTransfersWithMetadataResult[];
    balance: string;
  };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { address, network } = context.query;

  if (!address || !network) {
    return {
      notFound: true,
    };
  }

  const transactions = await fetchTransactions(address as string, network as Network);
  const balance = await fetchBalance(address as string, network as Network);

  return {
    props: {
      address,
      network,
      initialData: {
        transactions,
        balance,
      },
    },
  };
};

const TransactionsPage = ({ address, network, initialData }: TransactionsPageProps) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const { data, error, isLoading } = useFetchTransactions(
    address,
    network,
    initialData.transactions
  );
  const { data: balance, isLoading: isBalanceLoading } = useFetchBalance(
    address,
    network,
    initialData.balance
  );

  if (isLoading) return <CircularProgress />;
  if (error || !data) return <Typography>Error loading transactions</Typography>;

  const transactions = data.map((tx) => ({
    id: tx.uniqueId,
    hash: tx.hash,
    amount: (tx.value ?? 0).toString(),
    timestamp: new Date(tx.metadata.blockTimestamp).getTime() / 1000,
  }));

  const onClickHandler = () => {
    router.push('/');
  };

  return (
    <Box
      sx={{
        padding: isMobile ? '16px' : '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      maxWidth={isMobile ? '100%' : '800px'}
      mx="auto"
    >
      <Link onClick={onClickHandler} sx={{ alignSelf: 'flex-start', cursor: 'pointer', mb: 2 }}>
        &larr; Back
      </Link>
      <Typography variant={isMobile ? 'h5' : 'h4'} align="center">
        Transactions for {shortenHash(address?.toString())}
      </Typography>
      <Typography variant={isMobile ? 'h6' : 'h6'} align="center" gutterBottom>
        Selected network is {network === Network.ETH_MAINNET ? 'Ethereum' : 'Polygon'}
      </Typography>
      {isBalanceLoading ? (
        <LoadingIndicator />
      ) : (
        <Typography variant="body1" my={3} align="center">
          Current Balance: {balance} {network === Network.ETH_MAINNET ? 'ETH' : 'MATIC'}
        </Typography>
      )}
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <SortableTransactionList transactions={transactions} network={network} />
      </Box>
    </Box>
  );
};

export default TransactionsPage;
