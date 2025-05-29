import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, X, ArrowDownCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Financial Assistant Knowledge Base
const financialAssistantFAQ: Record<string, string> = {
  "smart financial budget": "It's an AI assistant that helps users manage income, track expenses, and save money smarter.",
  "target users": "Individuals who want better financial control, especially young adults, families, and students.",
  "problems": "Helps users plan budgets, reduce overspending, and meet savings goals easily.",
  "data collection": "Users input expenses manually or connect bank accounts through APIs securely.",
  "budget categories": "Categories like food, rent, travel, shopping, healthcare, and entertainment.",
  "personalized budgets": "Yes, based on income, spending history, and future goals automatically.",
  "expenses tracking": "By analyzing entered transactions or synced bank data continuously.",
  "savings tips": "Yes, it gives monthly tips and suggests cutbacks where possible.",
  "budget updates": "Budgets update daily or weekly based on new transactions.",
  "financial goals": "Yes, users can set savings targets and track progress.",
  "ai technologies": "Natural Language Processing (NLP) for chats and Machine Learning (ML) for predictions.",
  "assistant type": "It's a hybrid, combining fixed rules and learning patterns.",
  "user understanding": "NLP models process user inputs, intents, and categorize them smartly.",
  "programming language": "Mainly Python with frameworks like TensorFlow, Flask, and Dialogflow.",
  "future spending": "Machine learning models use past data to forecast expenses.",
  "expense categorization": "NLP keyword matching or ML classification sorts expenses automatically.",
  "chatbot interface": "Yes, users can chat with the assistant for managing finances.",
  "voice interaction": "Optional, voice commands can be added using Google Speech APIs.",
  "income consideration": "Users input monthly income manually or connect salary accounts.",
  "third-party apis": "Yes, bank APIs and payment gateways are used for transactions.",
  "add expense": "Type the expense manually or use voice command to add it instantly.",
  "set savings goal": "Open \"Goals\" section, set amount and timeframe, and start saving.",
  "over budget": "User gets alerts, warnings, and suggestions to adjust spending.",
  "spending reminders": "Yes, daily, weekly, or custom reminders can be scheduled.",
  "monthly reports": "Yes, detailed reports with graphs and insights are available.",
  "adjust budgets": "Yes, users can modify budgets anytime through settings.",
  "budget insights": "Using colorful charts, graphs, and pie diagrams.",
  "spending summary": "Yes, users receive daily, weekly, or monthly summaries.",
  "investment plans": "Optionally yes, based on user interest and risk appetite.",
  "multiple accounts": "Yes, users can link and manage multiple bank accounts.",
  "data protection": "Data is encrypted and stored securely on cloud or device.",
  "authentication": "Yes, login via password, OTP, or biometric authentication.",
  "data sharing": "No, all user data stays private and confidential.",
  "third-party apps": "Only secure and verified apps are allowed for integrations.",
  "gdpr compliance": "Yes, full GDPR and data protection regulations are followed.",
  "savings tips generation": "Based on expense patterns, AI suggests personalized saving tips.",
  "unusual spending": "Yes, ML models flag any abnormal or high transactions.",
  "budget optimization": "Reallocates funds based on spending habits and goals.",
  "emergency funds": "Yes, users can allocate emergency budgets separately.",
  "custom categories": "Yes, users can add, delete, or rename budget categories.",
  "goal tracking": "Yes, real-time progress tracking for all savings goals.",
  "customizable notifications": "Yes, users set when and how they get budget alerts.",
  "export reports": "Yes, in PDF, Excel, or CSV formats.",
  "financial education": "Yes, tips and short articles are suggested inside the app.",
  "multi-language": "Yes, supports English and regional languages optionally.",
  "offline mode": "Partially, users can input offline; syncs when online.",
  "dark mode": "Yes, light and dark modes are available for user comfort.",
  "share account": "No, each user has a private account for security.",
  "spending forecast": "Yes, future predictions shown as graphs and timelines.",
  "subscriptions": "Yes, tracks recurring subscriptions and alerts on renewals."
};

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I can help you with your financial questions and provide personalized advice based on your spending patterns and goals.',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    setMessages(prev => [...prev, {
      role: 'user',
      content: message,
      timestamp: new Date()
    }]);
    
    // Clear input
    setMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      generateResponse(message);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    let response = '';
    
    // Check for exact matches with FAQs first
    if (lowerCaseMessage.includes('what is smart financial budget')) {
      response = financialAssistantFAQ["smart financial budget"];
    }
    else if (lowerCaseMessage.includes('target users') || (lowerCaseMessage.includes('who') && lowerCaseMessage.includes('target'))) {
      response = financialAssistantFAQ["target users"];
    }
    else if (lowerCaseMessage.includes('problems') || lowerCaseMessage.includes('what problems does it solve')) {
      response = financialAssistantFAQ["problems"];
    }
    else if (lowerCaseMessage.includes('collect data') || lowerCaseMessage.includes('data collection')) {
      response = financialAssistantFAQ["data collection"];
    }
    else if (lowerCaseMessage.includes('budget categories') || lowerCaseMessage.includes('what categories')) {
      response = financialAssistantFAQ["budget categories"];
    }
    else if (lowerCaseMessage.includes('personalized budget')) {
      response = financialAssistantFAQ["personalized budgets"];
    }
    else if (lowerCaseMessage.includes('track expenses') || lowerCaseMessage.includes('how are expenses tracked')) {
      response = financialAssistantFAQ["expenses tracking"];
    }
    else if (lowerCaseMessage.includes('savings tips') || lowerCaseMessage.includes('suggest savings')) {
      response = financialAssistantFAQ["savings tips"];
    }
    else if (lowerCaseMessage.includes('update budget') || lowerCaseMessage.includes('budget updated')) {
      response = financialAssistantFAQ["budget updates"];
    }
    else if (lowerCaseMessage.includes('financial goals') || lowerCaseMessage.includes('saving goals')) {
      response = financialAssistantFAQ["financial goals"];
    }
    else if (lowerCaseMessage.includes('ai technologies') || lowerCaseMessage.includes('which ai')) {
      response = financialAssistantFAQ["ai technologies"];
    }
    else if (lowerCaseMessage.includes('rule-based') || lowerCaseMessage.includes('assistant rule')) {
      response = financialAssistantFAQ["assistant type"];
    }
    else if (lowerCaseMessage.includes('understand users')) {
      response = financialAssistantFAQ["user understanding"];
    }
    else if (lowerCaseMessage.includes('language') && lowerCaseMessage.includes('built')) {
      response = financialAssistantFAQ["programming language"];
    }
    else if (lowerCaseMessage.includes('future spending') || lowerCaseMessage.includes('spending predicted')) {
      response = financialAssistantFAQ["future spending"];
    }
    else if (lowerCaseMessage.includes('expenses categorized')) {
      response = financialAssistantFAQ["expense categorization"];
    }
    else if (lowerCaseMessage.includes('chatbot interface')) {
      response = financialAssistantFAQ["chatbot interface"];
    }
    else if (lowerCaseMessage.includes('voice interaction')) {
      response = financialAssistantFAQ["voice interaction"];
    }
    else if (lowerCaseMessage.includes('income considered')) {
      response = financialAssistantFAQ["income consideration"];
    }
    else if (lowerCaseMessage.includes('third-party api')) {
      response = financialAssistantFAQ["third-party apis"];
    }
    else if (lowerCaseMessage.includes('add expense') || lowerCaseMessage.includes('how to add')) {
      response = financialAssistantFAQ["add expense"];
    }
    else if (lowerCaseMessage.includes('set savings goal') || lowerCaseMessage.includes('how to set')) {
      response = financialAssistantFAQ["set savings goal"];
    }
    else if (lowerCaseMessage.includes('over budget') || lowerCaseMessage.includes('what happens if')) {
      response = financialAssistantFAQ["over budget"];
    }
    else if (lowerCaseMessage.includes('reminders') || lowerCaseMessage.includes('spending reminders')) {
      response = financialAssistantFAQ["spending reminders"];
    }
    else if (lowerCaseMessage.includes('monthly reports') || lowerCaseMessage.includes('reports generated')) {
      response = financialAssistantFAQ["monthly reports"];
    }
    else if (lowerCaseMessage.includes('adjust budgets') || lowerCaseMessage.includes('can users adjust')) {
      response = financialAssistantFAQ["adjust budgets"];
    }
    else if (lowerCaseMessage.includes('budget insights') || lowerCaseMessage.includes('insights displayed')) {
      response = financialAssistantFAQ["budget insights"];
    }
    else if (lowerCaseMessage.includes('spending summary') || lowerCaseMessage.includes('summary available')) {
      response = financialAssistantFAQ["spending summary"];
    }
    else if (lowerCaseMessage.includes('investment plans')) {
      response = financialAssistantFAQ["investment plans"];
    }
    else if (lowerCaseMessage.includes('multiple accounts') || lowerCaseMessage.includes('support for multiple')) {
      response = financialAssistantFAQ["multiple accounts"];
    }
    else if (lowerCaseMessage.includes('data protected') || lowerCaseMessage.includes('user data protection')) {
      response = financialAssistantFAQ["data protection"];
    }
    else if (lowerCaseMessage.includes('authentication')) {
      response = financialAssistantFAQ["authentication"];
    }
    else if (lowerCaseMessage.includes('data shared') || lowerCaseMessage.includes('financial data shared')) {
      response = financialAssistantFAQ["data sharing"];
    }
    else if (lowerCaseMessage.includes('third-party apps')) {
      response = financialAssistantFAQ["third-party apps"];
    }
    else if (lowerCaseMessage.includes('gdpr')) {
      response = financialAssistantFAQ["gdpr compliance"];
    }
    else if (lowerCaseMessage.includes('savings tips generated')) {
      response = financialAssistantFAQ["savings tips generation"];
    }
    else if (lowerCaseMessage.includes('unusual spending') || lowerCaseMessage.includes('detect unusual')) {
      response = financialAssistantFAQ["unusual spending"];
    }
    else if (lowerCaseMessage.includes('optimize budgets') || lowerCaseMessage.includes('budget optimization')) {
      response = financialAssistantFAQ["budget optimization"];
    }
    else if (lowerCaseMessage.includes('emergency funds') || lowerCaseMessage.includes('support emergency')) {
      response = financialAssistantFAQ["emergency funds"];
    }
    else if (lowerCaseMessage.includes('custom categories') || lowerCaseMessage.includes('create custom')) {
      response = financialAssistantFAQ["custom categories"];
    }
    else if (lowerCaseMessage.includes('goal tracking') || lowerCaseMessage.includes('tracking available')) {
      response = financialAssistantFAQ["goal tracking"];
    }
    else if (lowerCaseMessage.includes('notifications customizable')) {
      response = financialAssistantFAQ["customizable notifications"];
    }
    else if (lowerCaseMessage.includes('export reports') || lowerCaseMessage.includes('can users export')) {
      response = financialAssistantFAQ["export reports"];
    }
    else if (lowerCaseMessage.includes('financial education')) {
      response = financialAssistantFAQ["financial education"];
    }
    else if (lowerCaseMessage.includes('multi-language') || lowerCaseMessage.includes('language support')) {
      response = financialAssistantFAQ["multi-language"];
    }
    else if (lowerCaseMessage.includes('offline mode')) {
      response = financialAssistantFAQ["offline mode"];
    }
    else if (lowerCaseMessage.includes('dark mode')) {
      response = financialAssistantFAQ["dark mode"];
    }
    else if (lowerCaseMessage.includes('share account') || lowerCaseMessage.includes('multiple users')) {
      response = financialAssistantFAQ["share account"];
    }
    else if (lowerCaseMessage.includes('spending forecast') || lowerCaseMessage.includes('forecast visualized')) {
      response = financialAssistantFAQ["spending forecast"];
    }
    else if (lowerCaseMessage.includes('handle subscriptions')) {
      response = financialAssistantFAQ["subscriptions"];
    }
    // Fallback responses for general queries
    else if (lowerCaseMessage.includes('budget') || lowerCaseMessage.includes('spending limit')) {
      response = "Based on your spending patterns, I recommend allocating 50% of your income to necessities, 30% to wants, and 20% to savings. Would you like me to help you set up a specific budget category?";
    } 
    else if (lowerCaseMessage.includes('save') || lowerCaseMessage.includes('saving')) {
      response = "Looking at your transactions, I noticed you could save about ₹850 monthly by reducing food delivery expenses. Would you like more specific saving recommendations?";
    } 
    else if (lowerCaseMessage.includes('invest') || lowerCaseMessage.includes('investment')) {
      response = "With your current savings rate, you could consider investing 15% of your monthly income. Would you like information on low-risk investment options?";
    } 
    else if (lowerCaseMessage.includes('predict') || lowerCaseMessage.includes('forecast')) {
      response = "Based on your historical data, I predict your expenses will increase by approximately 8% next month, primarily in the entertainment category due to seasonal patterns.";
    } 
    else {
      response = "I understand you're asking about your finances. Could you be more specific with your question? I can help with budgeting, saving strategies, expense analysis, or future predictions.";
    }
    
    // Add AI response to chat
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }]);
    
    // Show toast notification
    toast.success("New AI insight available");
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const faqResponses = {
    'What is Smart Budget?': t('faq_smart_budget'),
    'Does it provide financial education?': t('faq_financial_education'),
    'Does it support multiple languages?': t('faq_multi_language'),
    'Can I use it offline?': t('faq_offline_mode'),
    'Does it have dark mode?': t('faq_dark_mode'),
    'Can I share my account?': t('faq_share_account'),
    'Does it show spending forecasts?': t('faq_spending_forecast'),
    'Does it track subscriptions?': t('faq_subscriptions')
  };

  return (
    <>
      {/* Floating button */}
      <Button
        onClick={toggleAssistant}
        className="fixed bottom-5 right-5 rounded-full h-14 w-14 shadow-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
      
      {/* Assistant panel */}
      <div className={`fixed bottom-20 right-5 w-80 md:w-96 transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}>
        <Card className="shadow-xl border-2 border-primary/20">
          <CardHeader className="py-3 bg-primary/5">
            <CardTitle className="text-md flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>{t('assistant')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-3 border-t flex space-x-2">
              <Input
                placeholder={t('askAssistant')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Scroll to bottom button (appears only when more messages) */}
      {messages.length > 5 && isOpen && (
        <Button
          onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="fixed bottom-[340px] right-5 rounded-full h-8 w-8 shadow-lg bg-primary/20"
          size="icon"
          variant="ghost"
        >
          <ArrowDownCircle className="h-5 w-5" />
        </Button>
      )}
    </>
  );
};
