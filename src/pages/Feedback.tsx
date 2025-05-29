import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Send, ThumbsUp, ThumbsDown, Star, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Feedback = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "",
    rating: "",
    title: "",
    description: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate sending an email
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...feedback,
          to: 'tojinsimson28@gmail.com',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback');
      }

      toast({
        title: "Feedback Sent",
        description: "Thank you for your feedback! We'll review it shortly.",
      });

      // Reset form
      setFeedback({
        type: "",
        rating: "",
        title: "",
        description: "",
        email: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
            <p className="text-muted-foreground">
              Share your thoughts and help us improve
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Send Feedback
              </CardTitle>
              <CardDescription>
                Your feedback helps us improve our service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Feedback Type</Label>
                  <Select
                    value={feedback.type}
                    onValueChange={(value) => setFeedback({ ...feedback, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select feedback type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="improvement">Improvement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        type="button"
                        variant={feedback.rating === star.toString() ? "default" : "outline"}
                        size="icon"
                        onClick={() => setFeedback({ ...feedback, rating: star.toString() })}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief summary of your feedback"
                    value={feedback.title}
                    onChange={(e) => setFeedback({ ...feedback, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide detailed feedback..."
                    value={feedback.description}
                    onChange={(e) => setFeedback({ ...feedback, description: e.target.value })}
                    required
                    className="min-h-[150px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={feedback.email}
                    onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Feedback
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-primary" />
                  Why Your Feedback Matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Help Us Improve</h3>
                  <p className="text-sm text-muted-foreground">
                    Your feedback directly influences our development priorities and helps us create a better experience for everyone.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Quick Response</h3>
                  <p className="text-sm text-muted-foreground">
                    We review all feedback and respond to important issues within 24-48 hours.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Feature Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Popular feature requests are prioritized in our development roadmap.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThumbsDown className="h-5 w-5 text-primary" />
                  Common Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Before Submitting</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Check if your issue has already been reported</li>
                    <li>• Include steps to reproduce the problem</li>
                    <li>• Provide screenshots if relevant</li>
                    <li>• Specify your device and browser details</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feedback; 