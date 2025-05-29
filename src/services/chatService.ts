import { Transaction } from "@/hooks/useTransactions";
import { Budget } from "@/hooks/useBudgets";

interface ChatResponse {
  content: string;
  error?: string;
}

export const processFinancialQuery = async (
  query: string,
  transactions: Transaction[],
  budgets: Budget[]
): Promise<ChatResponse> => {
  try {
    // Calculate total income and expenses
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate category-wise expenses
    const categoryExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Calculate budget utilization
    const budgetUtilization = budgets.reduce((acc, b) => {
      acc[b.category] = {
        budget: b.amount,
        spent: b.spent,
        remaining: b.amount - b.spent,
        percentage: (b.spent / b.amount) * 100
      };
      return acc;
    }, {} as Record<string, { budget: number; spent: number; remaining: number; percentage: number }>);

    // Process the query and generate response
    let response = '';

    if (query.toLowerCase().includes('spend') || query.toLowerCase().includes('expense')) {
      // Handle spending/expense related queries
      const category = Object.keys(categoryExpenses).find(cat => 
        query.toLowerCase().includes(cat.toLowerCase())
      );

      if (category) {
        const amount = categoryExpenses[category];
        const budget = budgetUtilization[category];
        response = `You have spent $${amount.toFixed(2)} on ${category}. `;
        if (budget) {
          response += `This is ${budget.percentage.toFixed(1)}% of your ${category} budget. You have $${budget.remaining.toFixed(2)} remaining.`;
        }
      } else {
        response = `Your total expenses are $${totalExpenses.toFixed(2)}. `;
        const topCategory = Object.entries(categoryExpenses)
          .sort(([, a], [, b]) => b - a)[0];
        if (topCategory) {
          response += `Your highest spending category is ${topCategory[0]} at $${topCategory[1].toFixed(2)}.`;
        }
      }
    } else if (query.toLowerCase().includes('income') || query.toLowerCase().includes('earn')) {
      // Handle income related queries
      response = `Your total income is $${totalIncome.toFixed(2)}. `;
      const netSavings = totalIncome - totalExpenses;
      response += `After expenses, you have $${netSavings.toFixed(2)} remaining.`;
    } else if (query.toLowerCase().includes('budget')) {
      // Handle budget related queries
      const category = Object.keys(budgetUtilization).find(cat => 
        query.toLowerCase().includes(cat.toLowerCase())
      );

      if (category) {
        const budget = budgetUtilization[category];
        response = `Your ${category} budget is $${budget.budget.toFixed(2)}. `;
        response += `You have spent $${budget.spent.toFixed(2)} (${budget.percentage.toFixed(1)}%) and have $${budget.remaining.toFixed(2)} remaining.`;
      } else {
        response = 'Here are your budget details:\n';
        Object.entries(budgetUtilization).forEach(([category, details]) => {
          response += `\n${category}: $${details.budget.toFixed(2)} budget, $${details.spent.toFixed(2)} spent (${details.percentage.toFixed(1)}%), $${details.remaining.toFixed(2)} remaining`;
        });
      }
    } else if (query.toLowerCase().includes('saving') || query.toLowerCase().includes('save')) {
      // Handle savings related queries
      const netSavings = totalIncome - totalExpenses;
      const savingsRate = (netSavings / totalIncome) * 100;
      
      response = `Your current savings are $${netSavings.toFixed(2)}, which is ${savingsRate.toFixed(1)}% of your income. `;
      
      if (netSavings < 0) {
        response += 'You are currently spending more than you earn. Consider reducing expenses in your highest spending categories.';
      } else {
        const topExpense = Object.entries(categoryExpenses)
          .sort(([, a], [, b]) => b - a)[0];
        if (topExpense) {
          response += `To increase savings, you could look into reducing your ${topExpense[0]} expenses, which are currently at $${topExpense[1].toFixed(2)}.`;
        }
      }
    } else {
      // Generic response for other queries
      response = `I can help you analyze your finances. You have $${totalIncome.toFixed(2)} in income and $${totalExpenses.toFixed(2)} in expenses. `;
      response += `Your net savings are $${(totalIncome - totalExpenses).toFixed(2)}. `;
      response += 'You can ask me about specific categories, budgets, or savings for more detailed information.';
    }

    return { content: response };
  } catch (error) {
    console.error('Error processing financial query:', error);
    return {
      content: 'I apologize, but I encountered an error while processing your query. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}; 