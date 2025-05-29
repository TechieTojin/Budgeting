import React from "react";
import { Check, Circle, Utensils, Car, Home, Zap, Film, ShoppingBag, Activity, 
  User, BookOpen, TrendingUp, Briefcase, Globe, Building, Gift, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
};

// Map of all icons used
const iconMap = {
  Utensils: <Utensils className="h-6 w-6 mb-1" />,
  Car: <Car className="h-6 w-6 mb-1" />,
  Home: <Home className="h-6 w-6 mb-1" />,
  Zap: <Zap className="h-6 w-6 mb-1" />,
  Film: <Film className="h-6 w-6 mb-1" />,
  ShoppingBag: <ShoppingBag className="h-6 w-6 mb-1" />,
  Activity: <Activity className="h-6 w-6 mb-1" />,
  User: <User className="h-6 w-6 mb-1" />,
  BookOpen: <BookOpen className="h-6 w-6 mb-1" />,
  TrendingUp: <TrendingUp className="h-6 w-6 mb-1" />,
  Briefcase: <Briefcase className="h-6 w-6 mb-1" />,
  Globe: <Globe className="h-6 w-6 mb-1" />,
  Building: <Building className="h-6 w-6 mb-1" />,
  Gift: <Gift className="h-6 w-6 mb-1" />,
  RotateCcw: <RotateCcw className="h-6 w-6 mb-1" />,
  Circle: <Circle className="h-6 w-6 mb-1" />,
};

const categories: CategoryOption[] = [
  { value: "food", label: "Food & Dining", icon: iconMap.Utensils, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
  { value: "transportation", label: "Transportation", icon: iconMap.Car, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { value: "housing", label: "Housing", icon: iconMap.Home, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
  { value: "utilities", label: "Utilities", icon: iconMap.Zap, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { value: "entertainment", label: "Entertainment", icon: iconMap.Film, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
  { value: "shopping", label: "Shopping", icon: iconMap.ShoppingBag, color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
  { value: "healthcare", label: "Healthcare", icon: iconMap.Activity, color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
  { value: "personal", label: "Personal", icon: iconMap.User, color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { value: "education", label: "Education", icon: iconMap.BookOpen, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { value: "investment", label: "Investment", icon: iconMap.TrendingUp, color: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400" },
  { value: "other", label: "Other", icon: iconMap.Circle, color: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400" },
];

const incomeCategories: CategoryOption[] = [
  { value: "salary", label: "Salary", icon: iconMap.Briefcase, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
  { value: "freelance", label: "Freelance", icon: iconMap.Globe, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { value: "business", label: "Business", icon: iconMap.Building, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
  { value: "investment", label: "Investment", icon: iconMap.TrendingUp, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
  { value: "gift", label: "Gift", icon: iconMap.Gift, color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
  { value: "refund", label: "Refund", icon: iconMap.RotateCcw, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { value: "other", label: "Other", icon: iconMap.Circle, color: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400" },
];

type CategorySelectorProps = {
  value: string;
  onChange: (value: string) => void;
  type?: 'expense' | 'income';
};

export function CategorySelector({ value, onChange, type = 'expense' }: CategorySelectorProps) {
  const options = type === 'expense' ? categories : incomeCategories;
  
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
      {options.map((category) => {
        const isSelected = value === category.value;
        
        return (
          <button
            key={category.value}
            type="button"
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg transition-all hover:bg-background-hover",
              category.color,
              isSelected ? "ring-2 ring-primary ring-offset-1" : "ring-0"
            )}
            onClick={() => onChange(category.value)}
          >
            <div className="relative">
              {category.icon}
              {isSelected && (
                <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <span className="text-xs font-medium truncate max-w-full">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default CategorySelector; 