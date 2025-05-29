import React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Clock, 
  Award, 
  Code, 
  Briefcase, 
  Globe, 
  BookOpen, 
  Coffee, 
  Heart, 
  Users,
  Twitter,
  Cpu
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AboutUs = () => {
  const { t } = useLanguage();
  
  // Function to capitalize first letter of each word
  const capitalize = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Timeline data
  const timelineEvents = [
    {
      date: "January 2023",
      title: "Project Inception",
      description: "The concept for Budgeting was born during a university project discussion on practical applications of AI in everyday life."
    },
    {
      date: "March 2023",
      title: "Initial Prototype",
      description: "First prototype developed with basic expense tracking and budgeting features."
    },
    {
      date: "June 2023",
      title: "AI Integration",
      description: "Integration of machine learning algorithms for spending pattern analysis and predictive insights."
    },
    {
      date: "August 2023",
      title: "Beta Testing",
      description: "Limited release to university students and faculty for feedback and refinement."
    },
    {
      date: "October 2023",
      title: "Mobile App Development",
      description: "Expansion to mobile platforms with native iOS and Android applications."
    },
    {
      date: "January 2024",
      title: "Official Launch",
      description: "Public release of Budgeting with full feature set and cross-platform support."
    },
    {
      date: "March 2024",
      title: "10,000 Users Milestone",
      description: "Budgeting reaches 10,000 active users across all platforms."
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-10">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/5 to-background p-8 md:p-10">
          <div className="absolute -top-24 -right-24 opacity-20">
            <Cpu className="h-64 w-64 rotate-12 text-primary" />
          </div>
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight mb-2">About Budgeting</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              We're building the future of personal finance management with AI-powered insights and intelligent automation
            </p>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/10">
                AI-Powered
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/10">
                Smart Budgeting
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/10">
                Financial Insights
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/10">
                Secure & Private
              </Badge>
            </div>
          </motion.div>
        </div>
        
        <Tabs defaultValue="team" className="w-full">
          <TabsList className="w-full sm:w-[400px] mb-8">
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Our Team</span>
            </TabsTrigger>
            <TabsTrigger value="story" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Our Story</span>
            </TabsTrigger>
            <TabsTrigger value="mission" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Our Mission</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="team" className="space-y-8 mt-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tojin's Profile */}
              <motion.div
                custom={0} 
                initial="hidden" 
                animate="visible" 
                variants={fadeIn}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border-2 border-primary/10 shadow-lg h-full">
                  <div className="bg-gradient-to-r from-budget-teal to-budget-teal2/60 p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                        <AvatarImage src="https://github.com/shadcn.png" alt="Tojin Varkey Simson" />
                        <AvatarFallback className="text-xl">TVS</AvatarFallback>
                      </Avatar>
                      <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-white">Tojin Varkey Simson</h2>
                        <p className="text-white/90">MCA Student, CHRIST (Deemed-to-be University)</p>
                        <div className="flex mt-2 justify-center sm:justify-start gap-2">
                          <Button variant="ghost" size="icon" className="rounded-full bg-white/20 text-white hover:bg-white/30">
                            <Github className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-full bg-white/20 text-white hover:bg-white/30">
                            <Linkedin className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-full bg-white/20 text-white hover:bg-white/30">
                            <Twitter className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-full bg-white/20 text-white hover:bg-white/30">
                            <Mail className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        About
                      </h3>
                      <p className="text-muted-foreground">
                        Tojin Varkey Simson is a passionate and dedicated postgraduate student currently pursuing his Master of Computer Applications (MCA) at CHRIST (Deemed-to-be University), Bengaluru. With a deep interest in software development, artificial intelligence, and cybersecurity, Tojin is committed to applying his skills and knowledge to real-world projects and gaining valuable industry experience.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4 text-primary" />
                        Projects
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                            <Briefcase className="h-3 w-3 text-primary" />
                          </div>
                          Movie Recommendation System (Android, MVVM)
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                            <Briefcase className="h-3 w-3 text-primary" />
                          </div>
                          Personalized Planner App
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                            <Briefcase className="h-3 w-3 text-primary" />
                          </div>
                          Library Management System with chatbot assistance
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                            <Briefcase className="h-3 w-3 text-primary" />
                          </div>
                          College Management System
                        </li>
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">Java</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">Python</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">C</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">Node.js</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">SQL</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">MongoDB</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">AWS</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">Git</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">MVVM</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">Android</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Research
                      </h3>
                      <p className="text-muted-foreground">
                        Deep Learning for Fake News Detection
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Jaiby's Profile */}
              <motion.div
                custom={1} 
                initial="hidden" 
                animate="visible" 
                variants={fadeIn}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border-2 border-primary/10 shadow-lg h-full">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                        <AvatarImage src="https://avatars.githubusercontent.com/u/124247490" alt="Jaiby Mariya Joseph" />
                        <AvatarFallback className="text-xl">JMJ</AvatarFallback>
                      </Avatar>
                      <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-white">Jaiby Mariya Joseph</h2>
                        <p className="text-white/90">MCA Student, CHRIST University</p>
                        <div className="flex mt-2 justify-center sm:justify-start gap-2">
                          <Button variant="ghost" size="icon" className="rounded-full bg-white/20 text-white hover:bg-white/30">
                            <Github className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-full bg-white/20 text-white hover:bg-white/30">
                            <Linkedin className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-full bg-white/20 text-white hover:bg-white/30">
                            <Twitter className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-full bg-white/20 text-white hover:bg-white/30">
                            <Mail className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        About
                      </h3>
                      <p className="text-muted-foreground">
                        Jaiby Mariya Joseph is an ambitious and talented postgraduate student currently pursuing her Master of Computer Applications (MCA) at CHRIST University, Bangalore. She is deeply passionate about technology, programming, and data analysis, and has consistently demonstrated a strong commitment to academic excellence and professional growth throughout her educational journey.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4 text-primary" />
                        Projects
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                            <Briefcase className="h-3 w-3 text-primary" />
                          </div>
                          College Management System (Node.js, Express.js)
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                            <Briefcase className="h-3 w-3 text-primary" />
                          </div>
                          Bus Reservation System (C)
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                            <Briefcase className="h-3 w-3 text-primary" />
                          </div>
                          Detection and Mitigation of Ransomware Attacks Using Machine Learning
                        </li>
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">C</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">Python</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">SQL</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">R Programming</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">Microsoft Excel</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">SAS</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">MongoDB</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">Node.js</span>
                        <span className="bg-primary/10 px-2 py-1 rounded-md text-sm">Express.js</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Leadership Roles
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                            <Award className="h-3 w-3 text-primary" />
                          </div>
                          Placement Representative at CHRIST University
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                            <Award className="h-3 w-3 text-primary" />
                          </div>
                          Academic Representative at St. Joseph's College
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="story" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">The Budgeting Journey</CardTitle>
                <CardDescription>
                  How a university project evolved into a powerful AI-driven financial management platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative border-l-2 border-primary/20 pl-6 ml-6 space-y-10">
                  {timelineEvents.map((event, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="relative"
                    >
                      <div className="absolute -left-[33px] p-1.5 rounded-full bg-background border-2 border-primary">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <Badge variant="outline" className="mb-2 bg-primary/5">
                          {event.date}
                        </Badge>
                        <h3 className="font-medium text-lg">{event.title}</h3>
                        <p className="text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mission" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Mission & Vision</CardTitle>
                <CardDescription>
                  What drives us and where we're headed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-muted/50 p-6 rounded-lg border"
                  >
                    <div className="rounded-full bg-primary/10 p-2 w-fit mb-4">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-3">Our Mission</h3>
                    <p className="text-muted-foreground mb-4">
                      To democratize financial intelligence and empower individuals to make smarter financial decisions through
                      innovative technology and AI-driven insights, regardless of their financial literacy level.
                    </p>
                    <div className="space-y-3 mt-6">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-green-100 p-1 mt-0.5">
                          <Heart className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Financial Empowerment</h4>
                          <p className="text-sm text-muted-foreground">Helping users understand and take control of their finances</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Inclusivity</h4>
                          <p className="text-sm text-muted-foreground">Making financial tools accessible to everyone</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-amber-100 p-1 mt-0.5">
                          <Code className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Innovation</h4>
                          <p className="text-sm text-muted-foreground">Continuously improving our technology</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-muted/50 p-6 rounded-lg border"
                  >
                    <div className="rounded-full bg-primary/10 p-2 w-fit mb-4">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-3">Our Vision</h3>
                    <p className="text-muted-foreground mb-4">
                      To become the leading AI-powered financial companion that helps millions of people worldwide achieve financial 
                      wellness through personalized guidance, intelligent automation, and meaningful insights.
                    </p>
                    <div className="space-y-3 mt-6">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-purple-100 p-1 mt-0.5">
                          <Coffee className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Global Impact</h4>
                          <p className="text-sm text-muted-foreground">Helping people across cultures and regions</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-pink-100 p-1 mt-0.5">
                          <Cpu className="h-4 w-4 text-pink-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">AI Excellence</h4>
                          <p className="text-sm text-muted-foreground">Leading in AI-powered financial technology</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-orange-100 p-1 mt-0.5">
                          <Briefcase className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Financial Wellbeing</h4>
                          <p className="text-sm text-muted-foreground">Creating a world of financial stability</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-gradient-to-r from-primary/5 to-background rounded-xl border shadow-sm p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">Join the Financial Revolution</h2>
              <p className="text-muted-foreground">
                Budgeting is constantly evolving. We're looking for passionate individuals to join our team and help shape the future of financial technology.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1">
                <Mail className="h-4 w-4" />
                Contact Us
              </Button>
              <Button className="gap-1">
                <Users className="h-4 w-4" />
                Join Our Team
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AboutUs; 