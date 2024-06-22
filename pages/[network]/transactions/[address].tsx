import { Box, CircularProgress, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { Network } from 'alchemy-sdk';
import React from 'react';

import { useFetchBalance, useFetchTransactions } from '../../../shared/api';
import { SortableTransactionList } from '../../../features/SortableTransactionList';
import LoadingIndicator from '../../../shared/ui/LoadingIndicator';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { address, network } = context.query;

  if (!address || !network) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      address,
      network,
    },
  };
};

const TransactionsPage = ({ address, network }: { address: string; network: Network }) => {
  const router = useRouter();
  const { data, error, isLoading } = useFetchTransactions(address, network);
  const { data: balance, isLoading: isBalanceLoading } = useFetchBalance(address, network);

  if (isLoading) return <CircularProgress />;
  if (error || !data) return <Typography>Error loading transactions</Typography>;

  const transactions = data.map((tx) => ({
    id: tx.uniqueId,
    hash: tx.hash,
    amount: (tx.value ?? 0).toString(),
    timestamp: new Date(tx.metadata.blockTimestamp).getTime() / 1000,
  }));

  const onClickHandler = () => {
    router.back();
  };

  return (
    <Box>
      <Link onClick={onClickHandler}>&larr; Back</Link>
      <Typography variant="h4">Transactions for {address?.toString()}</Typography>
      <Typography variant="h6">
        Selected network is {network === Network.ETH_MAINNET ? 'Ethereum' : 'Polygon'}
      </Typography>
      {isBalanceLoading ? (
        <LoadingIndicator />
      ) : (
        <Typography variant="body1" my={3}>
          Current Balance: {balance} {network === Network.ETH_MAINNET ? 'ETH' : 'MATIC'}
        </Typography>
      )}
      <SortableTransactionList transactions={transactions} network={network} />
    </Box>
  );
};

export default TransactionsPage;
