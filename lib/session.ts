import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionCooke {
  id?: number;
}

export function getSession() {
  return getIronSession<SessionCooke>(cookies(), {
    cookieName: "intermarket",
    password: process.env.COOKIE_PASSWORD!,
  });
}

export async function saveSession(userId: number) {
  const session = await getSession();
  session.id = userId;
  await session.save();
}
