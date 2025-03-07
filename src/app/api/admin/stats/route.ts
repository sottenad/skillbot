import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Get skill statistics
    const skillStats = await prisma.$queryRaw`
      SELECT 
        s.id, 
        s.name, 
        s.category, 
        COUNT(us.id) as count, 
        AVG(us.level) as "averageLevel"
      FROM "Skill" s
      LEFT JOIN "UserSkill" us ON s.id = us.skillId
      GROUP BY s.id, s.name, s.category
      ORDER BY count DESC, s.name ASC
    `;

    // Get user statistics
    const userStats = await prisma.$queryRaw`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        COUNT(us.id) as "skillCount"
      FROM "User" u
      LEFT JOIN "UserSkill" us ON u.id = us.userId
      GROUP BY u.id, u.name, u.email
      ORDER BY "skillCount" DESC, u.name ASC
    `;

    return NextResponse.json({
      skillStats,
      userStats,
    }, { status: 200 });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching admin statistics' },
      { status: 500 }
    );
  }
} 