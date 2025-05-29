import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available languages
export type Language = 'en' | 'hi' | 'ml' | 'kn';

// Define the content structure for translations
type TranslationContent = {
  [key: string]: string;
};

// Translation data for different languages
const translations: Record<Language, TranslationContent> = {
  en: {
    // Common
    dashboard: 'dashboard',
    transactions: 'transactions',
    budget: 'budget',
    history: 'history',
    reports: 'reports',
    predictions: 'predictions',
    tips: 'smart tips',
    settings: 'settings',
    notifications: 'notifications',
    balance: 'balance',
    income: 'income',
    expenses: 'expenses',
    save: 'save',
    cancel: 'cancel',
    main: 'main',
    analytics: 'analytics',
    account: 'account',
    sign_out: 'sign out',
    
    // AI Assistant
    askAssistant: 'ask your financial assistant...',
    assistant: 'financial assistant',
    assistantWelcome: 'Hello! I can help with your financial questions and provide personalized advice.',
    
    // Budget
    budgetManagement: 'budget management',
    addBudget: 'add budget',
    category: 'category',
    monthlyLimit: 'monthly limit',
    createBudget: 'create budget',
    
    // Predictions
    expenseForecast: 'expense forecast',
    predictedSpending: 'predicted for next month',
    aiConfidence: 'AI confidence',
    
    // Tips
    smartFinancialTips: 'smart financial tips',
    personalizedRecommendations: 'personalized recommendations',
    potentialSavings: 'potential savings',
    
    // Language
    language: 'language',
    english: 'english',
    hindi: 'hindi',
    malayalam: 'malayalam',
    kannada: 'kannada',
    
    // New translations
    smart_categorization: 'smart categorization',
    receipt_upload: 'receipt upload',
    recurring_transactions: 'recurring transactions',
    search_transactions: 'search transactions',
    split_expenses: 'split expenses',
    multi_currency: 'multi currency',
    download_reports: 'download reports',
    savings_goals: 'savings goals',
    ai_spending_insights: 'ai-powered spending insights',
    investment_tracker: 'investment tracker',
    debt_management: 'debt management',
    logged_out_successfully: 'you have been logged out successfully',
    search_transactions_and_categories: 'search transactions and categories...',
    notifications_checked: 'notifications checked',
    budget_alert: 'budget alert',
    food_budget_alert: 'your food category is at 91% of monthly budget',
    smart_tip_available: 'smart tip available',
    new_savings_opportunity: 'we found a new savings opportunity for you',
    new_prediction_ready: 'new prediction ready',
    next_month_prediction: 'your next month prediction is ready',
    hours_ago: 'hours ago',
    yesterday: 'yesterday',
    days_ago: 'days ago',
    mark_all_as_read: 'mark all as read',
    view_all_notifications: 'view all notifications',
    total_balance: 'total balance',
    monthly_income: 'monthly income',
    monthly_expenses: 'monthly expenses',
    spending_overview: 'spending overview',
    category_distribution: 'category distribution',
    budget_progress: 'budget progress',
    smart_insights: 'smart insights',
    recent_transactions: 'recent transactions',
    
    // Additional translations for Dashboard
    ai_insights: 'ai insights',
    view_detailed_reports: 'view detailed reports',
    view_all_transactions: 'view all transactions',
    manage_budgets: 'manage budgets',
    view_all_insights: 'view all insights',
    add_new_transaction: 'add new transaction',
    forecast_your_finances: 'forecast your finances',
    get_ai_powered_predictions: 'get ai-powered predictions about your future expenses and plan ahead',
    view_predictions: 'view predictions',
    customize_your_experience: 'customize your experience',
    personalize_your_dashboard: 'personalize your dashboard, notification preferences, and more',
    go_to_settings: 'go to settings',
    email_extraction: 'email extraction',
    extraction_progress: 'extraction progress',
    processing_emails: 'processing your emails...',
    ready_to_extract: 'ready to extract data from your emails',
    transaction_timeline: 'transaction timeline',
    spending_by_category: 'spending by category',
    transaction_distribution: 'transaction distribution',
    select_language: 'select language',
    language_changed: 'language changed successfully',
    ai_accuracy_improvement: 'AI accuracy improves as you approve or correct more categorization suggestions',
    // FAQ responses
    faq_smart_budget: 'It\'s an AI assistant that helps users manage income, track expenses, and save money smarter.',
    faq_financial_education: 'Yes, tips and short articles are suggested inside the app.',
    faq_multi_language: 'Yes, supports English and regional languages optionally.',
    faq_offline_mode: 'Partially, users can input offline; syncs when online.',
    faq_dark_mode: 'Yes, light and dark modes are available for user comfort.',
    faq_share_account: 'No, each user has a private account for security.',
    faq_spending_forecast: 'Yes, future predictions shown as graphs and timelines.',
    faq_subscriptions: 'Yes, tracks recurring subscriptions and alerts on renewals.',
    welcome_dashboard: "Welcome back! Here's your financial overview",
    select_time_range: "Select time range",
    this_week: "This Week",
    this_month: "This Month",
    this_quarter: "This Quarter",
    this_year: "This Year",
    vs_last_month: "vs last month",
    income_label: "Income",
    expenses_label: "Expenses",
    savings_label: "Savings",
    last_5_transactions: "Last 5 Transactions",
    warning_over_80: "Warning (>80%)",
    financial_goals: "Financial Goals",
    due: "Due",
    of: "of",
    upcoming_bills: "Upcoming Bills",
    ai_powered: "AI Powered",
    chatgpt: 'AI Financial Assistant',
    financial_health: 'financial health',
    tax_optimization: 'tax optimization',
    goals_tracker: 'goals tracker',
  },
  
  hi: {
    // Common
    dashboard: 'डैशबोर्ड',
    transactions: 'लेन-देन',
    budget: 'बजट',
    history: 'इतिहास',
    reports: 'रिपोर्ट',
    predictions: 'भविष्यवाणी',
    tips: 'स्मार्ट सुझाव',
    settings: 'सेटिंग्स',
    notifications: 'सूचनाएं',
    balance: 'बैलेंस',
    income: 'आय',
    expenses: 'खर्च',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    main: 'मुख्य',
    analytics: 'विश्लेषण',
    account: 'खाता',
    sign_out: 'साइन आउट',
    
    // AI Assistant
    askAssistant: 'अपने वित्तीय सहायक से पूछें...',
    assistant: 'वित्तीय सहायक',
    assistantWelcome: 'नमस्ते! मैं आपके वित्तीय प्रश्नों में मदद कर सकता हूं और व्यक्तिगत सलाह दे सकता हूं।',
    
    // Budget
    budgetManagement: 'बजट प्रबंधन',
    addBudget: 'बजट जोड़ें',
    category: 'श्रेणी',
    monthlyLimit: 'मासिक सीमा',
    createBudget: 'बजट बनाएं',
    
    // Predictions
    expenseForecast: 'खर्च का पूर्वानुमान',
    predictedSpending: 'अगले महीने के लिए अनुमानित',
    aiConfidence: 'AI विश्वास',
    
    // Tips
    smartFinancialTips: 'स्मार्ट वित्तीय सुझाव',
    personalizedRecommendations: 'व्यक्तिगत सिफारिशें',
    potentialSavings: 'संभावित बचत',
    
    // Language
    language: 'भाषा',
    english: 'अंग्रे़ी',
    hindi: 'हिंदी',
    malayalam: 'मलयालम',
    kannada: 'कन्नड़',
    
    // New translations
    smart_categorization: 'स्मार्ट वर्गीकरण',
    receipt_upload: 'रसीद अपलोड',
    recurring_transactions: 'आवर्ती लेनदेन',
    search_transactions: 'लेनदेन खोजें',
    split_expenses: 'खर्च विभाजित करें',
    multi_currency: 'बहु मुद्रा',
    download_reports: 'रिपोर्ट डाउनलोड करें',
    savings_goals: 'बचत लक्ष्य',
    ai_spending_insights: 'एआई-संचालित खर्च अंतर्दृष्टि',
    investment_tracker: 'निवेश ट्रैकर',
    debt_management: 'ऋण प्रबंधन',
    logged_out_successfully: 'आप सफलतापूर्वक लॉग आउट हो गए हैं',
    search_transactions_and_categories: 'लेनदेन और श्रेणियां खोजें...',
    notifications_checked: 'सूचनाएं देखी गईं',
    budget_alert: 'बजट अलर्ट',
    food_budget_alert: 'आपकी खाद्य श्रेणी मासिक बजट का 91% है',
    smart_tip_available: 'स्मार्ट टिप उपलब्ध',
    new_savings_opportunity: 'हमने आपके लिए एक नया बचत अवसर खोजा',
    new_prediction_ready: 'नई भविष्यवाणी तैयार',
    next_month_prediction: 'आपका अगले महीने का अनुमान तैयार है',
    hours_ago: 'घंटे पहले',
    yesterday: 'कल',
    days_ago: 'दिन पहले',
    mark_all_as_read: 'सभी को पढ़ा हुआ चिह्नित करें',
    view_all_notifications: 'सभी सूचनाएं देखें',
    total_balance: 'कुल बैलेंस',
    monthly_income: 'मासिक आय',
    monthly_expenses: 'मासिक खर्च',
    spending_overview: 'खर्च अवलोकन',
    category_distribution: 'श्रेणी वितरण',
    budget_progress: 'बजट प्रगति',
    smart_insights: 'स्मार्ट अंतर्दृष्टि',
    recent_transactions: 'हाल के लेनदेन',
    
    // Additional translations for Dashboard
    ai_insights: 'एआई अंतर्दृष्टि',
    view_detailed_reports: 'विस्तृत रिपोर्ट देखें',
    view_all_transactions: 'सभी लेनदेन देखें',
    manage_budgets: 'बजट प्रबंधित करें',
    view_all_insights: 'सभी अंतर्दृष्टि देखें',
    add_new_transaction: 'नया लेनदेन जोड़ें',
    forecast_your_finances: 'अपने वित्त का पूर्वानुमान लगाएं',
    get_ai_powered_predictions: 'अपने भविष्य के खर्चों के बारे में एआई-संचालित भविष्यवाणियां प्राप्त करें और पहले से योजना बनाएं',
    view_predictions: 'भविष्यवाणियां देखें',
    customize_your_experience: 'अपने अनुभव को अनुकूलित करें',
    personalize_your_dashboard: 'अपने डैशबोर्ड, अधिसूचना प्राथमिकताएं और अधिक को वैयक्तिकृत करें',
    go_to_settings: 'सेटिंग्स पर जाएं',
    email_extraction: 'ईमेल डेटा निष्कर्षण',
    extraction_progress: 'निष्कर्षण प्रगति',
    processing_emails: 'आपके ईमेल प्रोसेस हो रहे हैं...',
    ready_to_extract: 'आपके ईमेल से डेटा निकालने के लिए तैयार',
    transaction_timeline: 'लेनदेन समयरेखा',
    spending_by_category: 'श्रेणी के अनुसार खर्च',
    transaction_distribution: 'लेनदेन वितरण',
    select_language: 'भाषा चुनें',
    language_changed: 'भाषा सफलतापूर्वक बदली गई',
    ai_accuracy_improvement: 'अधिक वर्गीकरण सुझावों को स्वीकृत या सही करने से AI की सटीकता में सुधार होता है',
    // FAQ responses
    faq_smart_budget: 'यह एक AI सहायक है जो उपयोगकर्ताओं को आय प्रबंधित करने, खर्चों को ट्रैक करने और पैसे बचाने में मदद करता है।',
    faq_financial_education: 'हां, ऐप के अंदर टिप्स और छोटे लेख सुझाए जाते हैं।',
    faq_multi_language: 'हां, वैकल्पिक रूप से अंग्रेजी और क्षेत्रीय भाषाओं का समर्थन करता है।',
    faq_offline_mode: 'आंशिक रूप से, उपयोगकर्ता ऑफलाइन इनपुट कर सकते हैं; ऑनलाइन होने पर सिंक होता है।',
    faq_dark_mode: 'हां, उपयोगकर्ता की सुविधा के लिए लाइट और डार्क मोड उपलब्ध हैं।',
    faq_share_account: 'नहीं, सुरक्षा के लिए प्रत्येक उपयोगकर्ता का एक निजी खाता होता है।',
    faq_spending_forecast: 'हां, भविष्य की भविष्यवाणियां ग्राफ और टाइमलाइन के रूप में दिखाई जाती हैं।',
    faq_subscriptions: 'हां, आवर्ती सदस्यताओं को ट्रैक करता है और नवीनीकरण पर अलर्ट करता है।',
    welcome_dashboard: "वापसी पर स्वागत है! यह आपका वित्तीय अवलोकन है",
    select_time_range: "समय सीमा चुनें",
    this_week: "इस सप्ताह",
    this_month: "इस महीने",
    this_quarter: "इस तिमाही",
    this_year: "इस वर्ष",
    vs_last_month: "पिछले महीने की तुलना में",
    income_label: "आय",
    expenses_label: "खर्च",
    savings_label: "बचत",
    last_5_transactions: "पिछले 5 लेन-देन",
    warning_over_80: "चेतावनी (>80%)",
    financial_goals: "वित्तीय लक्ष्य",
    due: "देय",
    of: "का",
    upcoming_bills: "आगामी बिल",
    ai_powered: "एआई संचालित",
    chatgpt: 'एआई वित्तीय सहायक',
    financial_health: 'वित्तीय स्वास्थ्य',
    tax_optimization: 'कर अनुकूलन',
    goals_tracker: 'लक्ष्य ट्रैकर',
  },
  
  ml: {
    // Common
    dashboard: 'ഡാഷ്‌ബോർഡ്',
    transactions: 'ഇടപാടുകൾ',
    budget: 'ബജറ്റ്',
    history: 'ചരിത്രം',
    reports: 'റിപ്പോർട്ടുകൾ',
    predictions: 'പ്രവചനങ്ങൾ',
    tips: 'സ്മാർട്ട് നിർദ്ദേശങ്ങൾ',
    settings: 'ക്രമീകരണങ്ങൾ',
    notifications: 'അറിയിപ്പുകൾ',
    balance: 'ബാലൻസ്',
    income: 'വരുമാനം',
    expenses: 'ചെലവുകൾ',
    save: 'സേവ് ചെയ്യുക',
    cancel: 'റദ്ദാക്കുക',
    main: 'മുഖ്യ',
    analytics: 'അനലിറ്റിക്സ്',
    account: 'അക്കൗണ്ട്',
    sign_out: 'സൈൻ ഔട്ട്',
    
    // AI Assistant
    askAssistant: 'നിങ്ങളുടെ സാമ്പത്തിക സഹായിയോട് ചോദിക്കുക...',
    assistant: 'സാമ്പത്തിക സഹായി',
    assistantWelcome: 'ഹലോ! എനിക്ക് നിങ്ങളുടെ സാമ്പത്തിക ചോദ്യങ്ങളിൽ സഹായിക്കാനും വ്യക്തിഗത ഉപദേശം നൽകാനും കഴിയും.',
    
    // Budget
    budgetManagement: 'ബജറ്റ് മാനേജ്മെന്റ്',
    addBudget: 'ബജറ്റ് ചേർക്കുക',
    category: 'വിഭാഗം',
    monthlyLimit: 'മാസിക സിമാ',
    createBudget: 'ബജറ്റ് സൃഷ്ടിക്കുക',
    
    // Predictions
    expenseForecast: 'ചെലവ് പ്രവചനം',
    predictedSpending: 'അടുത്ത മാസത്തേക്ക് പ്രവചിച്ചത്',
    aiConfidence: 'AI വിശ്വാസ്യത',
    
    // Tips
    smartFinancialTips: 'സ്മാർട്ട് സാമ്പത്തിക നുറുങ്ങുകൾ',
    personalizedRecommendations: 'വ്യക്തിഗതമാക്കിയ ശുപാർശകൾ',
    potentialSavings: 'സാധ്യമായ സമ്പാദ്യങ്ങൾ',
    
    // Language
    language: 'ഭാഷ',
    english: 'ഇംഗ്ലീഷ്',
    hindi: 'ഹിന്ദി',
    malayalam: 'മലയാളം',
    kannada: 'കന്നഡ',
    
    // New translations
    smart_categorization: 'സ്മാർട്ട് വർഗ്ഗീകരണം',
    receipt_upload: 'രസീത് അപ്‌ലോഡ്',
    recurring_transactions: 'ആവർത്തിച്ചുള്ള ഇടപാടുകൾ',
    search_transactions: 'ഇടപാടുകൾ തിരയുക',
    split_expenses: 'ചെലവുകൾ വിഭജിക്കുക',
    multi_currency: 'ബഹു കറൻസി',
    download_reports: 'റിപ്പോർട്ടുകൾ ഡൗൺലോഡ് ചെയ്യുക',
    savings_goals: 'സമ്പാദ്യ ലക്ഷ്യങ്ങൾ',
    ai_spending_insights: 'എഐ-പവർഡ് ചെലവ് ഇൻസൈറ്റുകൾ',
    investment_tracker: 'നിക്ഷേപ ട്രാക്കർ',
    debt_management: 'കടം മാനേജ്മെന്റ്',
    logged_out_successfully: 'നിങ്ങൾ വിജയകരമായി ലോഗ് ഔട്ട് ചെയ്തു',
    search_transactions_and_categories: 'ഇടപാടുകളും വിഭാഗങ്ങളും തിരയുക...',
    notifications_checked: 'അറിയിപ്പുകൾ പരിശോധിച്ചു',
    budget_alert: 'ബജറ്റ് അലേർട്ട്',
    food_budget_alert: 'നിങ്ങളുടെ ഭക്ഷണ വിഭാഗം മാസ ബജറ്റിന്റെ 91% ആണ്',
    smart_tip_available: 'സ്മാർട്ട് ടിപ്പ് ലഭ്യമാണ്',
    new_savings_opportunity: 'ഞങ്ങൾ നിങ്ങൾക്ക് ഒരു പുതിയ സമ്പാദ്യ അവസരം കണ്ടെത്തി',
    new_prediction_ready: 'പുതിയ പ്രവചനം തയ്യാറാണ്',
    next_month_prediction: 'നിങ്ങളുടെ അടുത്ത മാസത്തെ പ്രവചനം തയ്യാറാണ്',
    hours_ago: 'മണിക്കൂർ മുമ്പ്',
    yesterday: 'ഇന്നലെ',
    days_ago: 'ദിനങ്ങളുക്ക് മുമ്പ്',
    mark_all_as_read: 'എല്ലാം വായിച്ചതായി മാർക്ക് ചെയ്യുക',
    view_all_notifications: 'എല്ലാ അറിയിപ്പുകളും കാണുക',
    total_balance: 'ആകെ ബാലൻസ്',
    monthly_income: 'മാസിക വരുമാനം',
    monthly_expenses: 'മാസിക ചെലവുകൾ',
    spending_overview: 'ചെലവാക്കൽ അവലോകനം',
    category_distribution: 'വിഭാഗ വിതരണം',
    budget_progress: 'ബജറ്റ് പുരോഗതി',
    smart_insights: 'സ്മാർട്ട് ഇൻസൈറ്റുകൾ',
    recent_transactions: 'സമീപകാല ഇടപാടുകൾ',
    
    // Additional translations for Dashboard
    ai_insights: 'എഐ ഇൻസൈറ്റുകൾ',
    view_detailed_reports: 'വിശദമായ റിപ്പോർട്ടുകൾ കാണുക',
    view_all_transactions: 'എല്ലാ ഇടപാടുകളും കാണുക',
    manage_budgets: 'ബജറ്റുകൾ നിയന്ത്രിക്കുക',
    view_all_insights: 'എല്ലാ ഇൻസൈറ്റുകളും കാണുക',
    add_new_transaction: 'പുതിയ ഇടപാട് ചേർക്കുക',
    forecast_your_finances: 'നിങ്ങളുടെ സാമ്പത്തിക കാര്യങ്ങൾ പ്രവചിക്കുക',
    get_ai_powered_predictions: 'നിങ്ങളുടെ ഭാവി ചെലവുകളെക്കുറിച്ച് എഐ അധിഷ്ഠിത പ്രവചനങ്ങൾ ലഭിക്കുക, മുൻകൂട്ടി ആസൂത്രണം ചെയ്യുക',
    view_predictions: 'പ്രവചനങ്ങൾ കാണുക',
    customize_your_experience: 'നിങ്ങളുടെ അനുഭവം ക്രമീകരിക്കുക',
    personalize_your_dashboard: 'നിങ്ങളുടെ ഡാഷ്‌ബോർഡ്, അറിയിപ്പ് മുൻഗണനകൾ, മറ്റു കാര്യങ്ങളും വ്യക്തിഗതമാക്കുക',
    go_to_settings: 'ക്രമീകരണങ്ങളിലേക്ക് പോകുക',
    email_extraction: 'ഇമെയിൽ ഡാറ്റ എക്സ്ട്രാക്ഷൻ',
    extraction_progress: 'എക്സ്ട്രാക്ഷൻ പുരോഗതി',
    processing_emails: 'നിങ്ങളുടെ ഇമെയിലുകൾ പ്രോസസ് ചെയ്യുന്നു...',
    ready_to_extract: 'നിങ്ങളുടെ ഇമെയിലുകളിൽ നിന്ന് ഡാറ്റ എക്സ്ട്രാക്റ്റ് ചെയ്യാൻ തയ്യാറാണ്',
    transaction_timeline: 'ഇടപാട് ടൈംലൈൻ',
    spending_by_category: 'വിഭാഗം അനുസരിച്ച് ചെലവ്',
    transaction_distribution: 'ഇടപാട് വിതരണം',
    select_language: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    language_changed: 'ഭാഷ വിജയകരമായി മാറ്റി',
    ai_accuracy_improvement: 'കൂടുതൽ വർഗ്ഗീകരണ നിർദ്ദേശങ്ങൾ അംഗീകരിക്കുകയോ ശരിയാക്കുകയോ ചെയ്യുമ്പോൾ AI കൃത്യത മെച്ചപ്പെടുന്നു',
    // FAQ responses
    faq_smart_budget: 'ഇത് ഒരു AI സഹായിയാണ്, ഉപയോക്താക്കൾക്ക് വരുമാനം നിയന്ത്രിക്കാനും ചെലവുകൾ ട്രാക്ക് ചെയ്യാനും പണം സമ്പാദിക്കാനും സഹായിക്കുന്നു.',
    faq_financial_education: 'അതെ, ആപ്പിനുള്ളിൽ നുറുങ്ങുകളും ചെറിയ ലേഖനങ്ങളും നിര്ദ്ദേശിക്കുന്നു.',
    faq_multi_language: 'അതെ, ഇംഗ്ലീഷ്, ഹിന്ദി, മലയാളം, കന്നഡ എന്നീ ഭാഷകൾ പിന്തുണയ്ക്കുന്നു.',
    faq_offline_mode: 'ഭാഗികമായി, ഉപയോക്താക്കൾക്ക് ഓഫ്‌ലൈനിൽ ഇൻപുട്ട് നൽകാം; ഓൺലൈനിൽ സിംക് ചെയ്യുന്നു.',
    faq_dark_mode: 'അതെ, ഉപയോക്താവിന്റെ സുഖത്തിനായി ലൈറ്റ്, ഡാർക്ക് മോഡുകൾ ലഭ്യമാണ്.',
    faq_share_account: 'ഇല್ല, സുരക്ഷയ്ക്കായി ഓരോ ഉപയോക്താവിനും ഒരു സ്വകാര്യ അക്കൗണ്ട് ഉണ്ട്.',
    faq_spending_forecast: 'അതെ, ഭാവി പ്രവചനങ്ങൾ ഗ്രാഫുകളും ടൈമ്ലൈനുകളും ആയി കാണിക്കുന്നു.',
    faq_subscriptions: 'അതെ, ആവർത്തിച്ചുള്ള സബ്‌സ്ക്രിപ്ഷനുകൾ ട്രാക്ക് ചെയ്യുകയും നവീകരണങ്ങളിൽ അലേർട്ട് ചെയ്യുകയും ചെയ്യുന്നു.',
    welcome_dashboard: "തിരികെ സ്വാഗതം! ഇതാണ് നിങ്ങളുടെ സാമ്പത്തിക അവലോകനം",
    select_time_range: "സമയം പരിധി തിരഞ്ഞെടുക്കുക",
    this_week: "ഈ ആഴ്ച",
    this_month: "ഈ മാസം",
    this_quarter: "ഈ പാദം",
    this_year: "ഈ വർഷം",
    vs_last_month: "കഴിഞ്ഞ മാസത്തേക്കാൾ",
    income_label: "വരുമാനം",
    expenses_label: "ചെലവുകൾ",
    savings_label: "സമ്പാദ്യങ്ങൾ",
    last_5_transactions: "അടുത്ത 5 ഇടപാടുകൾ",
    warning_over_80: "മുന്നറിയിപ്പ് (>80%)",
    financial_goals: "സാമ്പത്തിക ലക്ഷ്യങ്ങൾ",
    due: "തീയതി",
    of: "ഇതിൽ നിന്ന്",
    upcoming_bills: "ബരുവ ബില്ലുകൾ",
    ai_powered: "എഐ പവേർഡ്",
    chatgpt: 'എഐ സാമ്പത്തിക സഹായി',
    financial_health: 'financial health',
    tax_optimization: 'tax optimization',
    goals_tracker: 'goals tracker',
  },
  
  kn: {
    // Common
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    transactions: 'ವಹಿವಾಟುಗಳು',
    budget: 'ಬಜೆಟ್',
    history: 'ಇತಿಹಾಸ',
    reports: 'ವರದಿಗಳು',
    predictions: 'ಮುನ್ಸೂಚನೆಗಳು',
    tips: 'ಸ್ಮಾರ್ಟ್ ಸಲಹೆಗಳು',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    notifications: 'ಅಧಿಸೂಚನೆಗಳು',
    balance: 'ಬ್ಯಾಲೆನ್ಸ್',
    income: 'ಆದಾಯ',
    expenses: 'ವೆಚ್ಚಗಳು',
    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    main: 'ಮುಖ್ಯ',
    analytics: 'ವಿಶ್ಲೇಷಣೆ',
    account: 'ಖಾತೆ',
    sign_out: 'ಸೈನ್ ಔಟ್',
    
    // AI Assistant
    askAssistant: 'ನಿಮ್ಮ ಹಣಕಾಸು ಸಹಾಯಕನನ್ನು ಕೇಳಿ...',
    assistant: 'ಹಣಕಾಸು ಸಹಾಯಕ',
    assistantWelcome: 'ಹಲೋ! ನಾನು ನಿಮ್ಮ ಹಣಕಾಸು ಪ್ರಶ್ನೆಗಳಿಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ ಮತ್ತು ವೈಯಕ್ತಿಕ ಸಲಹೆ ನೀಡಬಲ್ಲೆ.',
    
    // Budget
    budgetManagement: 'ಬಜೆಟ್ ನಿರ್ವಹಣೆ',
    addBudget: 'ಬಜೆಟ್ ಸೇರಿಸಿ',
    category: 'ವರ್ಗ',
    monthlyLimit: 'ಮಾಸಿಕ ಮಿತಿ',
    createBudget: 'ಬಜೆಟ್ ರಚಿಸಿ',
    
    // Predictions
    expenseForecast: 'ವೆಚ್ಚದ ಮುನ್ಸೂಚನೆ',
    predictedSpending: 'ಮುಂದಿನ ತಿಂಗಳಿಗೆ ಊಹಿಸಲಾಗಿದೆ',
    aiConfidence: 'AI ವಿಶ್ವಾಸ',
    
    // Tips
    smartFinancialTips: 'ಸ್ಮಾರ್ಟ್ ಹಣಕಾಸು ಸಲಹೆಗಳು',
    personalizedRecommendations: 'ವೈಯಕ്ತಿಕಗೊಳಿಸಿದ ಶಿಫಾರಸುಗಳು',
    potentialSavings: 'ಸಂಭಾವ್ಯ ಉಳಿತಾಯಗಳು',
    
    // Language
    language: 'ಭಾಷೆ',
    english: 'ಇಂಗ್ಲಿಷ್',
    hindi: 'ಹಿಂದಿ',
    malayalam: 'ಮಲಯಾಳಂ',
    kannada: 'ಕನ್ನಡ',
    
    // New translations
    smart_categorization: 'ಸ್ಮಾರ್ಟ್ ವರ್ಗೀಕರಣ',
    receipt_upload: 'ರಸೀದಿ ಅಪ್‌ಲೋಡ್',
    recurring_transactions: 'ಪುನರಾವರ್ತಿತ ವಹಿವಾಟುಗಳು',
    search_transactions: 'ವಹಿವಾಟುಗಳನ್ನು ಹುಡುಕಿ',
    split_expenses: 'ವೆಚ್ಚಗಳನ್ನು ವಿಭಜಿಸಿ',
    multi_currency: 'ಬಹು ಕರೆನ್ಸಿ',
    download_reports: 'ವರದಿಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    savings_goals: 'ಉಳಿತಾಯ ಗುರಿಗಳು',
    ai_spending_insights: 'ಎಐ-ಪವರ್ಡ್ ಖರ್ಚು ಇ೦ನ್ಸೈಟ್‌ಗಳು',
    investment_tracker: 'ಹೂಡಿಕೆ ಟ್ರ್ಯಾಕರ್',
    debt_management: 'ಸಾಲ ನಿರ್ವಹಣೆ',
    logged_out_successfully: 'ನೀವು ಯಶಸ್ವಿಯಾಗಿ ಲಾಗ್ ಔಟ್ ಆಗಿದ್ದೀರಿ',
    search_transactions_and_categories: 'ವಹಿವಾಟುಗಳുಂ ವರ್ಗಗಳನ್ನು ಹುಡುಕಿ...',
    notifications_checked: 'ಅಧಿಸೂಚನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    budget_alert: 'ಬಜೆಟ್ ಎಚ್ಚರಿಕೆ',
    food_budget_alert: 'ನಿಮ್ಮ ಆಹಾರ ವರ್ಗವು ಮಾಸಿಕ ಬಜೆಟ್‌ನ 91% ಆಣ്',
    smart_tip_available: 'ಸ್ಮಾರ್ಟ್ ಟಿಪ് ಲಭ್ಯವಿದೆ',
    new_savings_opportunity: 'ನಿಮಗಾಗಿ ನಾವು ಹೊಸ ಉಳಿತಾಯ ಅವಕಾಶವನ್ನು ಕಂಡುಕೊಂಡಿದ್ದೇವೆ',
    new_prediction_ready: 'ಹೊಸ ಮುನ್ಸೂಚನೆ ಸಿದ್ಧವಾಗಿದೆ',
    next_month_prediction: 'ನಿಮ್ಮ ಮುಂದಿನ ತಿಂಗಳ ಮುನ್ಸೂಚನೆ ಸಿದ್ಧವಾಗಿದೆ',
    hours_ago: 'ಗಂಟೆಗಳ ಹಿಂದೆ',
    yesterday: 'ನಿನ್ನೆ',
    days_ago: 'ದಿನಗಳ ಹಿಂದೆ',
    mark_all_as_read: 'ಎಲ್ಲವನ್ನೂ ಓದಿದೆ ಎಂದು ಗುರುತಿಸಿ',
    view_all_notifications: 'ಎಲ್ಲಾ ಅಧಿಸೂಚನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    total_balance: 'ಒಟ್ಟು ಬ್ಯಾಲೆನ್ಸ್',
    monthly_income: 'ಮಾಸಿಕ ಆದಾಯ',
    monthly_expenses: 'ಮಾಸಿಕ ವೆಚ್ಚಗಳು',
    spending_overview: 'ವೆಚ್ಚದ ಅವಲೋಕನ',
    category_distribution: 'ವರ್ಗದ ವಿತರಣೆ',
    budget_progress: 'ಬಜೆಟ್ ಪ್ರಗತಿ',
    smart_insights: 'ಸ್ಮಾರ್ಟ್ ಒಳನೋಟಗಳು',
    recent_transactions: 'ಇತ್ತೀಚಿನ ವಹಿವಾಟುಗಳು',
    
    // Additional translations for Dashboard
    ai_insights: 'ಏಐ ಒಳನೋಟಗಳು',
    view_detailed_reports: 'ವಿವರವಾದ ವರದಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    view_all_transactions: 'ಎಲ್ಲಾ ವಹಿವಾಟುಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    manage_budgets: 'ಬಜೆಟ್‌ಗಳನ್ನು ನಿಯನ്ತ്ರಿಕ്ಕുಕ',
    view_all_insights: 'ಎಲ್ಲಾ ಒಳನೋಟಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    add_new_transaction: 'ಹೊಸ ವಹಿವಾಟನ್ನು ಸೇರಿಸಿ',
    forecast_your_finances: 'ನಿಮ್ಮ ಹಣಕಾಸನ್ನು ಮುನ್ಸೂಚನೆ ಮಾಡಿ',
    get_ai_powered_predictions: 'ನಿಮ್ಮ ಭವಿಷ್ಯದ ವೆಚ್ಚಗಳ ಬಗ್ಗೆ ಏಐ-ಪವರ್ಡ್ ಮುನ್ಸೂಚನೆಗಳನ್ನು ಪಡೆಯಿರಿ ಮತ್ತು ಮುൻಕൂಟ്ಟಿ ಆಸೂತ್ರಣವನ್ನು ಚೆಯ്ಯುಕ',
    view_predictions: 'ಮುನ್ಸೂಚನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    customize_your_experience: 'ನಿಮ್ಮ ಅನുಭವವನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ',
    personalize_your_dashboard: 'ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್, ಅಧಿಸೂಚನೆ ಆದ್ಯತೆಗಳು ಮತ್ತು ಇನ್ನೂ ಹೆಚ್ಚಿನವುಗಳನ್ನು ವೈಯಕ್ತೀಕರಿಸಿ',
    go_to_settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳಿಗೆ ಹೋಗಿ',
    email_extraction: 'ಇಮೇಲ್ ಡೇಟಾ ಹೊರತೆಗೆಯುವಿಕೆ',
    extraction_progress: 'ಹೊರತೆಗೆಯುವಿಕೆ ಪ್ರಗತಿ',
    processing_emails: 'ನಿಮ್ಮ ಇಮೇಲ್‌ಗಳನ್ನು ಪ್ರೊಸೆಸ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    ready_to_extract: 'ನಿಮ್ಮ ಇಮೇಲ್‌ಗಳಿಂದ ಡೇಟಾವನ್ನು ಹೊರತೆಗೆಯಲು ಸಿದ್ಧವಾಗಿದೆ',
    transaction_timeline: 'ವಹಿವಾಟು ಸಮಯರೇಖೆ',
    spending_by_category: 'ವರ್ಗದ ಪ್ರಕಾರ ಖರ್ಚು',
    transaction_distribution: 'ವಹಿವಾಟು ವಿತರಣೆ',
    select_language: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    language_changed: 'ಭಾಷೆ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ',
    ai_accuracy_improvement: 'ಹೆಚ್ಚಿನ ವರ್ಗೀಕರಣ ಸೂಚನೆಗಳನ್ನು ಅನುಮೋದಿಸಿದಾಗ ಅಥವಾ ಸರಿಪಡಿಸಿದಾಗ AI ನಿಖರತೆ ಸುಧಾರಿಸುತ್ತದೆ',
    // FAQ responses
    faq_smart_budget: 'ಇದು ಒಂದು AI ಸಹಾಯಕ, ಬಳಕೆದಾರರಿಗೆ ಆದಾಯವನ್ನು ನಿರ್ವಹಿಸಲು, ವೆಚ್ಚಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಮತ್ತು ಹಣವನ್ನು ಉಳಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
    faq_financial_education: 'ಹೌದು, ಟಿಪ್ಸ್ ಮತ್ತು ಚಿಕ್ಕ ಲೇಖನಗಳನ್ನು ಆಪ್‌ನಲ್ಲಿ ಸೂಚಿಸಲಾಗುತ್ತದೆ.',
    faq_multi_language: 'ಹೌದು, ಇಂಗ್ಲಿಷ್ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಭಾಷೆಗಳನ್ನು ಆಯ್ಕೆಯಾಗಿ ಬೆಂಬಲಿಸುತ್ತದೆ.',
    faq_offline_mode: 'ಭಾಗಶಃ, ಬಳಕೆದಾರರು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಇ೻ಪುಟ್ ನೀಡಬಹುದು; ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಸಿಂಕ್ ಆಗುತ್ತದೆ.',
    faq_dark_mode: 'ಹೌದು, ಬಳಕೆದಾರರ ಸುಖಕ್ಕಾಗಿ ಲೈಟ್ ಮತ್ತು ಡಾರ್ಕ್ ಮೋಡ್‌ಗಳು ಲಭ್ಯವಿವೆ.',
    faq_share_account: 'ಇಲ್ಲ, ಸುರಕ്ಷತೆಗಾಗಿ ಪ್ರತಿ ಬಳಕ്ಕൾಗಳಿಗೆ ಒಂದು ಖಾಸಗಿ ಖಾತೆ ಇದೆ.',
    faq_spending_forecast: 'ಹೌದು, ಭವಿಷ್ಯದ ಊಹೆಗಳನ್ನು ಗ್ರಾಫ್‌ಗಳು ಮತ್ತು ಟೈಮ್‌ಲೈನ್‌ಗಳಾಗಿ ತೋರಿಸಲಾಗುತ್ತದೆ.',
    faq_subscriptions: 'ಹೌದು, ಪುನರಾವರ್ತಿತ ಚಂದಾದಾರಿಕೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುತ್ತದೆ ಮತ್ತು ನವೀಕರಣಗಳಲ್ಲಿ ಎಚ್ಚರಿಕೆ ನೀಡುತ್ತದೆ.',
    welcome_dashboard: "ಮರಳಿ ಸ್ವಾಗತ! ಇದು ನಿಮ್ಮ ಹಣಕಾಸಿನ ಅವಲೋಕನವಾಗಿದೆ",
    select_time_range: "ಸಮಯಾವಧಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    this_week: "ಈ ವಾರ",
    this_month: "ಈ ತಿಂಗಳು",
    this_quarter: "ಈ ತ್ರೈಮಾಸಿಕ",
    this_year: "ಈ ವರ್ಷ",
    vs_last_month: "ಹಿಂದಿನ ತಿಂಗಳಿಗಿಂತ",
    income_label: "ಆದಾಯ",
    expenses_label: "ವೆಚ್ಚಗಳು",
    savings_label: "ಉಳಿತಾಯಗಳು",
    last_5_transactions: "ಇತ್ತೀಚಿನ 5 ವಹಿವಾಟುಗಳು",
    warning_over_80: "ಎಚ್ಚರಿಕೆ (>80%)",
    financial_goals: "ಹಣಕಾಸು ಗುರಿಗಳು",
    due: "ಪಾವತಿ ದಿನಾಂಕ",
    of: "ಯಲ್ಲಿ",
    upcoming_bills: "ಬರುವ ಬಿಲ್‌ಗಳು",
    ai_powered: "ಎಐ ಪವರ್ಡ್",
    chatgpt: 'ಎಐ ಹಣಕಾಸು ಸಹಾಯಕ',
    financial_health: 'financial health',
    tax_optimization: 'tax optimization',
    goals_tracker: 'goals tracker',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Initialize language from localStorage if available
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'hi', 'ml', 'kn'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value = { language, setLanguage, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
