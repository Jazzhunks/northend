import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const ONESIGNAL_APP_ID = "41952295-559a-4ac1-9431-36443a3195ee";

let onesignalInitPromise = null;

function initOneSignal() {
  if (typeof window === "undefined" || !window.OneSignalDeferred) {
    return Promise.resolve(null);
  }

  if (!onesignalInitPromise) {
    onesignalInitPromise = new Promise((resolve) => {
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
          console.error("OneSignal init failed:", err);
          resolve(null);
        }
      });
    });
  }

  return onesignalInitPromise;
}

export function useOneSignal() {
  const { user } = useAuth();

  useEffect(() => {
    let onesignal = null;

    initOneSignal().then((os) => {
      onesignal = os;
      if (!os || !user) return;

      const tags = {
        role: user.role || "user",
        user_id: String(user.id || ""),
        name: String(user.name || ""),
        email: String(user.email || ""),
      };

      os.sendTags(tags).catch((err) => {
        console.error("OneSignal sendTags failed:", err);
      });

      if (user.id) {
        os.login(String(user.id)).catch((err) => {
          console.error("OneSignal login failed:", err);
        });
      }
    });

    return () => {
      if (onesignal && user?.id) {
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
        console.error("OneSignal permission prompt failed:", err);
      }
    });
  }, []);
}
