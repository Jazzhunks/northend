import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { Send } from "lucide-react";

export default function ScholarshipNotificationButton({ scholarshipId, scholarshipTitle }) {
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const handleBroadcast = async () => {
    // Fail-safe confirmation to prevent accidental mass-messaging
    const confirmed = window.confirm(
      `URGENT: Are you sure you want to broadcast WhatsApp notifications to ALL applicants of "${scholarshipTitle}"?`
    );
    if (!confirmed) return;

    setIsBroadcasting(true);
    const loadingToastId = toast.loading("Initiating WhatsApp broadcast sequence...");

    try {
      // Hits the secure admin endpoint we just built in the FastAPI backend
      const response = await api.post(`/admin/scholarships/${scholarshipId}/notify-applicants`);
      
      toast.success(response.data?.message || "Broadcast successfully queued.", {
        id: loadingToastId,
      });
    } catch (error) {
      toast.error(formatError(error.response?.data?.detail) || "Broadcast failed to initiate.", {
        id: loadingToastId,
      });
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleBroadcast}
      disabled={isBroadcasting}
      className="rounded-lg text-xs font-bold text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10 transition-colors"
      data-testid={`notify-btn-${scholarshipId}`}
    >
      <Send size={13} className={`mr-1 ${isBroadcasting ? "animate-pulse" : ""}`} />
      {isBroadcasting ? "Broadcasting..." : "Notify Applicants"}
    </Button>
  );
}