// /pages/api/auth/login.ts (Assuming TypeScript and API route)
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { validateAuthInput } from "@/lib/validations/auth";
import { SignJWT } from 'jose';
import { serialize } from "cookie";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    const validationErrors = validateAuthInput(username, password);
    if (validationErrors.length > 0) {
      console.log('Validation Errors:', validationErrors);
      return NextResponse.json(
        { message: validationErrors[0] },
        { status: 400 }
      );
    }

    // Fetch user from the database
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      console.log('User not found:', username);
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare password hashes
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Invalid password for user:', username);
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token using 'jose'
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }

    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(jwtSecret));

    console.log('Generated JWT Token:', token);

    // Remove sensitive information from user object
    const { password: _, ...userWithoutPassword } = user;

    // Serialize the cookie
    const serializedCookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    console.log('Serialized Cookie:', serializedCookie);

    // Create response
    const response = NextResponse.json({ user: userWithoutPassword });

    // Set the cookie in the response headers
    response.headers.set('Set-Cookie', serializedCookie);

    console.log('Response Headers after setting cookie:', response.headers);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
