"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, ExternalLink, Loader2, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  _id: string;
  message: string;
  link: string;
  metaData: {
    userName: string;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationResponse {
  message: string;
  data: {
    count: number;
    data: Notification[];
  };
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  unreadCount: number;
  onUnreadCountChange: (count: number) => void;
}

export function NotificationModal({ 
  isOpen, 
  onClose, 
  unreadCount, 
  onUnreadCountChange 
}: NotificationModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch notifications when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await apiClient<NotificationResponse>("/notification", "GET");
      
      if (response.success && response.data?.data) {
        setNotifications(response.data.data.data);
        
        // Update unread count
        const unread = response.data.data.data.filter(n => !n.isRead).length;
        onUnreadCountChange(unread);
      } else {
        setError("Failed to load notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // const markAsRead = async (notificationId: string) => {
  //   try {
  //     // Optimistically update UI
  //     setNotifications(prev => 
  //       prev.map(n => 
  //         n._id === notificationId ? { ...n, isRead: true } : n
  //       )
  //     );
      
  //     // Update unread count
  //     const newUnreadCount = notifications.filter(n => 
  //       n._id !== notificationId && !n.isRead
  //     ).length;
  //     onUnreadCountChange(newUnreadCount);

  //     // Call API to mark as read (assuming endpoint exists)
  //     await apiClient(`/api/notification/${notificationId}/read`, "PUT");
  //   } catch (error) {
  //     console.error("Error marking notification as read:", error);
  //     // Revert optimistic update on error
  //     fetchNotifications();
  //   }
  // };

  const markAllAsRead = async () => {
    try {
      // Optimistically update UI
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      onUnreadCountChange(0);

      // Call API to mark all as read (assuming endpoint exists)
      await apiClient("/api/notification/mark-all-read", "PUT");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Revert optimistic update on error
      fetchNotifications();
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if not already read
    // if (!notification.isRead) {
    //   markAsRead(notification._id);
    // }

    // Navigate to link if provided
    if (notification.link) {
      if (notification.link.startsWith('http')) {
        window.open(notification.link, '_blank');
      } else {
        router.push(notification.link);
        onClose();
      }
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    // You can customize icons based on notification type/content
    return <Bell className="h-4 w-4 text-primary" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div 
        ref={modalRef}
        className="absolute top-16 right-4 w-96 max-w-[calc(100vw-2rem)] pointer-events-auto"
      >
        <Card className="shadow-2xl border-2 bg-background/95 backdrop-blur-md">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {unreadCount} unread
                    </p>
                  )}
                </div>
              </div>
              
              {notifications.length > 0 && unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-primary hover:text-primary/80"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>

            {/* Content */}
            <div className="max-h-96">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading notifications...</span>
                </div>
              ) : error ? (
                <div className="p-4 text-center">
                  <p className="text-destructive text-sm">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchNotifications}
                    className="mt-2"
                  >
                    Try again
                  </Button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="p-4 bg-muted/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">No notifications yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    We'll notify you when something happens
                  </p>
                </div>
              ) : (
                <ScrollArea className="max-h-96">
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-4 hover:bg-muted/30 transition-colors cursor-pointer group relative ${
                          !notification.isRead ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex gap-3">
                          {/* Icon */}
                          <div className={`p-2 rounded-full flex-shrink-0 ${
                            !notification.isRead ? 'bg-primary/10' : 'bg-muted/50'
                          }`}>
                            {getNotificationIcon(notification)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm leading-relaxed ${
                                !notification.isRead ? 'font-medium' : ''
                              }`}>
                                {notification.message}
                              </p>
                              
                              {/* Unread indicator */}
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                              )}
                            </div>

                            {/* Metadata */}
                            <div className="flex items-center gap-2 mt-2">
                              {notification.metaData?.userName && (
                                <Badge variant="secondary" className="text-xs">
                                  @{notification.metaData.userName}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(notification.createdAt), { 
                                  addSuffix: true 
                                })}
                              </span>
                              {notification.link && (
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* {!notification.isRead && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification._id);
                                  }}
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Mark as read
                                </DropdownMenuItem>
                              )} */}
                              {notification.link && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (notification.link.startsWith('http')) {
                                      window.open(notification.link, '_blank');
                                    } else {
                                      router.push(notification.link);
                                      onClose();
                                    }
                                  }}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Open link
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t bg-muted/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  Close
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}