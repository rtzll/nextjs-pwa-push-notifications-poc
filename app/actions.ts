"use server";

import webpush from "web-push";
import { Subscription } from "./types";
import { Redis } from "@upstash/redis";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const vapidContactUrl = process.env.VAPID_CONTACT_URL;
if (!vapidContactUrl) {
  throw new Error("Missing VAPID_CONTACT_URL environment variable");
}
webpush.setVapidDetails(
  vapidContactUrl,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function getUserId() {
  const cookieStore = await cookies();
  let userId = cookieStore.get("anonymousUserId")?.value;

  if (!userId) {
    userId = uuidv4();
    // Set the cookie to expire in 1 year
    cookieStore.set("anonymousUserId", userId, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  return userId;
}

export async function subscribeUser(
  subscription: Subscription,
) {
  const userId = await getUserId();
  console.log(
    `Received subscription for user ${userId} : ${
      JSON.stringify(subscription)
    }`,
  );
  await redis.hset(`subscription:${userId}`, { ...subscription });
  await redis.sadd("subscribers", userId);
  return { success: true };
}

export async function unsubscribeUser() {
  const userId = await getUserId();
  console.log(`Unsubscribed user ${userId}from push notifications`);
  await redis.del(`subscription:${userId}`);
  await redis.srem("subscribers", userId);
  return { success: true };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPushSubscription(sub: any): sub is Subscription {
  return sub && typeof sub.endpoint === "string" && sub.keys &&
    typeof sub.keys.p256dh === "string" && typeof sub.keys.auth === "string";
}

export async function sendManualNotification(message: string) {
  const userId = await getUserId();
  return await sendNotification(userId, "Manual Notification", message);
}

export async function sendNotification(
  userId: string,
  title: string,
  message: string,
) {
  const subscription = await redis.hgetall(`subscription:${userId}`);
  if (!subscription) {
    throw new Error("No subscription available");
  }
  if (!isPushSubscription(subscription)) {
    console.log(`Invalid subscription data for user ${userId}`);
    await redis.del(`subscription:${userId}`);
    await redis.srem("subscribers", userId);
    throw new Error("Invalid subscription data");
  }

  console.log(`Sending ${message} to ${userId}`);
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title,
        body: message,
        icon: "/apple-touch-icon.png",
        url: process.env.NEXT_PUBLIC_NOTIFICATION_URL || "https://example.com",
      }),
    );
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
