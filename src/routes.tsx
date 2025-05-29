import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Predictions from "./pages/Predictions";
import SmartTips from "./pages/SmartTips";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import SmartCategorization from "./pages/SmartCategorization";
import ReceiptUpload from "./pages/ReceiptUpload";
import DownloadReports from "./pages/DownloadReports";
import RecurringTransactions from "./pages/RecurringTransactions";
import SavingsGoals from "./pages/SavingsGoals";
import SplitExpenses from "./pages/SplitExpenses";
import SearchTransactions from "./pages/SearchTransactions";
import MultiCurrency from "./pages/MultiCurrency";
import AboutUs from "./pages/AboutUs";
import TransactionUpload from "./pages/TransactionUpload";
import SpendingInsights from "./pages/SpendingInsights";
import InvestmentTracker from "./pages/InvestmentTracker";
import DebtManagement from "./pages/DebtManagement";
import EmailExtraction from './pages/EmailExtraction';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import AIInsights from './pages/AIInsights';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import TipImplementation from './pages/TipImplementation';
import ChatGPT from './pages/ChatGPT';
import FinancialHealth from './pages/FinancialHealth';
import TaxOptimization from './pages/TaxOptimization';
import GoalsTracker from './pages/GoalsTracker';
import Feedback from './pages/Feedback';
import Learning from './pages/Learning';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/transaction-upload" element={<TransactionUpload />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/predictions" element={<ProtectedRoute><Predictions /></ProtectedRoute>} />
      <Route path="/tips" element={<ProtectedRoute><SmartTips /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/smart-categorization" element={<ProtectedRoute><SmartCategorization /></ProtectedRoute>} />
      <Route path="/receipt-upload" element={<ProtectedRoute><ReceiptUpload /></ProtectedRoute>} />
      <Route path="/download-reports" element={<ProtectedRoute><DownloadReports /></ProtectedRoute>} />
      <Route path="/recurring-transactions" element={<ProtectedRoute><RecurringTransactions /></ProtectedRoute>} />
      <Route path="/savings-goals" element={<ProtectedRoute><SavingsGoals /></ProtectedRoute>} />
      <Route path="/split-expenses" element={<ProtectedRoute><SplitExpenses /></ProtectedRoute>} />
      <Route path="/search-transactions" element={<ProtectedRoute><SearchTransactions /></ProtectedRoute>} />
      <Route path="/multi-currency" element={<ProtectedRoute><MultiCurrency /></ProtectedRoute>} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/spending-insights" element={<ProtectedRoute><SpendingInsights /></ProtectedRoute>} />
      <Route path="/investment-tracker" element={<ProtectedRoute><InvestmentTracker /></ProtectedRoute>} />
      <Route path="/debt-management" element={<ProtectedRoute><DebtManagement /></ProtectedRoute>} />
      <Route path="/email-extraction" element={<ProtectedRoute><EmailExtraction /></ProtectedRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/ai-insights" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} />
      <Route path="/tip-implementation" element={<TipImplementation />} />
      <Route path="/chatgpt" element={<ProtectedRoute><ChatGPT /></ProtectedRoute>} />
      <Route path="/financial-health" element={<ProtectedRoute><FinancialHealth /></ProtectedRoute>} />
      <Route path="/tax-optimization" element={<ProtectedRoute><TaxOptimization /></ProtectedRoute>} />
      <Route path="/goals-tracker" element={<ProtectedRoute><GoalsTracker /></ProtectedRoute>} />
      <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
      <Route path="/learning" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 