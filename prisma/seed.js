const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      id: "user1",
      name: "John Doe",
      email: "johndoe@flipkart.com",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: "user2",
      name: "Jane Smith",
      email: "janesmith@flipkart.com",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      id: "user3",
      name: "Alice Brown",
      email: "alicebrown@flipkart.com",
    },
  });

  const user4 = await prisma.user.create({
    data: {
      id: "user4",
      name: "Bob Johnson",
      email: "bobjohnson@flipkart.com",
    },
  });

  // Create Flipkart Company
  const flipkartCompany = await prisma.company.create({
    data: {
      name: "Flipkart",
      ownerId: user1.id, // John Doe as the owner
    },
  });

  // Add users as company members
  await prisma.companyMember.create({
    data: {
      userId: user1.id,
      companyId: flipkartCompany.id,
      role: "Owner",
    },
  });

  await prisma.companyMember.create({
    data: {
      userId: user2.id,
      companyId: flipkartCompany.id,
      role: "Manager",
    },
  });

  await prisma.companyMember.create({
    data: {
      userId: user3.id,
      companyId: flipkartCompany.id,
      role: "Developer",
    },
  });

  await prisma.companyMember.create({
    data: {
      userId: user4.id,
      companyId: flipkartCompany.id,
      role: "Developer",
    },
  });

  // Create Projects for Flipkart
  const project1 = await prisma.project.create({
    data: {
      title: "Website Revamp",
      description:
        "Revamping the Flipkart website for better user experience and performance.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: "Mobile App Update",
      description:
        "Updating the Flipkart mobile app with new features and bug fixes.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Assign Project Members
  await prisma.projectMember.create({
    data: {
      memberId: user2.id, // Jane Smith is the manager for Website Revamp
      name: user2.name,
      role: "Manager",
      email: user2.email,
      projectId: project1.id,
    },
  });

  await prisma.projectMember.create({
    data: {
      memberId: user3.id, // Alice Brown is the Developer for Website Revamp
      name: user3.name,
      role: "Developer",
      email: user3.email,
      projectId: project1.id,
    },
  });

  await prisma.projectMember.create({
    data: {
      memberId: user4.id, // Bob Johnson is the Developer for Website Revamp
      name: user4.name,
      role: "Developer",
      email: user4.email,
      projectId: project1.id,
    },
  });

  // Create Tasks for the Website Revamp Project
  const task1 = await prisma.task.create({
    data: {
      title: "UI Redesign",
      description: "Redesign the homepage and product pages.",
      dueDate: new Date("2025-05-15"),
      assignedTo: user3.id, // Alice Brown
      projectId: project1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "Performance Optimization",
      description: "Improve page load speed and optimize search functionality.",
      dueDate: new Date("2025-06-01"),
      assignedTo: user4.id, // Bob Johnson
      projectId: project1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create Tasks for Mobile App Update Project
  const task3 = await prisma.task.create({
    data: {
      title: "Feature Enhancements",
      description:
        "Add new features like wishlist and better search in the app.",
      dueDate: new Date("2025-07-15"),
      assignedTo: user3.id, // Alice Brown
      projectId: project2.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: "Bug Fixing",
      description:
        "Fix reported bugs related to user authentication and checkout.",
      dueDate: new Date("2025-06-10"),
      assignedTo: user4.id, // Bob Johnson
      projectId: project2.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log("Data seeded successfully!");
}

// Run the seed function
main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect(); // Disconnect Prisma client
  });
