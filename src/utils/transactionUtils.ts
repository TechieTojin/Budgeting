// Transaction utility functions

// Category mapping for smart detection
const categoryKeywords: Record<string, string[]> = {
  "food": ["restaurant", "café", "cafe", "coffee", "food", "grocery", "groceries", "lunch", "dinner", "breakfast", "uber eats", "doordash", "zomato", "swiggy", "mcdonalds", "pizza", "burger"],
  "transportation": ["uber", "lyft", "cab", "taxi", "metro", "train", "bus", "fuel", "gas", "petrol", "parking", "toll", "transit", "transport", "railway", "flight", "airline"],
  "housing": ["rent", "mortgage", "property", "apartment", "house", "lease", "housing", "tenant", "landlord", "maintenance"],
  "utilities": ["electricity", "water", "gas", "internet", "wifi", "phone", "mobile", "broadband", "bill", "utility"],
  "entertainment": ["netflix", "amazon prime", "disney", "hulu", "spotify", "apple music", "cinema", "movie", "concert", "subscription", "gaming", "game", "xbox", "playstation", "nintendo"],
  "shopping": ["amazon", "walmart", "target", "ikea", "clothing", "apparel", "shoes", "electronics", "purchase", "store", "mall", "retail", "shop", "fashion", "flipkart", "online shopping"],
  "healthcare": ["doctor", "hospital", "clinic", "medical", "medicine", "pharmacy", "health", "dental", "dentist", "therapy", "therapist", "insurance", "healthcare"],
  "education": ["school", "college", "university", "tuition", "course", "class", "education", "student", "book", "udemy", "coursera", "edx", "tutorial", "learning"],
  "personal": ["salon", "haircut", "spa", "gym", "fitness", "personal care", "beauty", "cosmetics", "self-care"],
  "investment": ["stocks", "bonds", "mutual fund", "etf", "investment", "crypto", "bitcoin", "dividend", "interest", "capital gain"],
  "income": ["salary", "wage", "paycheck", "bonus", "commission", "freelance", "client payment", "side hustle", "income", "earnings", "revenue", "profit", "settlement", "refund", "deposit"]
};

/**
 * Detect transaction category based on description
 * 
 * @param description The transaction description
 * @returns The detected category or null if no match
 */
export const detectCategory = (description: string): string | null => {
  if (!description) return null;
  
  const lowercaseDesc = description.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowercaseDesc.includes(keyword)) {
        return category;
      }
    }
  }
  
  return null;
};

/**
 * Determine if a transaction is likely income based on description
 * 
 * @param description The transaction description
 * @returns True if the description suggests income
 */
export const isLikelyIncome = (description: string): boolean => {
  if (!description) return false;
  
  const lowercaseDesc = description.toLowerCase();
  const incomeKeywords = categoryKeywords["income"];
  
  return incomeKeywords.some(keyword => lowercaseDesc.includes(keyword));
};

/**
 * Get icon name for a specific category
 * 
 * @param category The transaction category
 * @returns The icon name for the category
 */
export const getCategoryIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    "food": "utensils",
    "transportation": "car",
    "housing": "home",
    "utilities": "zap",
    "entertainment": "film",
    "shopping": "shopping-bag",
    "healthcare": "activity",
    "education": "book-open",
    "personal": "user",
    "investment": "trending-up",
    "income": "dollar-sign",
    "salary": "briefcase",
    "freelance": "globe",
    "business": "briefcase",
    "gift": "gift",
    "refund": "rotate-ccw",
    "other": "circle"
  };
  
  return iconMap[category] || "circle";
};

/**
 * Format amount with currency symbol
 * 
 * @param amount The amount to format
 * @param currency The currency symbol (default: ₹)
 * @returns Formatted amount string
 */
export const formatAmount = (amount: number, currency: string = "₹"): string => {
  return `${currency}${amount.toFixed(2)}`;
};

export default {
  detectCategory,
  isLikelyIncome,
  getCategoryIcon,
  formatAmount
}; 