
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, AlertTriangle, Check, Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  description: string;
  type: "alert" | "warning" | "info" | "success";
  isRead: boolean;
  timestamp: Date;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Budget Alert",
      description: "Your Food category is at 91% of monthly budget.",
      type: "alert",
      isRead: false,
      timestamp: new Date(2024, 3, 8, 10, 30),
    },
    {
      id: "2",
      title: "Transaction Recorded",
      description: "A new expense of $75.50 has been recorded in Food category.",
      type: "info",
      isRead: true,
      timestamp: new Date(2024, 3, 7, 15, 45),
    },
    {
      id: "3",
      title: "Budget Warning",
      description: "Your Entertainment category is at 75% of monthly budget.",
      type: "warning",
      isRead: false,
      timestamp: new Date(2024, 3, 6, 9, 15),
    },
    {
      id: "4",
      title: "Monthly Report Available",
      description: "Your March 2024 financial report is now available for review.",
      type: "info",
      isRead: true,
      timestamp: new Date(2024, 3, 5, 8, 0),
    },
    {
      id: "5",
      title: "Recurring Expense",
      description: "Your monthly Netflix subscription ($14.99) will be charged tomorrow.",
      type: "warning",
      isRead: false,
      timestamp: new Date(2024, 3, 4, 16, 30),
    },
    {
      id: "6",
      title: "Savings Goal Achieved",
      description: "Congratulations! You've reached your Emergency Fund savings goal of $5,000.",
      type: "success",
      isRead: true,
      timestamp: new Date(2024, 3, 3, 11, 20),
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
    toast.success("Notification marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
    toast.success("Notification deleted");
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, isRead: true }))
    );
    toast.success("All notifications marked as read");
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
    toast.success("All notifications deleted");
  };

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <Bell className="h-5 w-5 text-amber-500" />;
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "No new notifications"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={markAllAsRead} disabled={!unreadCount}>
              Mark All as Read
            </Button>
            <Button variant="outline" onClick={deleteAllNotifications} disabled={!notifications.length}>
              Delete All
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:w-[400px] mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))
            ) : (
              <EmptyNotifications />
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {notifications.filter((n) => !n.isRead).length > 0 ? (
              notifications
                .filter((n) => !n.isRead)
                .map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
            ) : (
              <EmptyNotifications message="No unread notifications" />
            )}
          </TabsContent>

          <TabsContent value="read" className="space-y-4">
            {notifications.filter((n) => n.isRead).length > 0 ? (
              notifications
                .filter((n) => n.isRead)
                .map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
            ) : (
              <EmptyNotifications message="No read notifications" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <Bell className="h-5 w-5 text-amber-500" />;
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className={cn(notification.isRead ? "" : "border-l-4 border-l-primary")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="mt-1">{getTypeIcon(notification.type)}</div>
            <div>
              <div className="font-medium">{notification.title}</div>
              <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {format(notification.timestamp, "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
              >
                Mark as Read
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(notification.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyNotifications = ({ message = "No notifications found" }: { message?: string }) => (
  <Card>
    <CardHeader className="text-center">
      <CardTitle className="text-muted-foreground text-lg font-normal">{message}</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-center pb-6">
      <Bell className="h-16 w-16 text-muted-foreground/30" />
    </CardContent>
  </Card>
);

export default Notifications;
