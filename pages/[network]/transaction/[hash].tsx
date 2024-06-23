import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Link, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { Network } from 'alchemy-sdk';
import { BigNumber } from '@ethersproject/bignumber';

import { fetchTransaction, TransactionWithValue, useFetchTransaction } from '../../../shared/api';
import { TransactionDetails } from '../../../widget/transaction';
import { useIsMobile } from '../../../shared/utils';

interface TransactionDetailsPage {
  hash: string;
  network: Network;
  initialData: {
    transaction: TransactionWithValue;
  };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { hash, network } = context.query;

  if (!hash || !network) {
    return {
      notFound: true,
    };
  }

  const transaction = await fetchTransaction(hash as string, network as Network);

  return {
    props: {
      hash,
      network,
      initialData: {
        transaction,
      },
    },
  };
};

const TransactionDetailsPage = ({ hash, network, initialData }: TransactionDetailsPage) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const { data, error, isLoading } = useFetchTransaction(hash, network, initialData.transaction);

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
        ? ethers.formatEther(BigNumber.from(gasUsed).mul(effectiveGasPrice).toString())
        : '0',
  };

  const onClickHandler = () => {
    router.back();
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
      <Typography variant={isMobile ? 'h5' : 'h4'} align="center" gutterBottom>
        Transaction Details
      </Typography>
      <TransactionDetails network={network} {...transaction} />
    </Box>
  );
};

export default TransactionDetailsPage;
