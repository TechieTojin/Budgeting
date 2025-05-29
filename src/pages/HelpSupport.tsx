import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  MessageCircle,
  BookOpen,
  Mail,
  Phone,
  MessageSquare,
  Search,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

interface ContactMethod {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

const HelpSupport = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample FAQs
  const faqs: FAQ[] = [
    {
      question: "How do I create a new budget?",
      answer: "To create a new budget, go to the Budgets page and click the 'Create Budget' button. You can then set your income, expenses, and savings goals. The system will help you track your spending and stay within your budget limits.",
      category: "Budgeting"
    },
    {
      question: "How do I connect my bank account?",
      answer: "You can connect your bank account by going to Settings > Connected Accounts. We use bank-level security to ensure your data is protected. Currently, we support major banks in the US, UK, and EU.",
      category: "Account"
    },
    {
      question: "How do I export my financial data?",
      answer: "You can export your financial data by going to Settings > Export Data. You can choose to export your transactions, budgets, and reports in CSV or PDF format.",
      category: "Data"
    },
    {
      question: "How do I set up recurring transactions?",
      answer: "To set up recurring transactions, go to the Transactions page and click on a transaction. Select 'Make Recurring' and choose the frequency (daily, weekly, monthly, etc.).",
      category: "Transactions"
    },
    {
      question: "How do I customize my dashboard?",
      answer: "You can customize your dashboard by clicking the 'Customize' button in the top right corner. You can add, remove, or rearrange widgets to show the information that's most important to you.",
      category: "Dashboard"
    }
  ];

  // Contact methods
  const contactMethods: ContactMethod[] = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: <Mail className="h-5 w-5" />,
      action: () => window.location.href = "mailto:support@budgeting.com"
    },
    {
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      icon: <MessageSquare className="h-5 w-5" />,
      action: () => toast.info("Live chat coming soon!")
    },
    {
      title: "Phone Support",
      description: "Call us at +1 (555) 123-4567",
      icon: <Phone className="h-5 w-5" />,
      action: () => window.location.href = "tel:+15551234567"
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
            <p className="text-muted-foreground">
              Get help with Budgeting and manage your account
            </p>
          </div>
        </div>

        <Tabs defaultValue="faq" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Find answers to common questions about Budgeting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search FAQs..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{faq.category}</Badge>
                          {faq.question}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contactMethods.map((method, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {method.icon}
                      {method.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {method.description}
                    </p>
                    <Button onClick={method.action} className="w-full">
                      Contact Us
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Enter the subject" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Enter your message"
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button
                    onClick={() => toast.success("Message sent successfully!")}
                    className="w-full"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Documentation
                </CardTitle>
                <CardDescription>
                  Learn how to use Budgeting effectively
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>Getting Started</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Learn the basics of Budgeting and set up your account
                      </p>
                      <Button variant="outline" className="w-full">
                        Read Guide
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>Budgeting Guide</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Master the art of budgeting with our comprehensive guide
                      </p>
                      <Button variant="outline" className="w-full">
                        Read Guide
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>Advanced Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Explore advanced features and customization options
                      </p>
                      <Button variant="outline" className="w-full">
                        Read Guide
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default HelpSupport; 