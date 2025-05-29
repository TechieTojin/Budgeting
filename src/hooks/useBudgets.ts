import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'yearly';
  created_at: string;
}

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    try {
      // Get budgets from localStorage
      const storedBudgets = localStorage.getItem('budgets');
      const parsedBudgets = storedBudgets ? JSON.parse(storedBudgets) : [];
      
      // Filter budgets for current user
      const userBudgets = parsedBudgets.filter(
        (b: Budget) => b.user_id === user.id
      );
      
      setBudgets(userBudgets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { budgets, loading, error };
}; 