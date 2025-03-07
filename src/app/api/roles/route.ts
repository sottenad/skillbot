import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const roles = await prisma.role.findMany({
      include: {
        roleSkills: {
          include: {
            skill: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Transform the data to a more convenient format for the frontend
    const transformedRoles = roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      skills: role.roleSkills.map(rs => ({
        skill: {
          id: rs.skill.id,
          name: rs.skill.name,
          category: rs.skill.category,
          description: rs.skill.description,
        },
        importance: rs.importance,
      })),
    }));

    return NextResponse.json(transformedRoles, { status: 200 });
  } catch (error) {
    console.error('Roles fetch error:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching roles' },
      { status: 500 }
    );
  }
} 