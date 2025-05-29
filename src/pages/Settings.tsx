import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Palette,
  FileText,
  Lock,
  Mail,
  Phone,
  Key,
  Trash2,
  Save,
  RefreshCw,
  Moon,
  Sun,
  Languages,
  HelpCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const Settings = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Implement real-time data refresh logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
    } finally {
      setIsLoading(false);
      }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('settings')}</h1>
            <p className="text-muted-foreground">
              {t('manage_your_account_settings_and_preferences')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                <CardDescription>
                    Update your personal details and contact information
                </CardDescription>
              </CardHeader>
                <CardContent className="space-y-4">
                          <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter your full name" />
                          </div>
                          <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="Enter your phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Tell us about yourself" />
                  </div>
                  <Button className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
              </CardContent>
            </Card>
            
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Language & Region
                  </CardTitle>
                <CardDescription>
                    Set your preferred language and regional settings
                </CardDescription>
              </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                    <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">EST</SelectItem>
                        <SelectItem value="pst">PST</SelectItem>
                        <SelectItem value="gmt">GMT</SelectItem>
                      </SelectContent>
                    </Select>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD</SelectItem>
                        <SelectItem value="eur">EUR</SelectItem>
                        <SelectItem value="gbp">GBP</SelectItem>
                        <SelectItem value="jpy">JPY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Password & Security
                  </CardTitle>
                <CardDescription>
                    Manage your password and security settings
                </CardDescription>
              </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="2fa" />
                    <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                  </div>
                  <Button className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
              </CardContent>
            </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Security Settings
                  </CardTitle>
                <CardDescription>
                    Configure additional security measures
                </CardDescription>
              </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Login Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified of new login attempts
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out after inactivity
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Remember Device</Label>
                        <p className="text-sm text-muted-foreground">
                        Keep me logged in on this device
                        </p>
                      </div>
                    <Switch />
                  </div>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notification Channels
                  </CardTitle>
                  <CardDescription>
                    Configure how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                        Receive push notifications
                        </p>
                      </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>In-App Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                        Show notifications within the app
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label>Notification Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                  <Button className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </Button>
              </CardContent>
            </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Notification Types
                  </CardTitle>
                <CardDescription>
                    Select which types of notifications to receive
                </CardDescription>
              </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Account & Security</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Account Updates</Label>
                          <p className="text-sm text-muted-foreground">
                              Important account changes
                          </p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Security Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                              Security-related notifications
                          </p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Login Attempts</Label>
                          <p className="text-sm text-muted-foreground">
                              New login notifications
                          </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Financial Updates</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Transaction Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                              New transaction notifications
                            </p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Budget Updates</Label>
                            <p className="text-sm text-muted-foreground">
                              Budget threshold alerts
                            </p>
                          </div>
                          <Switch />
                  </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Bill Reminders</Label>
                          <p className="text-sm text-muted-foreground">
                              Upcoming bill notifications
                          </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Updates & Marketing</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Product Updates</Label>
                          <p className="text-sm text-muted-foreground">
                              New features and improvements
                          </p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Special Offers</Label>
                            <p className="text-sm text-muted-foreground">
                              Promotions and discounts
                            </p>
                          </div>
                          <Switch />
                      </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Newsletter</Label>
                          <p className="text-sm text-muted-foreground">
                              Weekly financial insights
                          </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </Button>
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Theme Settings
                  </CardTitle>
                <CardDescription>
                    Customize the look and feel of your dashboard
                </CardDescription>
              </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme Mode</Label>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" className="flex-1">
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="grid grid-cols-4 gap-2">
                      <Button variant="outline" className="h-8 w-8 p-0 bg-blue-500" />
                      <Button variant="outline" className="h-8 w-8 p-0 bg-green-500" />
                      <Button variant="outline" className="h-8 w-8 p-0 bg-purple-500" />
                      <Button variant="outline" className="h-8 w-8 p-0 bg-orange-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use a more compact layout
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Button className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-primary" />
                    Display Settings
                  </CardTitle>
                  <CardDescription>
                    Configure how information is displayed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Format</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Weekends</Label>
                      <p className="text-sm text-muted-foreground">
                        Display weekends in calendar views
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Button className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Billing Information
                  </CardTitle>
                  <CardDescription>
                    Manage your billing details and subscription
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Plan</Label>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <p className="font-medium">Premium Plan</p>
                        <p className="text-sm text-muted-foreground">$29.99/month</p>
                      </div>
                      <Badge>Active</Badge>
                </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/24</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Update</Button>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Update Billing
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Billing History
                  </CardTitle>
                  <CardDescription>
                    View your past invoices and payments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <p className="font-medium">Invoice #{1000 + index}</p>
                          <p className="text-sm text-muted-foreground">Mar {index + 1}, 2024</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">$29.99</p>
                          <Button variant="outline" size="sm">Download</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    View All Invoices
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5 text-primary" />
                    General Preferences
                  </CardTitle>
                  <CardDescription>
                    Configure your general application preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-save</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically save changes
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Tooltips</Label>
                      <p className="text-sm text-muted-foreground">
                        Display helpful tooltips
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Keyboard Shortcuts</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable keyboard shortcuts
                      </p>
                    </div>
                    <Switch />
                </div>
                  <Button className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Help & Support
                  </CardTitle>
                  <CardDescription>
                    Get help and manage your support preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Support Channel</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred support channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="chat">Live Chat</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Send Usage Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Help improve the application
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Beta Features</Label>
                      <p className="text-sm text-muted-foreground">
                        Try new features before release
                      </p>
                    </div>
                    <Switch />
                      </div>
                  <Button className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </Button>
              </CardContent>
            </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
