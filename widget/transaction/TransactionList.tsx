import React from 'react';
import {
  Box,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { useRouter } from 'next/router';
import { Network } from 'alchemy-sdk';

import { formatDate, formatAmount } from '../../shared/utils';
import { Transaction } from '../../shared/types';

interface TransactionListProps {
  transactions: Transaction[];
  sortConfig: { key: keyof Transaction; direction: 'asc' | 'desc' };
  onSortChange: (key: keyof Transaction) => void;
  network: Network;
}

export function TransactionList({
  transactions,
  sortConfig,
  onSortChange,
  network,
}: TransactionListProps) {
  const router = useRouter();

  const sortedTransactions = [...transactions].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === 'amount') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleLinkClick = (hash: string) => {
    router.push(`/${network}/transaction/${hash}`).catch(console.error);
  };

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortConfig.key === 'timestamp'}
                direction={sortConfig.direction}
                onClick={() => onSortChange('timestamp')}
              >
                Timestamp
              </TableSortLabel>
            </TableCell>
            <TableCell>Hash</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortConfig.key === 'amount'}
                direction={sortConfig.direction}
                onClick={() => onSortChange('amount')}
              >
                Amount
              </TableSortLabel>
            </TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedTransactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>{formatDate(tx.timestamp)}</TableCell>
              <TableCell>{tx.hash}</TableCell>
              <TableCell>{formatAmount(tx.amount)}</TableCell>
              <TableCell>
                <Link onClick={() => handleLinkClick(tx.hash)} underline="hover">
                  View Details
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
