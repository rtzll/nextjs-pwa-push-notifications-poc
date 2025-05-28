import { sendNotification } from "@/app/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
    }
    
    if (!data.userId || typeof data.userId !== 'string') {
      return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
    }
    
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      return NextResponse.json({ error: "Invalid or missing title" }, { status: 400 });
    }
    
    if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
      return NextResponse.json({ error: "Invalid or missing message" }, { status: 400 });
    }
    
    // Sanitize inputs
    const sanitizedData = {
      userId: data.userId.trim(),
      title: data.title.trim().substring(0, 100), // Limit title length
      message: data.message.trim().substring(0, 500), // Limit message length
    };
    
    const result = await sendNotification(sanitizedData.userId, sanitizedData.title, sanitizedData.message);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing notification request:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
