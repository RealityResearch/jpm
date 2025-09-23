import { NextResponse } from "next/server";
import { pusher } from "@/lib/pusher";

export const runtime = "nodejs";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { username, message } = await req.json();
    if (
      !username ||
      !message ||
      typeof username !== "string" ||
      typeof message !== "string" ||
      username.length > 24 ||
      message.length > 500
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    await pusher.trigger("presence-chat", "chat:new-message", {
      username,
      message,
      ts: Date.now(),
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
