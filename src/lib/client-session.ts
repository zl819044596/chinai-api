// 客户端 session 管理
const SESSION_KEY = "tokenapi_session";

export function getClientSession(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setClientSession(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, token);
}

export function clearClientSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
