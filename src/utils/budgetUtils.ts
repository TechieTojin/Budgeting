// Budget utility functions for AI-powered insights

import { detectCategory } from "./transactionUtils";

// Types
export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  category: string;
  description: string;
  type: "expense" | "income";
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export interface BudgetPrediction {
  category: string;
  currentSpent: number;
  predictedTotal: number;
  predictedOverspend: number;
  riskLevel: "low" | "medium" | "high";
}

export interface BudgetInsight {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'success';
  category?: string;
  impact?: number;
}

export interface SpendingPattern {
  category: string;
  pattern: "increasing" | "decreasing" | "fluctuating" | "stable";
  percentageChange: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'reallocation' | 'savings' | 'adjustment';
  category?: string;
  impact?: number;
}

/**
 * Predict end-of-month spending based on current patterns
 * 
 * @param transactions Recent transactions (ideally from current month)
 * @param budgets Current budget limits by category
 * @param dayOfMonth Current day of month (1-31)
 * @returns Predictions for each budget category
 */
export const predictMonthlySpending = (
  transactions: Transaction[],
  budgets: Budget[],
  dayOfMonth: number
): BudgetPrediction[] => {
  // Group transactions by category
  const expensesByCategory: Record<string, number> = {};
  
  // Filter to only expenses from current month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthExpenses = transactions.filter(
    t => t.type === "expense" && 
    t.date.getMonth() === currentMonth &&
    t.date.getFullYear() === currentYear
  );

  // Sum expenses by category
  currentMonthExpenses.forEach(transaction => {
    const { category, amount } = transaction;
    expensesByCategory[category] = (expensesByCategory[category] || 0) + amount;
  });

  // Calculate average daily spending for each category
  const avgDailySpendingByCategory: Record<string, number> = {};
  Object.keys(expensesByCategory).forEach(category => {
    avgDailySpendingByCategory[category] = expensesByCategory[category] / dayOfMonth;
  });

  // Estimate total monthly spending using daily average and days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  return budgets.map(budget => {
    const { category, limit } = budget;
    const currentSpent = expensesByCategory[category] || 0;
    const avgDailySpending = avgDailySpendingByCategory[category] || 0;
    
    // Project spending for remaining days
    const remainingDays = daysInMonth - dayOfMonth;
    const projectedAdditional = avgDailySpending * remainingDays;
    const predictedTotal = currentSpent + projectedAdditional;
    const predictedOverspend = predictedTotal - limit;
    
    // Determine risk level
    let riskLevel: "low" | "medium" | "high" = "low";
    if (predictedOverspend > 0) {
      const overBudgetPercentage = (predictedOverspend / limit) * 100;
      riskLevel = overBudgetPercentage > 20 ? "high" : "medium";
    } else if (predictedTotal / limit > 0.85) {
      riskLevel = "medium";
    }
    
    return {
      category,
      currentSpent,
      predictedTotal,
      predictedOverspend: Math.max(0, predictedOverspend),
      riskLevel
    };
  });
};

/**
 * Analyze spending patterns over multiple months
 * 
 * @param transactions Transactions from the last several months
 * @param lookbackMonths Number of months to analyze
 * @returns Analysis of spending patterns by category
 */
export const analyzeSpendingPatterns = (
  transactions: Transaction[],
  lookbackMonths: number = 3
): SpendingPattern[] => {
  // Get the start date for our analysis period
  const currentDate = new Date();
  const startDate = new Date();
  startDate.setMonth(currentDate.getMonth() - lookbackMonths);
  
  // Filter to relevant transactions
  const relevantTransactions = transactions.filter(
    t => t.type === "expense" && t.date >= startDate
  );
  
  // Group transactions by month and category
  const spendingByMonthAndCategory: Record<string, Record<string, number>> = {};
  
  relevantTransactions.forEach(transaction => {
    const { date, category, amount } = transaction;
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    
    if (!spendingByMonthAndCategory[monthKey]) {
      spendingByMonthAndCategory[monthKey] = {};
    }
    
    spendingByMonthAndCategory[monthKey][category] = (spendingByMonthAndCategory[monthKey][category] || 0) + amount;
  });
  
  // Get all months in chronological order
  const months = Object.keys(spendingByMonthAndCategory).sort();
  
  // Get all unique categories
  const categories = new Set<string>();
  Object.values(spendingByMonthAndCategory).forEach(categoryMap => {
    Object.keys(categoryMap).forEach(category => categories.add(category));
  });
  
  // Analyze patterns for each category
  return Array.from(categories).map(category => {
    const monthlyAmounts = months.map(month => spendingByMonthAndCategory[month][category] || 0);
    
    // Need at least 2 months of data to detect a pattern
    if (monthlyAmounts.length < 2) {
      return {
        category,
        pattern: "stable",
        percentageChange: 0
      };
    }
    
    // Calculate percentage changes between consecutive months
    const percentageChanges = [];
    for (let i = 1; i < monthlyAmounts.length; i++) {
      const prevAmount = monthlyAmounts[i - 1];
      const currentAmount = monthlyAmounts[i];
      
      if (prevAmount === 0) continue;
      
      const change = ((currentAmount - prevAmount) / prevAmount) * 100;
      percentageChanges.push(change);
    }
    
    // Calculate average percentage change
    const avgPercentageChange = percentageChanges.length > 0
      ? percentageChanges.reduce((sum, change) => sum + change, 0) / percentageChanges.length
      : 0;
    
    // Determine pattern
    let pattern: "increasing" | "decreasing" | "fluctuating" | "stable";
    
    if (Math.abs(avgPercentageChange) < 5) {
      pattern = "stable";
    } else if (avgPercentageChange > 0) {
      pattern = "increasing";
    } else {
      pattern = "decreasing";
    }
    
    // Check for fluctuation
    const hasFluctuation = percentageChanges.some((change, i) => {
      if (i === 0) return false;
      return Math.sign(change) !== Math.sign(percentageChanges[i - 1]);
    });
    
    if (hasFluctuation && percentageChanges.length > 1) {
      pattern = "fluctuating";
    }
    
    return {
      category,
      pattern,
      percentageChange: avgPercentageChange
    };
  });
};

/**
 * Generate personalized insights based on transaction and budget data
 * 
 * @param transactions Recent transactions
 * @param budgets Budget information
 * @param predictions Budget predictions
 * @param patterns Spending patterns
 * @returns List of insights sorted by priority
 */
export const generateInsights = (
  transactions: Transaction[],
  budgets: Budget[],
  predictions: BudgetPrediction[],
  patterns: SpendingPattern[]
): BudgetInsight[] => {
  const insights: BudgetInsight[] = [];
  
  // Check for categories at risk of overspending
  predictions.forEach(prediction => {
    if (prediction.riskLevel === "high") {
      insights.push({
        id: `ins-${insights.length + 1}`,
        title: "High Risk of Overspending",
        description: `You're on track to exceed your ${prediction.category} budget by ${prediction.predictedOverspend.toFixed(2)}.`,
        type: 'warning',
        category: prediction.category,
        impact: prediction.predictedOverspend
      });
    } else if (prediction.riskLevel === "medium") {
      insights.push({
        id: `ins-${insights.length + 1}`,
        title: "Medium Risk of Overspending",
        description: `You may exceed your ${prediction.category} budget this month.`,
        type: 'warning',
        category: prediction.category,
        impact: prediction.predictedOverspend
      });
    }
  });
  
  // Analyze spending patterns
  patterns.forEach(pattern => {
    if (pattern.pattern === "increasing" && pattern.percentageChange > 15) {
      insights.push({
        id: `ins-${insights.length + 1}`,
        title: "Spending Trend",
        description: `Your ${pattern.category} spending has increased by ${pattern.percentageChange.toFixed(0)}% over the last few months.`,
        type: 'info',
        category: pattern.category,
        impact: pattern.percentageChange
      });
    } else if (pattern.pattern === "decreasing" && pattern.percentageChange < -15) {
      insights.push({
        id: `ins-${insights.length + 1}`,
        title: "Spending Trend",
        description: `You've reduced your ${pattern.category} spending by ${Math.abs(pattern.percentageChange).toFixed(0)}% over the last few months.`,
        type: 'info',
        category: pattern.category,
        impact: pattern.percentageChange
      });
    }
  });

  // Check for unusual spending patterns
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get transactions from current month
  const currentMonthTransactions = transactions.filter(
    t => t.date.getMonth() === currentMonth && t.date.getFullYear() === currentYear
  );
  
  // Look for large individual transactions
  const largeTransactions = currentMonthTransactions.filter(t => {
    const budget = budgets.find(b => b.category === t.category);
    if (!budget) return false;
    
    // Transaction is considered large if it's more than 40% of the monthly budget
    return t.amount > (budget.limit * 0.4);
  });
  
  if (largeTransactions.length > 0) {
    largeTransactions.forEach(transaction => {
      insights.push({
        id: `ins-${insights.length + 1}`,
        title: "Large Transaction",
        description: `You made a large ${transaction.category} purchase of ${transaction.amount.toFixed(2)} on ${transaction.date.toLocaleDateString()}.`,
        type: 'info',
        category: transaction.category,
        impact: transaction.amount
      });
    });
  }
  
  // Sort insights by priority
  return insights.sort((a, b) => {
    const priorityMap = { high: 0, medium: 1, low: 2 };
    return priorityMap[a.impact as number] - priorityMap[b.impact as number];
  });
};

/**
 * Generate smart recommendations based on budget data and insights
 * 
 * @param budgets Current budgets
 * @param predictions Budget predictions
 * @param patterns Spending patterns
 * @param transactions Recent transactions
 * @returns List of recommendations
 */
export const generateRecommendations = (
  budgets: Budget[],
  predictions: BudgetPrediction[],
  patterns: SpendingPattern[],
  transactions: Transaction[]
): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  let id = 1;
  
  // Check for categories that are likely to go over budget
  predictions
    .filter(p => p.riskLevel === "high" || p.riskLevel === "medium")
    .forEach(prediction => {
      const budget = budgets.find(b => b.category === prediction.category);
      if (!budget) return;
      
      // Calculate how much they need to reduce spending
      const dailyTarget = (budget.limit - prediction.currentSpent) / (new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate());
      
      recommendations.push({
        id: `rec-${id++}`,
        title: "Reduce Spending",
        description: `Limit your ${prediction.category} spending to ${dailyTarget.toFixed(2)} per day for the rest of the month to stay within budget.`,
        type: 'adjustment',
        category: prediction.category,
        impact: prediction.riskLevel === "high" ? 1 : 0.5
      });
    });
  
  // Find categories with high spending but consistently under budget
  const underUtilizedCategories = budgets.filter(budget => {
    // Categories that use less than 70% of their budget consistently
    return budget.percentage < 70;
  });
  
  // Find categories with consistent overspending
  const overBudgetCategories = budgets.filter(budget => {
    return budget.percentage > 100;
  });
  
  // Recommend budget reallocation if appropriate
  if (underUtilizedCategories.length > 0 && overBudgetCategories.length > 0) {
    const sourceCategory = underUtilizedCategories[0];
    const targetCategory = overBudgetCategories[0];
    
    const suggestedAmount = Math.min(
      sourceCategory.limit * 0.2, // 20% of under-utilized budget
      targetCategory.spent - targetCategory.limit // amount over budget
    );
    
    if (suggestedAmount > 0) {
      recommendations.push({
        id: `rec-${id++}`,
        title: "Reallocate Budget",
        description: `Consider reallocating ${suggestedAmount.toFixed(2)} from your ${sourceCategory.category} budget to your ${targetCategory.category} budget.`,
        type: 'reallocation',
        category: targetCategory.category,
        impact: 0.5
      });
    }
  }
  
  // Look for potential savings opportunities
  patterns
    .filter(p => p.pattern === "increasing" && p.percentageChange > 10)
    .forEach(pattern => {
      const budget = budgets.find(b => b.category === pattern.category);
      if (!budget) return;
      
      recommendations.push({
        id: `rec-${id++}`,
        title: "Identify Non-Essential Expenses",
        description: `Your ${pattern.category} spending is trending up. Try to identify non-essential expenses in this category.`,
        type: 'savings',
        category: pattern.category,
        impact: 0.5
      });
    });
  
  // Check for frequent small transactions that add up
  const currentDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);
  
  const recentTransactions = transactions.filter(
    t => t.type === "expense" && t.date >= oneMonthAgo
  );
  
  // Group small transactions by category
  const smallTransactionsByCategory: Record<string, Transaction[]> = {};
  
  recentTransactions.forEach(transaction => {
    // Consider transactions less than 2% of their category budget as "small"
    const budget = budgets.find(b => b.category === transaction.category);
    if (!budget || transaction.amount > (budget.limit * 0.02)) return;
    
    if (!smallTransactionsByCategory[transaction.category]) {
      smallTransactionsByCategory[transaction.category] = [];
    }
    
    smallTransactionsByCategory[transaction.category].push(transaction);
  });
  
  // Look for categories with many small transactions
  Object.entries(smallTransactionsByCategory).forEach(([category, transactions]) => {
    if (transactions.length >= 10) { // Arbitrary threshold
      const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
      
      recommendations.push({
        id: `rec-${id++}`,
        title: "Bundle Small Transactions",
        description: `You've made ${transactions.length} small ${category} purchases in the last month, totaling ${totalAmount.toFixed(2)}. Consider bundling these purchases.`,
        type: 'savings',
        category,
        impact: 0.2
      });
    }
  });
  
  // Suggest automated savings based on consistent surplus
  const categoriesWithSurplus = budgets.filter(budget => {
    return budget.percentage < 80; // Categories using less than 80% of budget
  });
  
  if (categoriesWithSurplus.length > 0) {
    const totalPotentialSavings = categoriesWithSurplus.reduce(
      (sum, budget) => sum + (budget.limit - budget.spent) * 0.5, // Suggest saving 50% of the surplus
      0
    );
    
    if (totalPotentialSavings > 0) {
      recommendations.push({
        id: `rec-${id++}`,
        title: "Automated Savings",
        description: `You could automatically save up to ${totalPotentialSavings.toFixed(2)} each month based on your current spending patterns.`,
        type: 'savings',
        impact: 0.5
      });
    }
  }
  
  return recommendations;
};

/**
 * Suggest optimal budget distribution based on income and spending patterns
 * 
 * @param transactions Historical transactions
 * @param monthlyIncome User's monthly income
 * @returns Suggested budget allocation by category
 */
export const suggestBudgetAllocation = (
  transactions: Transaction[],
  monthlyIncome: number
): Record<string, number> => {
  // Get total spending by category
  const expensesByCategory: Record<string, number> = {};
  
  transactions
    .filter(t => t.type === "expense")
    .forEach(transaction => {
      const { category, amount } = transaction;
      expensesByCategory[category] = (expensesByCategory[category] || 0) + amount;
    });
  
  // Calculate percentage of total spending for each category
  const totalSpending = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
  const spendingPercentageByCategory: Record<string, number> = {};
  
  Object.entries(expensesByCategory).forEach(([category, amount]) => {
    spendingPercentageByCategory[category] = (amount / totalSpending) * 100;
  });
  
  // Apply ideal budget allocation principles (50/30/20 rule)
  const suggestedAllocation: Record<string, number> = {};
  
  // Needs (50%): housing, utilities, food, transportation, etc.
  const needsCategories = ["housing", "utilities", "food", "transportation", "healthcare"];
  
  // Wants (30%): entertainment, shopping, dining out, etc.
  const wantsCategories = ["entertainment", "shopping", "personal"];
  
  // Savings/Debt (20%): savings, investments, debt payments
  const savingsCategories = ["investment"];
  
  // Calculate suggested allocation
  const needs = monthlyIncome * 0.5;
  const wants = monthlyIncome * 0.3;
  const savings = monthlyIncome * 0.2;
  
  // Distribute needs budget
  const totalNeedsPercentage = needsCategories.reduce(
    (sum, category) => sum + (spendingPercentageByCategory[category] || 0),
    0
  );
  
  if (totalNeedsPercentage > 0) {
    needsCategories.forEach(category => {
      const percentage = spendingPercentageByCategory[category] || 0;
      suggestedAllocation[category] = (percentage / totalNeedsPercentage) * needs;
    });
  } else {
    // If no historical data, use reasonable defaults
    suggestedAllocation["housing"] = needs * 0.5;
    suggestedAllocation["utilities"] = needs * 0.15;
    suggestedAllocation["food"] = needs * 0.25;
    suggestedAllocation["transportation"] = needs * 0.1;
  }
  
  // Distribute wants budget
  const totalWantsPercentage = wantsCategories.reduce(
    (sum, category) => sum + (spendingPercentageByCategory[category] || 0),
    0
  );
  
  if (totalWantsPercentage > 0) {
    wantsCategories.forEach(category => {
      const percentage = spendingPercentageByCategory[category] || 0;
      suggestedAllocation[category] = (percentage / totalWantsPercentage) * wants;
    });
  } else {
    // Default allocation
    suggestedAllocation["entertainment"] = wants * 0.4;
    suggestedAllocation["shopping"] = wants * 0.4;
    suggestedAllocation["personal"] = wants * 0.2;
  }
  
  // Allocate savings budget
  suggestedAllocation["investment"] = savings * 0.7; // 70% to investments
  suggestedAllocation["emergency"] = savings * 0.3; // 30% to emergency fund
  
  return suggestedAllocation;
};

export default {
  predictMonthlySpending,
  analyzeSpendingPatterns,
  generateInsights,
  generateRecommendations,
  suggestBudgetAllocation
}; 