import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const ONESIGNAL_APP_ID = "41952295-559a-4ac1-9431-36443a3195ee";

function initOneSignal() {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.OneSignalDeferred) {
      resolve(null);
      return;
    }

    window.OneSignalDeferred.push(async function (OneSignal) {
      try {
        const instance = await OneSignal.init({
          appId: ONESIGNAL_APP_ID,
          serviceWorkerPath: "/push/onesignal/OneSignalSDKWorker.js",
          serviceWorkerParam: {
            scope: "/push/onesignal/",
          },
        });
        resolve(instance);
      } catch (err) {
        if (err && /already initialized/i.test(err.message || "")) {
          resolve(window.OneSignal || null);
          return;
        }
        console.error("OneSignal init failed:", err);
        resolve(null);
      }
    });
  });
}

export function useOneSignal() {
  const { user } = useAuth();

  useEffect(() => {
    let onesignal = null;

    initOneSignal().then((os) => {
      onesignal = os;
      if (!os || !user) return;

      if (typeof os.User !== "undefined" && typeof os.User.addTags === "function") {
        os.User.addTags({
          role: user.role || "user",
          user_id: String(user.id || ""),
          name: String(user.name || ""),
          email: String(user.email || ""),
        }).catch((err) => {
          console.error("OneSignal addTags failed:", err);
        });
      }

      if (user.id && typeof os.login === "function") {
        os.login(String(user.id)).catch((err) => {
          console.error("OneSignal login failed:", err);
        });
      }
    }).catch((err) => {
      if (err && /Can only be used on/i.test(err.message || "")) {
        console.warn("OneSignal skipped: domain not authorized in OneSignal dashboard.");
      } else {
        console.error("OneSignal initialization error:", err);
      }
    });

    return () => {
      if (onesignal && user?.id && typeof onesignal.logout === "function") {
        onesignal.logout().catch(() => {});
      }
    };
  }, [user]);
}

export function useOneSignalPermission() {
  useEffect(() => {
    if (typeof window === "undefined" || !window.OneSignalDeferred) return;

    window.OneSignalDeferred.push(async function (OneSignal) {
      try {
        await OneSignal.init({
          appId: ONESIGNAL_APP_ID,
          serviceWorkerPath: "/push/onesignal/OneSignalSDKWorker.js",
          serviceWorkerParam: {
            scope: "/push/onesignal/",
          },
        });
        await OneSignal.showNativePrompt();
      } catch (err) {
        if (err && /already initialized/i.test(err.message || "")) {
          return;
        }
        console.error("OneSignal permission prompt failed:", err);
      }
    });
  }, []);
}
