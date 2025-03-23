import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const member = await prisma.projectMember.update({
      where: { id: body.id },
      data: {
        name: body.name,
        role: body.role,
        email: body.email,
      },
    });
    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    await prisma.projectMember.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
} 