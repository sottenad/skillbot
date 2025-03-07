import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting minimal database seed...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.userSkill.deleteMany();
    await prisma.roleSkill.deleteMany();
    await prisma.user.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.role.deleteMany();

    // Create admin user
    console.log('Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        isAdmin: true,
        location: 'Headquarters',
        businessUnit: 'IT Operations',
        role: 'System Administrator',
      },
    });

    // Create regular user
    console.log('Creating regular user...');
    const userPassword = await bcrypt.hash('user123', 10);
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: userPassword,
        location: 'New York',
        businessUnit: 'Software Development',
        role: 'Full Stack Developer',
      },
    });

    // Create a few essential skills
    console.log('Creating essential skills...');
    await prisma.skill.create({ 
      data: { 
        name: 'JavaScript', 
        category: 'Programming Language', 
        description: 'A scripting language for web development' 
      } 
    });
    
    await prisma.skill.create({ 
      data: { 
        name: 'Python', 
        category: 'Programming Language', 
        description: 'General-purpose programming language' 
      } 
    });
    
    await prisma.skill.create({ 
      data: { 
        name: 'SQL', 
        category: 'Database', 
        description: 'Language for managing relational databases' 
      } 
    });

    // Create a role
    console.log('Creating role...');
    await prisma.role.create({
      data: {
        name: 'Full Stack Developer',
        description: 'Develops both client and server software',
      },
    });

    console.log('Minimal database seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 