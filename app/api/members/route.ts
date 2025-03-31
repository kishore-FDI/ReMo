import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const member = await prisma.projectMember.create({
      data: {
        memberId: body.memberId,
        name: body.name,
        role: body.role,
        email: body.email,
        projectId: body.projectId,
      },
    });
    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log('Updating member with data:', body);
    
    // First get the existing member to get the projectId
    const existingMember = await prisma.projectMember.findFirst({
      where: { memberId: body.id },
      include: {
        project: true
      }
    });

    if (!existingMember) {
      console.log('Member not found with memberId:', body.id);
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    console.log('Existing member:', existingMember);

    // Start a transaction to ensure data consistency
    const member = await prisma.$transaction(async (tx) => {
      // Update the member
      const updatedMember = await tx.projectMember.update({
        where: { 
          projectId_memberId: {
            projectId: existingMember.projectId,
            memberId: body.id
          }
        },
        data: {
          name: body.name,
          role: body.role,
          email: body.email,
        },
      });

      // Update all tasks assigned to this member to reflect the new name
      await tx.task.updateMany({
        where: {
          assignedTo: body.id,
          projectId: existingMember.projectId
        },
        data: {
          assignedTo: body.id // Keep the same memberId but ensure it's consistent
        }
      });

      return updatedMember;
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error('Member update error:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ 
          error: 'A member with this email already exists in the project' 
        }, { status: 400 });
      }
      if (error.code === 'P2025') {
        return NextResponse.json({ 
          error: 'Member not found or no longer exists' 
        }, { status: 404 });
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
      error: 'Failed to update member',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('id');
    
    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    // First get the existing member to get the projectId and check their tasks
    const existingMember = await prisma.projectMember.findFirst({
      where: { memberId },
      include: {
        project: true
      }
    });

    if (!existingMember) {
      console.log('Member not found with memberId:', memberId);
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Get count of tasks assigned to this member
    const assignedTasksCount = await prisma.task.count({
      where: {
        assignedTo: memberId,
        projectId: existingMember.projectId,
        completed: false // Only count incomplete tasks
      }
    });

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      let warnings = [];
      let updatedTasks = [];

      // First, handle tasks assigned to this member
      if (assignedTasksCount > 0) {
        // Get all tasks for this member to update them individually
        const tasks = await tx.task.findMany({
          where: {
            assignedTo: memberId,
            projectId: existingMember.projectId
          }
        });

        // Update each task individually to handle the description update
        for (const task of tasks) {
          const warningNote = `⚠️ Needs Assignment (Previously: ${existingMember.name})`;
          
          const updatedTask = await tx.task.update({
            where: { id: task.id },
            data: {
              assignedTo: '', // Empty string to represent unassigned
              title: `${task.title} [UNASSIGNED]`, // Add visual indicator in title
              description: task.description 
                ? `${task.description}\n\n${warningNote}`
                : warningNote
            }
          });
          
          updatedTasks.push({
            id: updatedTask.id,
            title: updatedTask.title,
            previousAssignee: existingMember.name
          });
        }

        warnings.push({
          type: 'UNASSIGNED_TASKS',
          message: `${assignedTasksCount} task(s) need reassignment`,
          tasks: updatedTasks
        });
      }

      // Check if member is the last member in the project
      const projectMemberCount = await tx.projectMember.count({
        where: {
          projectId: existingMember.projectId
        }
      });

      if (projectMemberCount === 1) {
        warnings.push({
          type: 'LAST_MEMBER',
          message: 'This was the last member of the project. Please add new members.',
          severity: 'HIGH'
        });
      }

      // Then delete the member
      await tx.projectMember.delete({
        where: { 
          projectId_memberId: {
            projectId: existingMember.projectId,
            memberId: memberId
          }
        },
      });

      return { 
        warnings,
        deletedMember: {
          name: existingMember.name,
          role: existingMember.role,
          email: existingMember.email
        }
      };
    });

    // Return success message with any warnings
    return NextResponse.json({ 
      success: true,
      message: 'Member deleted successfully',
      warnings: result.warnings,
      deletedMember: result.deletedMember,
      requiresAction: result.warnings.length > 0,
      actionType: assignedTasksCount > 0 ? 'REASSIGN_TASKS' : null
    });

  } catch (error) {
    console.error('Member delete error:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ 
          error: 'Member not found or no longer exists' 
        }, { status: 404 });
      }
      if (error.code === 'P2003') {
        return NextResponse.json({ 
          error: 'Cannot delete member due to existing dependencies' 
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
      error: 'Failed to delete member',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 