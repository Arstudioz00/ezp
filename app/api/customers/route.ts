import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";

// Helper function for JWT verification
async function verifyToken(token: string | null, secret: string) {
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (!payload || !payload.userId) {
      throw new Error("Invalid token");
    }
    return payload.userId;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Unauthorized");
  }
}

// GET: Fetch all customers or a single customer
export async function GET(request: Request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = await verifyToken(token, process.env.JWT_SECRET!);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch a single customer by ID
      const customer = await prisma.customer.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!customer || customer.userId !== userId) {
        return NextResponse.json({ message: "Customer not found or unauthorized" }, { status: 404 });
      }

      return NextResponse.json(customer);
    }

    // Fetch all customers
    const customers = await prisma.customer.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        currency: true,
        website: true,
        tags: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(customers);
  } catch (error) {
    const statusCode = error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { message: error.message || "Failed to fetch customers" },
      { status: statusCode }
    );
  }
}

// POST: Add a new customer
export async function POST(request: Request) {
  try {
    const token = request.cookies.get("token")?.value;
    const userId = await verifyToken(token, process.env.JWT_SECRET!);

    const body = await request.json();
    const { title, name, email, phone, address, currency, website, tags } = body;

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    const newCustomer = await prisma.customer.create({
      data: {
        userId,
        title,
        name,
        email,
        phone,
        address,
        currency,
        website,
        tags,
      },
    });

    return NextResponse.json(
      { message: "Customer added successfully", customer: newCustomer },
      { status: 201 }
    );
  } catch (error) {
    const statusCode = error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { message: error.message || "Failed to add customers" },
      { status: statusCode }
    );
  }
}

// PUT: Update customer by ID
export async function PUT(request: Request) {
  try {
    const token = request.cookies.get("token")?.value;
    const userId = await verifyToken(token, process.env.JWT_SECRET!);

    const body = await request.json();
    const { id, title, name, email, phone, address, currency, website, tags } = body;

    if (!id) {
      return NextResponse.json({ message: "Customer ID is required" }, { status: 400 });
    }

    const existingCustomer = await prisma.customer.findUnique({
      where: { id: Number(id) },
    });

    if (!existingCustomer || existingCustomer.userId !== userId) {
      return NextResponse.json({ message: "Customer not found or unauthorized" }, { status: 404 });
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: Number(id) },
      data: {
        title,
        name,
        email,
        phone,
        address,
        currency,
        website,
        tags,
      },
    });

    return NextResponse.json(
      { message: "Customer updated successfully", customer: updatedCustomer },
      { status: 200 }
    );
  } catch (error) {
    const statusCode = error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { message: error.message || "Failed to edit customers" },
      { status: statusCode }
    );
  }
}

// DELETE: Delete customer by ID
export async function DELETE(request: Request) {
  try {
    const token = request.cookies.get("token")?.value;
    const userId = await verifyToken(token, process.env.JWT_SECRET!);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Customer ID is required" }, { status: 400 });
    }

    const existingCustomer = await prisma.customer.findUnique({
      where: { id: Number(id) },
    });

    if (!existingCustomer || existingCustomer.userId !== userId) {
      return NextResponse.json({ message: "Customer not found or unauthorized" }, { status: 404 });
    }

    await prisma.customer.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "Customer deleted successfully" }, { status: 200 });
  } catch (error) {
    const statusCode = error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { message: error.message || "Failed to delete customers" },
      { status: statusCode }
    );
  }
}
