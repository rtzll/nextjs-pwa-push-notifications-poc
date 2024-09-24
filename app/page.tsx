import PushNotificationManager from "@/components/push-notification-manager";
import InstallPrompt from "@/components/install-prompt";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen mx-4">
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  );
}
