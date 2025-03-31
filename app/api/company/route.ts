// app/api/company/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = auth();
  console.log("Fetching companies for user:", userId);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find all companies where the user is a member
    const userCompanies = await prisma.companyMember.findMany({
      where: {
        userId: userId,
      },
      include: {
        company: true,
      },
    });

    // Extract company data and format response
    const companies = userCompanies.map((membership) => ({
      id: membership.company.id,
      name: membership.company.name,
      role: membership.role,
      createdAt: membership.company.createdAt,
    }));

    return NextResponse.json({ companies });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { message: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
