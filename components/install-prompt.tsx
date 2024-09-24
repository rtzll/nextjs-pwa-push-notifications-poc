"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadIcon } from "lucide-react";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    setIsIOS(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
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
