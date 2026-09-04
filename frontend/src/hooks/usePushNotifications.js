import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function usePushNotifications() {
  var requestPermission = useCallback(async function () {
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notification");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      var permission = await Notification.requestPermission();
      if (permission === "granted") {
        return true;
      }
    }
    return false;
  }, []);

  var registerDevice = useCallback(async function () {
    try {
      var deviceId = localStorage.getItem("nw_device_id") || crypto.randomUUID();
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

  var subscribe = useCallback(async function () {
    var granted = await requestPermission();
    if (!granted) {
      toast.error("Notification permission denied");
      return false;
    }

    var deviceId = await registerDevice();
    if (!deviceId) {
      toast.error("Failed to register device for push notifications");
      return false;
    }

    toast.success("Push notifications enabled");
    return true;
  }, [requestPermission, registerDevice]);

  return { requestPermission: requestPermission, registerDevice: registerDevice, subscribe: subscribe };
}
