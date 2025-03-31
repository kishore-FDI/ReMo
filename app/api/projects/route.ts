import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ProjectMember {
  id: string;
  memberId: string;
  name: string;
  role: string;
  email: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: Date;
  assignedTo: string;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  members: ProjectMember[];
  tasks: Task[];
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        members: true,
        tasks: true,
      },
    });

    // Transform the projects to include member names in tasks
    const transformedProjects = projects.map((project: Project) => ({
      ...project,
      tasks: project.tasks.map((task: Task) => ({
        ...task,
        assignedTo: {
          memberId: task.assignedTo,
          name: project.members.find((m: ProjectMember) => m.memberId === task.assignedTo)?.name || ''
        }
      }))
    }));

    return NextResponse.json(transformedProjects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
      },
      include: {
        members: true,
        tasks: true,
      },
    });

    // Transform the project to include member names in tasks
    const transformedProject = {
      ...project,
      tasks: project.tasks.map((task: Task) => ({
        ...task,
        assignedTo: {
          memberId: task.assignedTo,
          name: project.members.find((m: ProjectMember) => m.memberId === task.assignedTo)?.name || ''
        }
      }))
    };

    return NextResponse.json(transformedProject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const project = await prisma.project.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
      },
      include: {
        members: true,
        tasks: true,
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
} 