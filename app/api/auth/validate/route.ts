// app/api/auth/validate/route.ts

import { NextResponse } from "next/server";
import { jwtVerify } from 'jose';
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');

    if (!cookieHeader) {
      return NextResponse.json(
        { message: 'No cookies found' },
        { status: 401 }
      );
    }

    const token = parseCookies(cookieHeader).token;

    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

    const { payload } = await jwtVerify(token, jwtSecret);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        email: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
  }
}

function parseCookies(cookieHeader: string) {
  const cookies: Record<string, string> = {};
  const cookiePairs = cookieHeader.split(';');
  for (const pair of cookiePairs) {
    const [key, value] = pair.trim().split('=');
    cookies[key] = decodeURIComponent(value);
  }
  return cookies;
}
