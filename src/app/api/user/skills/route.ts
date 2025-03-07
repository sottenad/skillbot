import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { skillId, level } = body;

    if (!skillId) {
      return NextResponse.json(
        { message: 'Skill ID is required' },
        { status: 400 }
      );
    }

    // Check if the skill exists
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      return NextResponse.json(
        { message: 'Skill not found' },
        { status: 404 }
      );
    }

    // Check if the user already has this skill
    const existingUserSkill = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId: session.user.id,
          skillId,
        },
      },
    });

    if (existingUserSkill) {
      return NextResponse.json(
        { message: 'You already have this skill' },
        { status: 400 }
      );
    }

    // Add the skill to the user
    const userSkill = await prisma.userSkill.create({
      data: {
        userId: session.user.id,
        skillId,
        level: level || 1,
      },
      include: {
        skill: true,
      },
    });

    return NextResponse.json(
      { message: 'Skill added successfully', userSkill },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add skill error:', error);
    return NextResponse.json(
      { message: 'An error occurred while adding the skill' },
      { status: 500 }
    );
  }
} 