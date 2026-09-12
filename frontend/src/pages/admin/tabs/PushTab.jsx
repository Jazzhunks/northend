import React from "react";
import { toast } from "sonner";
import { formatError, adminAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Send, Image, Users } from "lucide-react";

export default function PushTab() {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center gap-2">
        <h3 className="font-display font-medium text-lg sm:text-xl text-foreground truncate">Push Notifications</h3>
      </div>
      <div className="glass border border-border rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</label>
            <input
              id="push-title"
              className="w-full border border-border rounded-xl bg-background/50 px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
              placeholder="Notification title"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target</label>
            <select
              id="push-target"
              className="w-full border border-border rounded-xl bg-background/50 px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
            >
              <option value="all">All Users</option>
              <option value="admin">Admins</option>
              <option value="student">Students</option>
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Message</label>
          <textarea
            id="push-message"
            rows={4}
            className="w-full border border-border rounded-xl bg-background/50 px-3 py-2 text-sm focus:outline-none focus:border-accent/40 resize-y"
            placeholder="Notification message"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Redirect URL (optional)</label>
            <input
              id="push-url"
              className="w-full border border-border rounded-xl bg-background/50 px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
              placeholder="/admin or /notices"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Image URL (optional)</label>
            <input
              id="push-image"
              className="w-full border border-border rounded-xl bg-background/50 px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
              placeholder="https://example.com/image.png"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            id="push-send-btn"
            onClick={async () => {
              const title = document.getElementById("push-title").value.trim();
              const message = document.getElementById("push-message").value.trim();
              const target = document.getElementById("push-target").value;
              const url = document.getElementById("push-url").value.trim() || undefined;
              const image = document.getElementById("push-image").value.trim() || undefined;
              if (!title || !message) {
                toast.error("Title and message are required");
                return;
              }
              try {
                await adminAPI.sendPushNotification({ title, message, target, url, image });
                toast.success("Push notification sent");
                document.getElementById("push-title").value = "";
                document.getElementById("push-message").value = "";
                document.getElementById("push-url").value = "";
                document.getElementById("push-image").value = "";
              } catch (e) {
                toast.error(formatError(e));
              }
            }}
            className="rounded-xl cursor-pointer"
          >
            <Send size={16} className="mr-2" /> Send Push
          </Button>
        </div>
      </div>
    </div>
  );
}
