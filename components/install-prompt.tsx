"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadIcon } from "lucide-react";

const subscribeToBrowserSnapshot = () => () => {};
const getServerSnapshot = () => false;

function getIsIOSSnapshot() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !(window as any).MSStream
  );
}

function getIsStandaloneSnapshot() {
  return window.matchMedia("(display-mode: standalone)").matches;
}

export default function InstallPrompt() {
  const isIOS = useSyncExternalStore(
    subscribeToBrowserSnapshot,
    getIsIOSSnapshot,
    getServerSnapshot,
  );
  const isStandalone = useSyncExternalStore(
    subscribeToBrowserSnapshot,
    getIsStandaloneSnapshot,
    getServerSnapshot,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  if (isStandalone) {
    return null;
  }

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User ${outcome === "accepted" ? "accepted" : "declined"} the install prompt`);
    setDeferredPrompt(null);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Install App</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {deferredPrompt && (
          <Button onClick={installApp} variant="outline">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Add to Home Screen
          </Button>
        )}
        {isIOS && (
          <p>
            To install this app on your iOS device, tap the share button and then &quot;Add to Home Screen&quot;.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
