
import { NextResponse } from "next/server";
import PusherServer from "pusher";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // Parse form-encoded payload from Pusher
    const rawBody = await req.text();
    const params = new URLSearchParams(rawBody);
    const socketId = params.get("socket_id") || "";
    const channelName = params.get("channel_name") || "";
    const username = new URL(req.url).searchParams.get("username") || "guest";

    if (!socketId || !channelName) {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }

    const { PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER } =
      process.env;
    if (!PUSHER_APP_ID || !PUSHER_KEY || !PUSHER_SECRET || !PUSHER_CLUSTER) {
      console.error("Missing Pusher env vars");
      return NextResponse.json({ error: "server_misconfig" }, { status: 500 });
    }

    const pusher = new PusherServer({
      appId: PUSHER_APP_ID,
      key: PUSHER_KEY,
      secret: PUSHER_SECRET,
      cluster: PUSHER_CLUSTER,
      useTLS: true,
    });

    const auth = pusher.authorizeChannel(socketId, channelName, {
      user_id:
        username === "guest"
          ? `guest-${Math.random().toString(36).slice(2, 8)}`
          : username,
      user_info: { username },
    });

    return new NextResponse(JSON.stringify(auth), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (e) {
    console.error("pusher-auth error", e);
    return NextResponse.json({ error: "auth_failed" }, { status: 500 });
  }
}
