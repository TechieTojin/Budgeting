export interface Tip {
  id: string;
  title: string;
  category: string;
  description: string;
  actionText?: string;
  actionUrl?: string;
  rating?: number;
  reviews?: number;
  isFeatured?: boolean;
  relevance?: "High" | "Medium" | "Low";
  potentialSavings?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  timeToImplement?: string;
  isBookmarked?: boolean;
  isLiked?: boolean;
  isDisliked?: boolean;
  tags?: string[];
  detailedSteps?: string[];
  implementationProgress?: number;
  estimatedSavings?: number;
  lastUpdated?: string;
  aiScore?: number;
  realTimeData?: {
    appliedByUsers: number;
    avgSavings: number;
    successRate: number;
  };
}

// 10 best financial tips with detailed implementations and realistic data
export const bestSmartTips: Tip[] = [
  {
    id: "bt1",
    title: "Zero-Based Budgeting Method",
    category: "budgeting",
    description:
      "Allocate every dollar of your income to a specific purpose - expenses, savings, or investments - until you reach zero. This ensures maximum control and intentionality with your money.",
    actionText: "Create Zero-Based Budget",
    actionUrl: "/budget",
    rating: 4.9,
    reviews: 378,
    isFeatured: true,
    difficulty: "Medium",
    timeToImplement: "2 hours initial setup",
    isBookmarked: false,
    isLiked: false,
    isDisliked: false,
    tags: ["zero-based", "budgeting", "financial planning"],
    detailedSteps: [
      "List your monthly income from all sources",
      "Categorize all your expenses (fixed, variable, discretionary)",
      "Assign each dollar to a category until your income minus allocations equals zero",
      "Track spending throughout the month to stay within category limits",
      "Adjust categories as needed for the next month based on performance"
    ],
    implementationProgress: 0,
    estimatedSavings: 420,
    aiScore: 96,
    realTimeData: {
      appliedByUsers: 2145,
      avgSavings: 385,
      successRate: 91
    },
    lastUpdated: new Date().toISOString()
  },
  {
    id: "bt2",
    title: "The Cash Envelope System",
    category: "spending",
    description:
      "Use physical cash in labeled envelopes for different spending categories to create visual boundaries and prevent overspending in discretionary categories like dining and entertainment.",
    actionText: "Set Up Envelope System",
    actionUrl: "/budget",
    rating: 4.7,
    reviews: 523,
    isFeatured: true,
    difficulty: "Easy",
    timeToImplement: "1 hour",
    isBookmarked: false,
    isLiked: false,
    isDisliked: false,
    tags: ["cash", "spending control", "budgeting"],
    detailedSteps: [
      "Identify 3-5 categories where you tend to overspend (dining, entertainment, shopping)",
      "Determine a reasonable weekly cash allowance for each category",
      "Create and label physical envelopes for each category",
      "Withdraw the total amount in cash at the beginning of the week",
      "Once an envelope is empty, stop spending in that category until next refill"
    ],
    implementationProgress: 0,
    estimatedSavings: 280,
    aiScore: 90,
    realTimeData: {
      appliedByUsers: 4250,
      avgSavings: 265,
      successRate: 88
    },
    lastUpdated: new Date().toISOString()
  },
  {
    id: "bt3",
    title: "High-Interest Debt Elimination Strategy",
    category: "debt",
    description:
      "Aggressively pay down high-interest debt using the avalanche method while maintaining minimum payments on other debts to save thousands in interest payments.",
    actionText: "Create Debt Payoff Plan",
    actionUrl: "/debt",
    rating: 4.9,
    reviews: 615,
    isFeatured: true,
    difficulty: "Medium",
    timeToImplement: "1-2 hours",
    isBookmarked: false,
    isLiked: false,
    isDisliked: false,
    tags: ["debt", "interest", "debt-free"],
    detailedSteps: [
      "List all debts with their balances, interest rates, and minimum payments",
      "Order debts from highest to lowest interest rate",
      "Make minimum payments on all debts",
      "Put all extra money toward the highest-interest debt",
      "Once highest-interest debt is paid off, move to the next highest",
      "Maintain motivation by tracking total interest saved"
    ],
    implementationProgress: 0,
    estimatedSavings: 1250,
    aiScore: 98,
    realTimeData: {
      appliedByUsers: 3280,
      avgSavings: 1180,
      successRate: 94
    },
    lastUpdated: new Date().toISOString()
  },
  {
    id: "bt4",
    title: "401(k) Employer Match Maximization",
    category: "investing",
    description:
      "Contribute at least enough to your employer-sponsored retirement plan to capture the full company match - this is essentially free money that can add hundreds of thousands to your retirement savings.",
    actionText: "Adjust Retirement Contributions",
    actionUrl: "/settings",
    rating: 5.0,
    reviews: 742,
    isFeatured: true,
    difficulty: "Easy",
    timeToImplement: "15 minutes",
    isBookmarked: false,
    isLiked: false,
    isDisliked: false,
    tags: ["retirement", "401k", "investing"],
    detailedSteps: [
      "Check your employer's 401(k) matching policy (e.g., 100% match up to 5% of salary)",
      "Log into your retirement account or payroll system",
      "Adjust your contribution to at least capture the full employer match",
      "Set calendar reminders to increase contributions by 1% each year",
      "Consider tax implications and benefit of pre-tax contributions"
    ],
    implementationProgress: 0,
    estimatedSavings: 2500,
    aiScore: 99,
    realTimeData: {
      appliedByUsers: 5821,
      avgSavings: 2350,
      successRate: 98
    },
    lastUpdated: new Date().toISOString()
  },
  {
    id: "bt5",
    title: "Subscription Audit and Optimization",
    category: "subscriptions",
    description:
      "Conduct a thorough audit of all recurring subscriptions and memberships, canceling unused services and negotiating better rates on essential ones to eliminate wasted monthly expenses.",
    actionText: "Start Subscription Audit",
    actionUrl: "/budget",
    rating: 4.8,
    reviews: 490,
    isFeatured: true,
    difficulty: "Easy",
    timeToImplement: "2 hours",
    isBookmarked: false,
    isLiked: false,
    isDisliked: false,
    tags: ["subscriptions", "recurring expenses", "cost-cutting"],
    detailedSteps: [
      "Review 3 months of bank and credit card statements to identify all subscriptions",
      "Create a spreadsheet listing each subscription, monthly cost, and last use date",
      "Cancel subscriptions unused in the last 30 days",
      "For essential subscriptions, research competitors' offers or promotional rates",
      "Call current providers to negotiate lower rates or switch to annual billing for discounts",
      "Set calendar reminders before free trials end"
    ],
    implementationProgress: 0,
    estimatedSavings: 150,
    aiScore: 93,
    realTimeData: {
      appliedByUsers: 7431,
      avgSavings: 132,
      successRate: 97
    },
    lastUpdated: new Date().toISOString()
  },
  {
    id: "bt6",
    title: "Strategic Grocery Shopping System",
    category: "spending",
    description:
      "Implement a systematic approach to grocery shopping with meal planning, strategic store selection, and coupon/cashback app usage to reduce food costs without sacrificing quality.",
    actionText: "Create Shopping System",
    actionUrl: "/budget",
    rating: 4.7,
    reviews: 612,
    isFeatured: true,
    difficulty: "Medium",
    timeToImplement: "Ongoing weekly",
    isBookmarked: false,
    isLiked: false,
    isDisliked: false,
    tags: ["groceries", "meal planning", "savings"],
    detailedSteps: [
      "Plan meals around weekly store sales and seasonal produce",
      "Create a standard shopping list of staples you buy regularly",
      "Use grocery store apps to load digital coupons before shopping",
      "Compare unit prices rather than package prices",
      "Use cashback apps like Ibotta or Fetch Rewards for additional savings",
      "Buy non-perishables in bulk when on sale"
    ],
    implementationProgress: 0,
    estimatedSavings: 180,
    aiScore: 92,
    realTimeData: {
      appliedByUsers: 6250,
      avgSavings: 165,
      successRate: 89
    },
    lastUpdated: new Date().toISOString()
  },
  {
    id: "bt7",
    title: "No-Spend Challenge Month",
    category: "saving",
    description:
      "Designate one month for a no-spend challenge where you only purchase absolute necessities. This reset helps identify true needs versus wants and breaks unconscious spending habits.",
    actionText: "Plan Challenge Month",
    actionUrl: "/budget",
    rating: 4.6,
    reviews: 387,
    isFeatured: true,
    difficulty: "Hard",
    timeToImplement: "1 month",
    isBookmarked: false,
    isLiked: false,
    isDisliked: false,
    tags: ["challenge", "mindful spending", "habits"],
    detailedSteps: [
      "Choose a relatively normal month (avoid holidays or special occasions)",
      "Define clear rules - only essentials like groceries, medicine, bills, and transportation are allowed",
      "Prepare by meal planning and identifying potential temptations",
      "Delete shopping apps from your phone for the month",
      "Keep a journal of things you wanted to buy but didn't",
      "Analyze spending patterns at the end of the month"
    ],
    implementationProgress: 0,
    estimatedSavings: 650,
    aiScore: 87,
    realTimeData: {
      appliedByUsers: 3150,
      avgSavings: 580,
      successRate: 72
    },
    lastUpdated: new Date().toISOString()
  },
  {
    id: "bt8",
    title: "Utility Bill Optimization",
    category: "spending",
    description:
      "Systematically reduce utility costs through a combination of provider negotiation, usage analysis, and targeted energy efficiency improvements for sustained monthly savings.",
    actionText: "Optimize Utilities",
    actionUrl: "/budget",
    rating: 4.5,
    reviews: 329,
    isFeatured: true,
    difficulty: "Medium",
    timeToImplement: "4-5 hours",
    isBookmarked: false,
    isLiked: false,
    isDisliked: false,
    tags: ["utilities", "energy", "negotiation"],
    detailedSteps: [
      "Collect the last 12 months of utility bills to analyze usage patterns",
      "Research competitive rates from alternative providers in your area",
      "Call current providers to negotiate rates or ask about available promotions",
      "Install a programmable thermostat to optimize heating/cooling",
      "Replace high-usage light bulbs with LED alternatives",
      "Identify and unplug energy-draining devices when not in use",
      "Consider a home energy audit for targeted improvements"
    ],
    implementationProgress: 0,
    estimatedSavings: 210,
    aiScore: 89,
    realTimeData: {
      appliedByUsers: 4120,
      avgSavings: 185,
      successRate: 85
    },
    lastUpdated: new Date().toISOString()
  },
  {
    id: "bt9",
    title: "Strategic Credit Card Rewards Maximization",
    category: "spending",
    description:
      "Develop a strategic system for using specific credit cards for different purchase categories to maximize cashback and rewards without carrying a balance.",
    actionText: "Optimize Card Usage",
    actionUrl: "/settings",
    rating: 4.8,
    reviews: 512,
    isFeatured: true,
    difficulty: "Medium",
    timeToImplement: "1 hour + ongoing",
    isBookmarked: false,
    isLiked: false,
    isDisliked: false,
    tags: ["credit cards", "rewards", "cashback"],
    detailedSteps: [
      "List all your credit cards and their rewards structures (e.g., 5% on gas, 3% on groceries)",
      "Create a simple reference chart showing which card to use for which category",
      "Label physical cards or add digital notes to card entries in your phone wallet",
      "Set up automatic payments for the full balance to avoid interest charges",
      "Track reward accumulation and optimize redemption methods",
      "Consider applying for a new card if there's a major spending category without good rewards"
    ],
    implementationProgress: 0,
    estimatedSavings: 380,
    aiScore: 94,
    realTimeData: {
      appliedByUsers: 4870,
      avgSavings: 355,
      successRate: 90
    },
    lastUpdated: new Date().toISOString()
  },
  {
    id: "bt10",
    title: "Automated Micro-Investing Strategy",
    category: "investing",
    description:
      "Harness the power of spare change and small automatic transfers to build an investment portfolio without feeling the impact on your daily budget.",
    actionText: "Start Micro-Investing",
    actionUrl: "/settings",
    rating: 4.7,
    reviews: 428,
    isFeatured: true,
    difficulty: "Easy",
    timeToImplement: "30 minutes",
    isBookmarked: false,
    isLiked: false,
    isDisliked: false,
    tags: ["investing", "automation", "micro-saving"],
    detailedSteps: [
      "Set up an account with a micro-investing platform (like Acorns, Stash, or Robinhood)",
      "Connect your primary spending account or cards",
      "Enable round-up features that invest spare change from purchases",
      "Set up a small weekly or monthly automatic deposit ($5-$20)",
      "Choose a diversified investment option appropriate for your risk tolerance",
      "Let the system run automatically and resist checking too frequently",
      "Gradually increase automatic investments as your comfort level grows"
    ],
    implementationProgress: 0,
    estimatedSavings: 850,
    aiScore: 91,
    realTimeData: {
      appliedByUsers: 5620,
      avgSavings: 780,
      successRate: 93
    },
    lastUpdated: new Date().toISOString()
  }
]; 