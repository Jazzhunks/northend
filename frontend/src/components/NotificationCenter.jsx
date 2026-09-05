import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Info, CheckCircle2, AlertCircle, XCircle, MessageSquare, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { addNotification, getNotifications, markAsRead as storeMarkAsRead, markAllAsRead as storeMarkAllAsRead } from "@/lib/notificationStore";

const TYPE_ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
  message: MessageSquare,
  system: Trophy,
};

const TYPE_COLORS = {
  info: "bg-accent/10 text-accent",
  success: "bg-emerald-500/10 text-emerald-600",
  warning: "bg-amber-500/10 text-amber-600",
  error: "bg-rose-500/10 text-rose-600",
  message: "bg-sky-500/10 text-sky-600",
  system: "bg-violet-500/10 text-violet-600",
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const eventSourceRef = useRef(null);
  const audioRef = useRef(null);
  const initializedRef = useRef(false);

  const playNotificationSound = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/notification.mp3");
      audioRef.current.volume = 0.5;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // Silently fail if audio is blocked by browser policy
    });
  }, []);

  const handleMarkAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await api.post(`/admin/notifications/${id}/read`);
      await storeMarkAsRead(id);
    } catch (e) {
      // Silently fail
    }
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await api.post("/admin/notifications/read-all");
      await storeMarkAllAsRead();
    } catch (e) {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (initializedRef.current) return;
      initializedRef.current = true;

      try {
        const stored = await getNotifications();
        if (mounted) {
          setNotifications(stored);
          setUnreadCount(stored.filter((n) => !n.read).length);
        }
      } catch (e) {
        console.error("Failed to load stored notifications", e);
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("nw_token");
    if (!token) return;

    const url = `/api/admin/notifications/stream?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const type = data.type || "info";
        const payload = data.payload || {};

        const buildTitle = () => {
          if (payload.title) return payload.title;
          switch (type) {
            case "scholarship_application":
              return `New scholarship application from ${payload.name || "a student"}`;
            case "enrollment":
              return `New enrollment from ${payload.name || "a student"}`;
            case "job_application":
              return `New job application from ${payload.name || "an applicant"}`;
            case "whatsapp_message_received":
              return "New WhatsApp message received";
            case "result_published":
              return `Result published for ${payload.name || "a student"}`;
            case "broadcast_complete":
              return "Broadcast completed";
            default:
              return "New Notification";
          }
        };

        const buildMessage = () => {
          if (payload.message) return payload.message;
          switch (type) {
            case "scholarship_application":
              return `Application #${payload.application_no || "—"} · ${payload.scholarship_title || payload.campaign_kind || "Scholarship"} · ${payload.venue || ""}`;
            case "enrollment":
              return `Enrollment #${payload.application_no || payload.enrollment_no || "—"} · ${payload.course || payload.program || ""}`;
            case "job_application":
              return `Application #${payload.application_no || "—"} · ${payload.department || payload.job_title || ""}`;
            case "whatsapp_message_received":
              return payload.body || payload.message || "You received a new WhatsApp message.";
            case "result_published":
              return `${payload.name || "Student"} · ${payload.exam || ""} · Marks: ${payload.marks_obtained ?? ""}`;
            case "broadcast_complete":
              return payload.summary || "Your broadcast campaign has finished sending.";
            default:
              return "";
          }
        };

        const notification = {
          id: data.id || crypto.randomUUID(),
          type: type,
          title: buildTitle(),
          message: buildMessage(),
          timestamp: data.timestamp || new Date().toISOString(),
          read: false,
        };

        setNotifications((prev) => [notification, ...prev].slice(0, 100));
        setUnreadCount((prev) => prev + 1);

        playNotificationSound();
        toast(notification.title, {
          description: notification.message,
          duration: 4000,
        });

        addNotification(notification).catch(() => {
          // ignore storage errors
        });
      } catch (e) {
        console.error("Failed to parse SSE event", e);
      }
    };

    es.onerror = () => {
      es.close();
      eventSourceRef.current = null;
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [playNotificationSound]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-xl border border-border hover:bg-muted/50 transition-colors cursor-pointer"
        data-testid="notification-bell"
        aria-label="Open notifications"
      >
        <Bell size={18} className="text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="p-4 border-b border-border shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <SheetTitle className="text-base font-bold">Notifications</SheetTitle>
                <SheetDescription>
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                </SheetDescription>
              </div>
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMarkAllAsRead}
                  className="text-xs rounded-lg border-border cursor-pointer shrink-0"
                >
                  Mark all read
                </Button>
              )}
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = TYPE_ICONS[notification.type] || Info;
                const time = new Date(notification.timestamp).toLocaleString();
                return (
                  <div
                    key={notification.id}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      notification.read
                        ? "bg-background/30 border-border opacity-70"
                        : "bg-accent/5 border-accent/20 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${TYPE_COLORS[notification.type] || TYPE_COLORS.info}`}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-sm font-medium truncate ${
                            notification.read ? "text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {notification.title}
                        </div>
                        {notification.message && (
                          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.message}
                          </div>
                        )}
                        <div className="text-[10px] text-muted-foreground/60 mt-1 font-mono">
                          {time}
                        </div>
                      </div>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
