"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import Pusher from "pusher-js";

const NICK_KEY = "jpm:nick";

type Msg = { username: string; message: string; ts: number };

export default function Chat() {
  const [nick, setNick] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const paneRef = useRef<HTMLDivElement>(null);
  const [online, setOnline] = useState(0);

  // generate or load nickname once
  useEffect(() => {
    let saved = localStorage.getItem(NICK_KEY);
    if (!saved) {
      const random = Math.floor(100 + Math.random() * 900); // 100-999
      saved = `User${random}`;
      localStorage.setItem(NICK_KEY, saved);
    }
    setNick(saved);
  }, []);

  // pusher subscribe
  useEffect(() => {
    if (!nick) return;
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY as string;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string;
    if (!key || !cluster) return;

    const pusher = new Pusher(key, {
      cluster,
      authEndpoint: "/api/pusher-auth",
      auth: { params: { username: nick } },
    });

    const channel = pusher.subscribe("presence-chat");
    channel.bind("pusher:subscription_succeeded", (members: unknown) => {
      const count = (members as { count: number }).count || 0;
      setOnline(count);
    });
    channel.bind("pusher:member_added", () => setOnline((c) => c + 1));
    channel.bind("pusher:member_removed", () => setOnline((c) => Math.max(0, c - 1)));
    channel.bind("chat:new-message", (data: unknown) => {
      const msg = data as Msg;
      setMessages((m) => [...m, msg]);
    });

    return () => {
      pusher.unsubscribe("presence-chat");
      pusher.disconnect();
    };
  }, [nick]);

  // auto-scroll
  useEffect(() => {
    const pane = paneRef.current;
    if (pane) pane.scrollTop = pane.scrollHeight;
  }, [messages]);

  const send = async () => {
    if (!nick) return;
    if (!input.trim()) return;
    const msg = input.slice(0, 500);
    setInput("");
    await fetch("/api/send-message", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: nick, message: msg }),
    });
  };

  // no manual nickname editing

  return (
    <Card className="h-[400px] flex flex-col border-neutral-200 bg-white">
      <CardHeader className="flex items-center justify-between py-2 px-4">
        <CardTitle className="text-neutral-700 text-base">Live Chat</CardTitle>
        <span className="text-xs text-neutral-500">{online} online</span>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-2" ref={paneRef}>
        {messages.map((m) => (
          <div key={m.ts} className="text-sm">
            <span className="font-medium text-neutral-800 mr-1 font-amplitude-light">{m.username}:</span>
            <span className="text-neutral-700 font-amplitude">{m.message}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message…"
          className="flex-1 border rounded px-2 py-1 text-sm"
        />
        <button onClick={send} className="px-3 py-1 rounded bg-emerald-600 text-white text-sm">
          Send
        </button>
      </CardFooter>
    </Card>
  );
}
