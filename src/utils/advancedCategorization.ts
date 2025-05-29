// Advanced categorization utilities for ML-based transaction detection

import { detectCategory } from "./transactionUtils";

// Types
export interface TransactionData {
  id: string | number;
  description: string;
  amount: number;
  date: string | Date;
  category?: string;
  confidence?: number;
}

// Category mapping for merchant recognition
const merchantCategoryMap: Record<string, string> = {
  // Banking & Financial
  "BANK TRANSFER": "transfer",
  "ACH TRANSFER": "transfer",
  "DEPOSIT": "income",
  "INTEREST": "income",
  "ATM WITHDRAWAL": "cash",
  
  // Retail & Shopping
  "AMAZON": "shopping",
  "WALMART": "shopping",
  "TARGET": "shopping",
  "BEST BUY": "shopping",
  "ETSY": "shopping",
  "EBAY": "shopping",
  
  // Groceries
  "KROGER": "food",
  "WHOLE FOODS": "food",
  "TRADER JOE": "food",
  "ALDI": "food",
  "PUBLIX": "food",
  "SAFEWAY": "food",
  
  // Restaurants & Food Delivery
  "DOORDASH": "food",
  "UBER EATS": "food",
  "GRUBHUB": "food",
  "MCDONALD": "food",
  "STARBUCKS": "food",
  "CHIPOTLE": "food",
  
  // Transportation
  "UBER": "transportation",
  "LYFT": "transportation",
  "SHELL": "transportation",
  "EXXON": "transportation",
  "BP": "transportation",
  "CHEVRON": "transportation",
  "PARKING": "transportation",
  
  // Entertainment & Subscriptions
  "NETFLIX": "entertainment",
  "SPOTIFY": "entertainment",
  "HULU": "entertainment",
  "DISNEY+": "entertainment",
  "HBO MAX": "entertainment",
  "APPLE": "entertainment",
  "AMAZON PRIME": "entertainment",
  
  // Utilities
  "VERIZON": "utilities",
  "AT&T": "utilities",
  "T-MOBILE": "utilities",
  "COMCAST": "utilities",
  "WATER BILL": "utilities",
  "ELECTRIC": "utilities",
  "GAS BILL": "utilities",
  
  // Housing
  "RENT": "housing",
  "MORTGAGE": "housing",
  "HOA": "housing",
  
  // Healthcare
  "CVS": "healthcare",
  "WALGREENS": "healthcare",
  "PHARMACY": "healthcare",
  "DOCTOR": "healthcare",
  "MEDICAL": "healthcare",
  "DENTAL": "healthcare",
  "INSURANCE": "healthcare"
};

/**
 * Advanced category detection using machine learning-like techniques
 * 
 * @param transaction The transaction to categorize
 * @returns Detected category and confidence score
 */
export const detectCategoryAdvanced = (transaction: TransactionData): { category: string, confidence: number } => {
  const { description, amount } = transaction;
  if (!description) return { category: "other", confidence: 0.5 };
  
  // Step 1: Check for exact merchant matches
  const upperDesc = description.toUpperCase();
  for (const [merchant, category] of Object.entries(merchantCategoryMap)) {
    if (upperDesc.includes(merchant)) {
      return { category, confidence: 0.9 }; // High confidence for exact merchant matches
    }
  }
  
  // Step 2: Use basic keyword detection
  const basicCategory = detectCategory(description);
  if (basicCategory) {
    return { category: basicCategory, confidence: 0.8 };
  }
  
  // Step 3: Use amount heuristics
  if (amount > 1000) {
    // Large amounts are often housing, travel or major purchases
    return { category: "housing", confidence: 0.6 };
  } else if (amount > 500) {
    return { category: "shopping", confidence: 0.5 };
  } else if (amount < 20) {
    // Small amounts are often food, entertainment or transportation
    return { category: "food", confidence: 0.4 };
  }
  
  // Fallback
  return { category: "other", confidence: 0.3 };
};

/**
 * Batch process multiple transactions
 * 
 * @param transactions Array of transactions to categorize
 * @returns Categorized transactions with confidence scores
 */
export const batchCategorize = (transactions: TransactionData[]): (TransactionData & { confidence: number })[] => {
  return transactions.map(transaction => {
    const result = detectCategoryAdvanced(transaction);
    return {
      ...transaction,
      category: result.category,
      confidence: result.confidence
    };
  });
};

/**
 * Validate proposed categories and flag uncertain predictions
 * 
 * @param transactions Categorized transactions
 * @param confidenceThreshold Minimum confidence to consider reliable
 * @returns Separated reliable and uncertain categorizations
 */
export const validateCategories = (
  transactions: (TransactionData & { confidence: number })[],
  confidenceThreshold: number = 0.7
): { 
  reliable: (TransactionData & { confidence: number })[], 
  uncertain: (TransactionData & { confidence: number })[] 
} => {
  const reliable: (TransactionData & { confidence: number })[] = [];
  const uncertain: (TransactionData & { confidence: number })[] = [];
  
  transactions.forEach(transaction => {
    if (transaction.confidence >= confidenceThreshold) {
      reliable.push(transaction);
    } else {
      uncertain.push(transaction);
    }
  });
  
  return { reliable, uncertain };
};

/**
 * Analyze transactions to find patterns and create new categorization rules
 * 
 * @param transactions Historical transactions with confirmed categories
 * @returns Suggested rules for future categorization
 */
export const suggestCategorizationRules = (
  transactions: TransactionData[]
): { keyword: string, category: string, occurrences: number }[] => {
  // Find common words in descriptions for each category
  const wordFrequencyByCategory: Record<string, Record<string, number>> = {};
  
  transactions.forEach(transaction => {
    if (!transaction.category || !transaction.description) return;
    
    const { category, description } = transaction;
    if (!wordFrequencyByCategory[category]) {
      wordFrequencyByCategory[category] = {};
    }
    
    // Split description into words and count frequencies
    const words = description.toLowerCase().split(/\s+/);
    words.forEach(word => {
      // Filter out short words and common stop words
      if (word.length <= 2 || ["the", "and", "for", "inc", "llc"].includes(word)) return;
      
      wordFrequencyByCategory[category][word] = (wordFrequencyByCategory[category][word] || 0) + 1;
    });
  });
  
  // Create suggested rules from the most common words
  const suggestedRules: { keyword: string, category: string, occurrences: number }[] = [];
  
  Object.entries(wordFrequencyByCategory).forEach(([category, wordFrequency]) => {
    // Sort words by frequency
    const sortedWords = Object.entries(wordFrequency)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5); // Take top 5 most common words
    
    sortedWords.forEach(([word, occurrences]) => {
      // Only suggest rules for words that appear multiple times
      if (occurrences >= 2) {
        suggestedRules.push({ keyword: word, category, occurrences });
      }
    });
  });
  
  return suggestedRules;
};

/**
 * Get appropriate confidence label and color
 * 
 * @param confidence The confidence score (0-1)
 * @returns Object with label and color information
 */
export const getConfidenceDisplay = (confidence: number): { 
  label: string, 
  color: string,
  textClass: string,
  bgClass: string
} => {
  if (confidence >= 0.9) {
    return { 
      label: "Very High", 
      color: "green", 
      textClass: "text-green-600", 
      bgClass: "bg-green-100 dark:bg-green-900/30" 
    };
  } else if (confidence >= 0.7) {
    return { 
      label: "High", 
      color: "blue", 
      textClass: "text-blue-600", 
      bgClass: "bg-blue-100 dark:bg-blue-900/30" 
    };
  } else if (confidence >= 0.5) {
    return { 
      label: "Medium", 
      color: "amber", 
      textClass: "text-amber-600", 
      bgClass: "bg-amber-100 dark:bg-amber-900/30" 
    };
  } else if (confidence >= 0.3) {
    return { 
      label: "Low", 
      color: "orange", 
      textClass: "text-orange-600", 
      bgClass: "bg-orange-100 dark:bg-orange-900/30" 
    };
  } else {
    return { 
      label: "Very Low", 
      color: "red", 
      textClass: "text-red-600", 
      bgClass: "bg-red-100 dark:bg-red-900/30" 
    };
  }
};

export default {
  detectCategoryAdvanced,
  batchCategorize,
  validateCategories,
  suggestCategorizationRules,
  getConfidenceDisplay
}; 