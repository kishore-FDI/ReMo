const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🌱 Seeding database...");

    // Create users
    const user1 = await prisma.user.upsert({
      where: { email: "alice@example.com" },
      update: {},
      create: {
        name: "Alice Johnson",
        email: "alice@example.com",
      },
    });

    const user2 = await prisma.user.upsert({
      where: { email: "bob@example.com" },
      update: {},
      create: {
        name: "Bob Smith",
        email: "bob@example.com",
      },
    });

    // Create companies
    const company1 = await prisma.company.upsert({
      where: { name: "Tech Corp" },
      update: {},
      create: {
        name: "Tech Corp",
        ownerId: user1.id,
      },
    });

    const company2 = await prisma.company.upsert({
      where: { name: "Dev Solutions" },
      update: {},
      create: {
        name: "Dev Solutions",
        ownerId: user2.id,
      },
    });

    // Add users to companies
    await prisma.companyMember.createMany({
      data: [
        { userId: user1.id, companyId: company1.id, role: "OWNER" },
        { userId: user2.id, companyId: company2.id, role: "OWNER" },
        { userId: user2.id, companyId: company1.id, role: "MEMBER" }, // Bob joins Alice's company
      ],
      skipDuplicates: true,
    });

    // Create a default project
    const project = await prisma.project.create({
      data: {
        title: "Welcome Project",
        description:
          "This is a sample project to help you get started with project management.",
        members: {
          create: [
            {
              memberId: user1.id,
              name: user1.name,
              role: "Project Manager",
              email: user1.email,
            },
            {
              memberId: user2.id,
              name: user2.name,
              role: "Developer",
              email: user2.email,
            },
          ],
        },
        tasks: {
          create: [
            {
              title: "Welcome to the Project",
              description: "Review the project overview and team members",
              completed: false,
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
              assignedTo: user1.id,
            },
            {
              title: "Set Up Development Environment",
              description:
                "Install necessary tools and configure the development environment",
              completed: false,
              dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
              assignedTo: user2.id,
            },
          ],
        },
      },
    });

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
