import { useEffect, useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
};

const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const NotificationBell = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    let active = true;
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (active && data) setItems(data as Notification[]);
      });

    const channel = supabase
      .channel(`notifications:${user.id}:${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setItems((prev) => {
            if (payload.eventType === "INSERT") {
              return [payload.new as Notification, ...prev].slice(0, 20);
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((n) =>
                n.id === (payload.new as Notification).id
                  ? (payload.new as Notification)
                  : n,
              );
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((n) => n.id !== (payload.old as Notification).id);
            }
            return prev;
          });
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!user) return null;

  const unread = items.filter((n) => !n.read).length;

  const markAllRead = async () => {
    if (unread === 0) return;
    const ids = items.filter((n) => !n.read).map((n) => n.id);
    await supabase.from("notifications").update({ read: true }).in("id", ids);
  };

  const remove = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
  };

  const markOneRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted transition-colors"
        >
          <Bell className="h-5 w-5 text-foreground" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <p className="font-heading font-bold text-sm">Notifications</p>
          <button
            onClick={markAllRead}
            disabled={unread === 0}
            className="text-xs font-semibold text-primary hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1"
          >
            <Check className="h-3 w-3" /> Mark all read
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              You're all caught up.
            </div>
          ) : (
            items.map((n) => {
              const Content = (
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm leading-snug",
                        n.read ? "text-muted-foreground" : "font-semibold text-foreground",
                      )}
                    >
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  {n.body && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {n.body}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {timeAgo(n.created_at)}
                  </p>
                </div>
              );
              return (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-start gap-2 p-3 border-b border-border last:border-0 hover:bg-muted/40",
                    !n.read && "bg-primary/5",
                  )}
                >
                  {n.link ? (
                    <Link
                      to={n.link}
                      className="flex-1"
                      onClick={() => {
                        markOneRead(n.id);
                        setOpen(false);
                      }}
                    >
                      {Content}
                    </Link>
                  ) : (
                    <button
                      onClick={() => markOneRead(n.id)}
                      className="flex-1 text-left"
                    >
                      {Content}
                    </button>
                  )}
                  <button
                    aria-label="Delete notification"
                    onClick={() => remove(n.id)}
                    className="text-muted-foreground hover:text-destructive shrink-0 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
