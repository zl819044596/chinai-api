// 使用内存存储 session（生产环境用 KV）
const sessions = new Map<string, any>();

export async function storeSession(token: string, data: any) {
  sessions.set(token, data);
  return true;
}

export async function getSession(token: string) {
  return sessions.get(token) || null;
}

export async function deleteSession(token: string) {
  sessions.delete(token);
  return true;
}
