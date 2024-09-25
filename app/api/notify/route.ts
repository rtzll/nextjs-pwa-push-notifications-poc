import { sendNotification } from "@/app/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  if (!data.userId || !data.title || !data.message) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const result = await sendNotification(data.userId, data.title, data.message);
  return NextResponse.json(result);
}
