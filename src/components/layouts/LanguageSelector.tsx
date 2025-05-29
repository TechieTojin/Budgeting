import React from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { Check, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  
  // Function to capitalize first letter of each word
  const capitalize = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: capitalize(t('english')), flag: '🇺🇸' },
    { code: 'hi', name: capitalize(t('hindi')), flag: '🇮🇳' },
    { code: 'ml', name: capitalize(t('malayalam')), flag: '🇮🇳' },
    { code: 'kn', name: capitalize(t('kannada')), flag: '🇮🇳' },
  ];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Globe className="h-5 w-5" />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center">
            {languages.find(lang => lang.code === language)?.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="capitalize">{capitalize(t('language'))}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer py-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {language === lang.code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
