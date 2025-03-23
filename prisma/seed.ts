const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if the default project already exists
    const existingProject = await prisma.project.findFirst({
      where: {
        title: 'Welcome Project',
      },
    });

    if (existingProject) {
      console.log('Default project already exists. Skipping seed.');
      return;
    }

    // Create a default project
    const project = await prisma.project.create({
      data: {
        title: 'Welcome Project',
        description: 'This is a sample project to help you get started with project management.',
        members: {
          create: [
            {
              memberId: 'user1',
              name: 'John Doe',
              role: 'Project Manager',
              email: 'john@example.com',
            },
            {
              memberId: 'user2',
              name: 'Jane Smith',
              role: 'Developer',
              email: 'jane@example.com',
            },
            {
              memberId: 'user3',
              name: 'Mike Johnson',
              role: 'Designer',
              email: 'mike@example.com',
            },
          ],
        },
        tasks: {
          create: [
            {
              title: 'Welcome to the Project',
              description: 'Review the project overview and team members',
              completed: false,
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
              assignedTo: 'user1',
            },
            {
              title: 'Set Up Development Environment',
              description: 'Install necessary tools and configure the development environment',
              completed: false,
              dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
              assignedTo: 'user2',
            },
            {
              title: 'Design System Setup',
              description: 'Create initial design system and component library',
              completed: false,
              dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
              assignedTo: 'user3',
            },
          ],
        },
      },
    });

    console.log('Default project created successfully:', project);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 