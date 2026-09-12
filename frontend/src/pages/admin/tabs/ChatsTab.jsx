import React from "react";
import WhatsAppInbox from "@/pages/WhatsAppInbox";

export default function ChatsTab() {
  return (
    <div className="space-y-4 animate-fadeIn" data-testid="admin-chats-tab">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-display font-medium text-lg sm:text-xl text-foreground">WhatsApp Inbox</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Reply to incoming messages · linked to WATH applicants automatically</p>
        </div>
      </div>
      <WhatsAppInbox />
    </div>
  );
}
