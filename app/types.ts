export interface Subscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
