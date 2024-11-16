import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Count users as a test query
    const userCount = await prisma.user.count();
    
    return NextResponse.json({ 
      status: 'Connected', 
      userCount,
      message: 'Database connection successful' 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      status: 'Error', 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 