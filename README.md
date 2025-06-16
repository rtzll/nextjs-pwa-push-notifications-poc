# Next.js PWA Push Notifications POC

> [!IMPORTANT]
> This project is a **proof of concept** showing how to send web push notifications from a Next.js application using the Web Push API and Upstash Redis.

## Live Preview

You can view a live UI preview [here](https://nextjs-pwa-with-push-notification.vercel.app/).

However, the push notifications functionality is not available in this preview as it is not connected to Upstash Redis. To test the full functionality including push notifications, clone the repository and follow the setup instructions below.

## Setup

1. Install dependencies and generate VAPID keys:

```bash
npm install
node generate-vapid-keys.js
```

> **What is VAPID?** VAPID (Voluntary Application Server Identification) is a security standard used in web push notifications. It allows push services to identify the server that sends push notifications and ensures that the same entity that subscribed a user is the one sending them notifications.

2. Copy `.env.example` to `.env` and fill in the values printed from the script as well as your Upstash Redis credentials.

```
cp .env.example .env
```

The required environment variables are:

- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_NOTIFICATION_URL` – the URL that should open when a notification is clicked.
- `VAPID_CONTACT_URL` – the public origin (used for VAPID contact header).

## Development

Start the development server with:

```bash
npm run dev
```

Open <http://localhost:3000> in your browser to test notifications.

## Sending Notifications

Subscriptions are stored in Upstash Redis. Use the "Send Push" button in the UI to trigger a manual notification. When the notification is clicked, the browser will open `NEXT_PUBLIC_NOTIFICATION_URL`.

Note: The notification will only be shown if the user has granted permission to receive notifications.
