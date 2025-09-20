export class HttpError extends Error {
  status: number;
  body?: string;
  constructor(msg: string, status: number, body?: string) {
    super(msg);
    this.status = status;
    this.body = body;
  }
}

export async function fetchJSON<T>(
  url: string,
  opts: RequestInit = {},
  timeoutMs = 10_000
): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...opts,
      signal: ctrl.signal,
      headers: {
        "user-agent": "jpmoregain/1.0",
        ...(opts.headers || {}),
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new HttpError(`HTTP ${res.status} for ${url}`, res.status, body.slice(0, 500));
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}
