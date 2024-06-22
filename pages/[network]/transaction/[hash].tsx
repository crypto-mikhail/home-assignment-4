import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Link, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { Network } from 'alchemy-sdk';

import { useFetchTransaction } from '../../../shared/api';
import { TransactionDetails } from '../../../widget/transaction';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { hash, network } = context.query;

  if (!hash || !network) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      hash,
      network,
    },
  };
};

const TransactionDetailsPage = ({ hash, network }: { hash: string; network: Network }) => {
  const router = useRouter();

  const { data, error, isLoading } = useFetchTransaction(hash, network);

  if (isLoading) return <CircularProgress />;
  if (error || !data) return <Typography>Error loading transaction details</Typography>;

  const { transactionHash, from, to, value, blockNumber, status, gasUsed, effectiveGasPrice } =
    data;

  const transaction = {
    hash: transactionHash ?? '',
    from: from ?? '',
    to: to ?? '',
    amount: value ? ethers.formatEther(value.toString()) : '0',
    timestamp: blockNumber ?? 0,
    status: status === 1 ? 'Successful' : 'Failed',
    fee:
      gasUsed && effectiveGasPrice
        ? ethers.formatEther(gasUsed.mul(effectiveGasPrice).toString())
        : '0',
  };

  const onClickHandler = () => {
    router.back();
  };

  return (
    <Box>
      <Link onClick={onClickHandler}>&larr; Back</Link>
      <Typography variant="h4">Transaction Details</Typography>
      <TransactionDetails network={network} {...transaction} />
    </Box>
  );
};

export default TransactionDetailsPage;
