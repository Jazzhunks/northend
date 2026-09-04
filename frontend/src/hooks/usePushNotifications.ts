import { useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function usePushNotifications() {
  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notification");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        return true;
      }
    }
    return false;
  }, []);

  const registerDevice = useCallback(async () => {
    try {
      const deviceId =
        localStorage.getItem("nw_device_id") || crypto.randomUUID();
      localStorage.setItem("nw_device_id", deviceId);

      await api.post("/api/admin/devices", {
        device_id: deviceId,
        platform: "web",
        user_agent: navigator.userAgent,
        notification_enabled: Notification.permission === "granted",
      });

      return deviceId;
    } catch (e) {
      console.error("Failed to register device", e);
      return null;
    }
  }, []);

  const subscribe = useCallback(async () => {
    const granted = await requestPermission();
    if (!granted) {
      toast.error("Notification permission denied");
      return false;
    }

    const deviceId = await registerDevice();
    if (!deviceId) {
      toast.error("Failed to register device for push notifications");
      return false;
    }

    toast.success("Push notifications enabled");
    return true;
  }, [requestPermission, registerDevice]);

  return { requestPermission, registerDevice, subscribe };
}
