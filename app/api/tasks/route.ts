import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        completed: body.completed,
        dueDate: new Date(body.dueDate),
        assignedTo: body.assignedTo,
        projectId: body.projectId,
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // If we're just toggling completion, only update that field
    if (body.id && typeof body.completed === 'boolean') {
      const task = await prisma.task.update({
        where: { id: body.id },
        data: {
          completed: body.completed,
        },
      });
      return NextResponse.json(task);
    }

    // For full updates
    const task = await prisma.task.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        completed: body.completed,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        assignedTo: body.assignedTo,
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error('Task update error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');
    const shouldArchive = searchParams.get('archive') === 'true';
    
    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // First get the existing task to verify it exists and get project info
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    let result;

    if (shouldArchive) {
      // Soft delete - mark as archived
      result = await prisma.task.update({
        where: { id: taskId },
        data: {
          archived: true,
          completed: true, // Also mark as completed when archiving
          title: `[ARCHIVED] ${existingTask.title}`,
          description: existingTask.description 
            ? `${existingTask.description}\n\nArchived on: ${new Date().toISOString()}`
            : `Archived on: ${new Date().toISOString()}`
        }
      });

      return NextResponse.json({ 
        success: true,
        message: 'Task archived successfully',
        archivedTask: {
          id: result.id,
          title: result.title,
          archived: true,
          archivedAt: result.updatedAt.toISOString()
        }
      });
    } else {
      // Hard delete the task
      result = await prisma.task.delete({
        where: { id: taskId }
      });

      return NextResponse.json({ 
        success: true,
        message: 'Task deleted successfully',
        deletedTask: {
          id: result.id,
          title: result.title
        }
      });
    }

  } catch (error) {
    console.error('Task delete error:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ 
          error: 'Task not found or no longer exists' 
        }, { status: 404 });
      }
      if (error.code === 'P2003') {
        return NextResponse.json({ 
          error: 'Cannot delete task due to existing dependencies' 
        }, { status: 400 });
      }
    }

    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }

    return NextResponse.json({ 
      success: false,
      error: 'Failed to delete task',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 