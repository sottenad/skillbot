import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userSkillId = params.id;
    const body = await request.json();
    const { level } = body;

    if (level === undefined || level < 1 || level > 5) {
      return NextResponse.json(
        { message: 'Level must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if the user skill exists and belongs to the user
    const userSkill = await prisma.userSkill.findUnique({
      where: { id: userSkillId },
    });

    if (!userSkill) {
      return NextResponse.json(
        { message: 'User skill not found' },
        { status: 404 }
      );
    }

    if (userSkill.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'You do not have permission to update this skill' },
        { status: 403 }
      );
    }

    // Update the user skill
    const updatedUserSkill = await prisma.userSkill.update({
      where: { id: userSkillId },
      data: { level },
      include: {
        skill: true,
      },
    });

    return NextResponse.json(
      { message: 'Skill updated successfully', userSkill: updatedUserSkill },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update skill error:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating the skill' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userSkillId = params.id;

    // Check if the user skill exists and belongs to the user
    const userSkill = await prisma.userSkill.findUnique({
      where: { id: userSkillId },
    });

    if (!userSkill) {
      return NextResponse.json(
        { message: 'User skill not found' },
        { status: 404 }
      );
    }

    if (userSkill.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'You do not have permission to delete this skill' },
        { status: 403 }
      );
    }

    // Delete the user skill
    await prisma.userSkill.delete({
      where: { id: userSkillId },
    });

    return NextResponse.json(
      { message: 'Skill removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete skill error:', error);
    return NextResponse.json(
      { message: 'An error occurred while removing the skill' },
      { status: 500 }
    );
  }
} 