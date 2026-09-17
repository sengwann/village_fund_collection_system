import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { UserRole, VillageStatus } from "@prisma/client";

import { prisma } from "../prisma";
import {
  AUTH_COOKIE_NAME,
  AUTH_SESSION_MAX_AGE_SECONDS,
} from "./auth.constants";
import type { SessionUser } from "./auth.types";

function getSessionSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is required.");
  }

  if (secret.length < 32) {
    throw new Error("AUTH_SECRET must be at least 32 characters.");
  }

  return new TextEncoder().encode(secret);
}

export async function createSession(userId: string): Promise<void> {
  const token = await new SignJWT({})
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(
      Math.floor(Date.now() / 1000) + AUTH_SESSION_MAX_AGE_SECONDS,
    )
    .sign(getSessionSecretKey());

  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSessionSecretKey());

    if (!payload.sub) {
      return null;
    }

    return payload.sub;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const userId = await getSessionUserId();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      role: true,
      villageId: true,
      houseId: true,
      membershipStatus: true,
      dateOfBirth: true,
      email: true,
      phone: true,
      village: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  if (user.role !== UserRole.SYSTEM_ADMIN) {
    if (!user.villageId || !user.village) {
      return null;
    }

    if (user.village.status !== VillageStatus.ACTIVE) {
      return null;
    }
  }

  return {
    id: user.id,
    name: user.name,
    role: user.role,
    villageId: user.villageId,
    houseId: user.houseId,
    membershipStatus: user.membershipStatus,
    email: user.email,
    phone: user.phone,
  };
}
