import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { validateAuthInput } from "@/lib/validations/auth";

export async function POST(request: Request) {
  // Immediate logging at route entry
  console.log('\n🚀 Register API route hit - START');

  try {
    // Log the raw request
    console.log('📨 Incoming request headers:', Object.fromEntries(request.headers));
    
    const body = await request.json();
    console.log('📦 Parsed request body:', body);

    const { username, password, email } = body;

    // Test database connection
    console.log('🔌 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    console.log('🔍 Validating input for:', username);
    const validationErrors = validateAuthInput(username, password);
    if (validationErrors.length > 0) {
      console.log('❌ Validation failed:', validationErrors);
      return NextResponse.json(
        { message: validationErrors[0] },
        { status: 400 }
      );
    }

    console.log('🔍 Checking for existing user');
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      console.log('❌ Username already exists');
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 400 }
      );
    }

    console.log('🔒 Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('👤 Attempting to create user in database');
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email
      },
      select: {
        id: true,
        username: true,
        email: true
      }
    });

    console.log('✅ User created successfully:', user);

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    console.log('🎟️ JWT token generated');
    console.log('🏁 Register API route completed successfully\n');

    return NextResponse.json({ user, token }, { status: 201 });
  } catch (error) {
    console.error('\n💥 Registration error:', error);
    // Detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Try to get more database-specific error information
    if (error instanceof Error && 'code' in error) {
      console.error('Database error code:', (error as any).code);
    }

    console.error('🏁 Register API route failed\n');

    return NextResponse.json(
      { 
        message: 'Internal server error', 
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.name : 'Unknown type'
      },
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
      console.log('📡 Database disconnected');
    } catch (e) {
      console.error('Error disconnecting from database:', e);
    }
  }
}