# Next.js PWA Push Notifications POC

> [!IMPORTANT]
> This project is a **proof of concept** showing how to send web push notifications from a Next.js application using the Web Push API and Upstash Redis.

## Setup

1. Install dependencies and generate VAPID keys:

```bash
npm install
node generate-vapid-keys.js
```

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

Note: The notification will only be sent if the user has granted permission to receive notifications.