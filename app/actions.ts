"use server";

import webpush from "web-push";
import { Subscription } from "./types";

webpush.setVapidDetails(
  "https://nextjs-pwa-with-push-notification.vercel.app/",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function subscribeUser(subscription: Subscription) {
  console.log(`Received subscription: ${JSON.stringify(subscription)}`);
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  return { success: true };
}

export async function unsubscribeUser() {
  console.log("Unsubscribed from push notifications");
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true };
}

export async function sendNotification(
  subscription: Subscription,
  message: string,
) {
  if (!subscription) {
    throw new Error("No subscription available");
  }

  console.log(`Sending notification to ${JSON.stringify(subscription)}`);
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Test Notification",
        body: message,
        icon: "/apple-touch-icon.png",
      }),
    );
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
