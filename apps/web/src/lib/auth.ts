import { cookies } from "next/headers";
import { db } from "./db";
import { generateToken } from "./crypto";
import { Role } from "@prisma/client";

const SESSION_COOKIE = "cp_session";
const SESSION_DURATION_DAYS = 7;

/**
 * Create a new user session and store it in the database and HTTP-only cookie.
 */
export async function createSession(userId: string) {
  const token = generateToken(48);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

  await db.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

/**
 * Invalidate current session and clear cookie.
 */
export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    try {
      await db.session.delete({ where: { token } });
    } catch {
      // Ignored if session already deleted
    }
  }

  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Retrieve the current authenticated user and profile from active session cookie.
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const session = await db.session.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            profile: {
              include: {
                identityKeys: {
                  where: { revokedAt: null },
                  orderBy: { createdAt: "desc" },
                  take: 1,
                },
              },
            },
            memberships: {
              include: { org: true },
            },
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return session.user;
  } catch (err) {
    return null;
  }
}

/**
 * Protect route: requires authenticated user.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
  return user;
}

/**
 * Protect route: requires OFFICER or ADMIN role.
 */
export async function requireOfficer() {
  const user = await requireUser();
  if (user.role !== Role.OFFICER && user.role !== Role.ADMIN) {
    throw new Error("Forbidden: Officer credentials required");
  }
  return user;
}

/**
 * Protect route: requires ADMIN role.
 */
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== Role.ADMIN) {
    throw new Error("Forbidden: Administrator credentials required");
  }
  return user;
}

