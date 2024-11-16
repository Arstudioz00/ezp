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

// GET: Fetch all projects or a single project
export async function GET(request: Request) {
  try {
    const token = request.cookies.get("token")?.value;
    const userId = await verifyToken(token, process.env.JWT_SECRET!);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch a single project by ID
      const project = await prisma.project.findUnique({
        where: { id: parseInt(id, 10) },
        include: { customer: true }, // Include customer details if needed
      });

      if (!project || project.userId !== userId) {
        return NextResponse.json({ message: "Project not found or unauthorized" }, { status: 404 });
      }

      return NextResponse.json(project);
    }

    // Fetch all projects for the user
    const projects = await prisma.project.findMany({
      where: { userId },
      include: { customer: true }, // Include customer details if needed
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    const statusCode = error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { message: error.message || "Failed to fetch projects" },
      { status: statusCode }
    );
  }
}

// POST: Add a new project
export async function POST(request: Request) {
  try {
    const token = request.cookies.get("token")?.value;
    const userId = await verifyToken(token, process.env.JWT_SECRET!);

    const body = await request.json();
    const { customerId, projectName, projectCode, description, startDate, endDate } = body;

    if (!projectName || !customerId) {
      return NextResponse.json({ message: "Project name and customer ID are required" }, { status: 400 });
    }

    const newProject = await prisma.project.create({
      data: {
        userId,
        customerId: parseInt(customerId, 10),
        projectName,
        projectCode,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json(
      { message: "Project created successfully", project: newProject },
      { status: 201 }
    );
  } catch (error) {
    const statusCode = error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { message: error.message || "Failed to create project" },
      { status: statusCode }
    );
  }
}

// PUT: Update a project by ID
export async function PUT(request: Request) {
  try {
    const token = request.cookies.get("token")?.value;
    const userId = await verifyToken(token, process.env.JWT_SECRET!);

    const body = await request.json();
    const { id, customerId, projectName, projectCode, description, startDate, endDate } = body;

    if (!id) {
      return NextResponse.json({ message: "Project ID is required" }, { status: 400 });
    }

    const existingProject = await prisma.project.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProject || existingProject.userId !== userId) {
      return NextResponse.json({ message: "Project not found or unauthorized" }, { status: 404 });
    }

    const updatedProject = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        customerId: parseInt(customerId, 10),
        projectName,
        projectCode,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json(
      { message: "Project updated successfully", project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    const statusCode = error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { message: error.message || "Failed to update project" },
      { status: statusCode }
    );
  }
}

// DELETE: Delete a project by ID
export async function DELETE(request: Request) {
  try {
    const token = request.cookies.get("token")?.value;
    const userId = await verifyToken(token, process.env.JWT_SECRET!);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Project ID is required" }, { status: 400 });
    }

    const existingProject = await prisma.project.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProject || existingProject.userId !== userId) {
      return NextResponse.json({ message: "Project not found or unauthorized" }, { status: 404 });
    }

    await prisma.project.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
  } catch (error) {
    const statusCode = error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { message: error.message || "Failed to delete project" },
      { status: statusCode }
    );
  }
}
