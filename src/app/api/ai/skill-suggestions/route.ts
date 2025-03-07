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
    const { userSkills, role } = body;

    if (!userSkills || !Array.isArray(userSkills) || userSkills.length === 0) {
      return NextResponse.json(
        { message: 'User skills are required' },
        { status: 400 }
      );
    }

    // Get all skills from the database
    const allSkills = await prisma.skill.findMany();
    
    // Filter out skills that the user already has
    const userSkillNames = userSkills.map(skill => skill.name.toLowerCase());
    const availableSkills = allSkills.filter(
      skill => !userSkillNames.includes(skill.name.toLowerCase())
    );

    // Get role skills if the user has a role
    let roleSkills: any[] = [];
    if (role) {
      const roleData = await prisma.role.findFirst({
        where: {
          name: {
            contains: role,
          },
        },
        include: {
          roleSkills: {
            include: {
              skill: true,
            },
          },
        },
      });

      if (roleData && roleData.roleSkills) {
        roleSkills = roleData.roleSkills;
      }
    }

    // Generate suggestions based on user skills and role
    const suggestions = generateSkillSuggestions(
      userSkills,
      availableSkills,
      roleSkills,
      role
    );

    return NextResponse.json({ suggestions }, { status: 200 });
  } catch (error) {
    console.error('Skill suggestions error:', error);
    return NextResponse.json(
      { message: 'An error occurred while generating skill suggestions' },
      { status: 500 }
    );
  }
}

function generateSkillSuggestions(
  userSkills: any[],
  availableSkills: any[],
  roleSkills: any[],
  userRole: string
) {
  const suggestions: any[] = [];
  const maxSuggestions = 5;
  
  // First, suggest skills from the user's role that they don't have yet
  if (roleSkills.length > 0) {
    const userSkillNames = userSkills.map(skill => skill.name.toLowerCase());
    
    const missingRoleSkills = roleSkills
      .filter(rs => !userSkillNames.includes(rs.skill.name.toLowerCase()))
      .sort((a, b) => b.importance - a.importance) // Sort by importance
      .slice(0, maxSuggestions);
    
    for (const roleSkill of missingRoleSkills) {
      suggestions.push({
        id: roleSkill.skill.id,
        name: roleSkill.skill.name,
        category: roleSkill.skill.category,
        description: roleSkill.skill.description,
        reason: `This is a ${roleSkill.importance >= 4 ? 'highly important' : 'recommended'} skill for ${userRole} roles.`,
      });
    }
  }

  // If we still need more suggestions, add complementary skills based on categories
  if (suggestions.length < maxSuggestions) {
    // Get the categories the user has skills in
    const userCategories = new Set(
      userSkills
        .filter(skill => skill.category)
        .map(skill => skill.category.toLowerCase())
    );
    
    // Find skills in the same categories
    const categoryBasedSkills = availableSkills
      .filter(skill => 
        skill.category && 
        userCategories.has(skill.category.toLowerCase()) &&
        !suggestions.some(s => s.id === skill.id)
      )
      .slice(0, maxSuggestions - suggestions.length);
    
    for (const skill of categoryBasedSkills) {
      suggestions.push({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        description: skill.description,
        reason: `This skill complements your existing ${skill.category} skills.`,
      });
    }
  }

  // If we still need more suggestions, add skills based on common combinations
  if (suggestions.length < maxSuggestions) {
    const commonCombinations: Record<string, string[]> = {
      'JavaScript': ['TypeScript', 'React', 'Node.js', 'Express.js'],
      'React': ['Redux', 'Next.js', 'CSS', 'JavaScript'],
      'Python': ['Django', 'Flask', 'Pandas', 'Data Analysis'],
      'Java': ['Spring Boot', 'Hibernate', 'SQL'],
      'C#': ['.NET', 'ASP.NET', 'SQL Server'],
      '.NET': ['C#', 'ASP.NET', 'SQL Server'],
      'Data Analysis': ['Python', 'SQL', 'Pandas', 'Machine Learning'],
      'Machine Learning': ['Python', 'TensorFlow', 'PyTorch', 'Data Analysis'],
      'DevOps': ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      'AWS': ['Cloud', 'DevOps', 'Terraform', 'Docker'],
      'SQL': ['PostgreSQL', 'MySQL', 'Database Design'],
    };
    
    const userSkillNames = userSkills.map(skill => skill.name);
    const suggestedNames = suggestions.map(skill => skill.name);
    
    const combinationSuggestions = new Set<string>();
    
    for (const userSkill of userSkillNames) {
      const combinations = commonCombinations[userSkill] || [];
      for (const combo of combinations) {
        if (
          !userSkillNames.includes(combo) && 
          !suggestedNames.includes(combo) &&
          !combinationSuggestions.has(combo)
        ) {
          combinationSuggestions.add(combo);
        }
      }
    }
    
    for (const comboName of combinationSuggestions) {
      const skill = availableSkills.find(
        s => s.name.toLowerCase() === comboName.toLowerCase()
      );
      
      if (skill && suggestions.length < maxSuggestions) {
        suggestions.push({
          id: skill.id,
          name: skill.name,
          category: skill.category,
          description: skill.description,
          reason: `This skill is commonly used together with ${findMatchingSkill(userSkillNames, commonCombinations, comboName)}.`,
        });
      }
      
      if (suggestions.length >= maxSuggestions) break;
    }
  }

  // If we still need more suggestions, add popular skills
  if (suggestions.length < maxSuggestions) {
    const popularSkills = [
      'JavaScript', 'Python', 'SQL', 'React', 'Node.js', 
      'AWS', 'Docker', 'Git', 'TypeScript', 'Java',
      'C#', '.NET', 'Angular', 'Vue.js', 'Machine Learning',
      'Data Analysis', 'DevOps', 'Agile', 'Scrum'
    ];
    
    const userSkillNames = userSkills.map(skill => skill.name.toLowerCase());
    const suggestedNames = suggestions.map(skill => skill.name.toLowerCase());
    
    for (const popularSkill of popularSkills) {
      if (
        !userSkillNames.includes(popularSkill.toLowerCase()) && 
        !suggestedNames.includes(popularSkill.toLowerCase())
      ) {
        const skill = availableSkills.find(
          s => s.name.toLowerCase() === popularSkill.toLowerCase()
        );
        
        if (skill) {
          suggestions.push({
            id: skill.id,
            name: skill.name,
            category: skill.category,
            description: skill.description,
            reason: 'This is a popular skill in the tech industry that could enhance your profile.',
          });
        }
        
        if (suggestions.length >= maxSuggestions) break;
      }
    }
  }

  return suggestions;
}

function findMatchingSkill(userSkills: string[], combinations: Record<string, string[]>, targetSkill: string): string {
  for (const [skill, combos] of Object.entries(combinations)) {
    if (userSkills.includes(skill) && combos.includes(targetSkill)) {
      return skill;
    }
  }
  return 'your existing skills';
} 