import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { userId } = auth();
  console.log("Authenticated User ID:", userId);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name } = body;

  if (!name || name.trim() === "") {
    return NextResponse.json(
      { message: "Company name is required" },
      { status: 400 }
    );
  }

  // Ensure the user exists in the database
  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    console.log("User not found in the database. Creating user...");
    user = await prisma.user.create({
      data: {
        id: userId,
        name: "Unknown User", // Replace with actual name if available
        email: `${userId}@example.com`, // Temporary email (replace as needed)
      },
    });
  }

  // Check if the company already exists
  const existingCompany = await prisma.company.findFirst({
    where: {
      AND: [{ name }, { ownerId: userId }],
    },
  });

  if (existingCompany) {
    return NextResponse.json(
      { message: "A company with this name already exists" },
      { status: 409 }
    );
  }

  // Create the company
  const company = await prisma.company.create({
    data: {
      name,
      ownerId: user.id, // Now guaranteed to exist
      members: {
        create: {
          userId: user.id,
          role: "owner",
        },
      },
    },
  });

  console.log("Company created:", company);
  return NextResponse.json({ message: "Company created successfully" });
}
