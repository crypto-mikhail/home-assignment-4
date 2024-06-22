import React, { useState } from 'react';
import { Network } from 'alchemy-sdk';

import { TransactionList } from '../../widget/transaction';
import { Transaction } from '../../shared/types';

interface SortableTransactionListProps {
  transactions: Transaction[];
  network: Network;
}

export function SortableTransactionList({ transactions, network }: SortableTransactionListProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: 'asc' | 'desc';
  }>({ key: 'timestamp', direction: 'asc' });

  const handleSortChange = (key: keyof Transaction) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <TransactionList
      transactions={transactions}
      sortConfig={sortConfig}
      onSortChange={handleSortChange}
      network={network}
    />
  );
}

export default SortableTransactionList;
