export async function signSession(
  payload: Record<string, unknown>,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, data);

  const payloadB64 = btoa(String.fromCharCode(...new Uint8Array(data)));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return `${payloadB64}.${sigB64}`;
}

export async function verifySession(
  token: string,
  secret: string
): Promise<Record<string, unknown> | null> {
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return null;

  try {
    const payload = JSON.parse(
      atob(payloadB64)
    ) as Record<string, unknown>;

    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(payload));

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signature = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));

    const valid = await crypto.subtle.verify("HMAC", key, signature, data);
    if (!valid) return null;

    // 检查过期时间
    const exp = payload.exp as number | undefined;
    if (exp && Math.floor(Date.now() / 1000) > exp) return null;

    return payload;
  } catch {
    return null;
  }
}
