import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  created_at: string;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    try {
      // Get transactions from localStorage
      const storedTransactions = localStorage.getItem('transactions');
      const parsedTransactions = storedTransactions ? JSON.parse(storedTransactions) : [];
      
      // Filter transactions for current user
      const userTransactions = parsedTransactions.filter(
        (t: Transaction) => t.user_id === user.id
      );
      
      setTransactions(userTransactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { transactions, loading, error };
}; 