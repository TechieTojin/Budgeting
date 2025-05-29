import { useLanguage } from '@/contexts/LanguageContext';

export function CategorizationStats() {
  const { t } = useLanguage();
  
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <div className="text-xs text-muted-foreground">
          {t('ai_accuracy_improvement')}
        </div>
      </div>
    </div>
  );
} 