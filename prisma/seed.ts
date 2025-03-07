import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.userSkill.deleteMany();
  await prisma.roleSkill.deleteMany();
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.role.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
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
  const userPassword = await bcrypt.hash('user123', 10);
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      location: 'New York',
      businessUnit: 'Software Development',
      role: 'Full Stack Developer',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: userPassword,
      location: 'San Francisco',
      businessUnit: 'Data Analytics',
      role: 'Data Scientist',
    },
  });

  // Create skills
  const skills = await Promise.all([
    // Programming Languages
    prisma.skill.create({ data: { name: 'JavaScript', category: 'Programming Language', description: 'A scripting language for web development' } }),
    prisma.skill.create({ data: { name: 'TypeScript', category: 'Programming Language', description: 'Typed superset of JavaScript' } }),
    prisma.skill.create({ data: { name: 'Python', category: 'Programming Language', description: 'General-purpose programming language' } }),
    prisma.skill.create({ data: { name: 'Java', category: 'Programming Language', description: 'Object-oriented programming language' } }),
    prisma.skill.create({ data: { name: 'C#', category: 'Programming Language', description: 'Object-oriented programming language by Microsoft' } }),
    prisma.skill.create({ data: { name: '.NET', category: 'Framework', description: 'Microsoft development framework' } }),
    
    // Frontend
    prisma.skill.create({ data: { name: 'React', category: 'Frontend', description: 'JavaScript library for building user interfaces' } }),
    prisma.skill.create({ data: { name: 'Angular', category: 'Frontend', description: 'Platform for building mobile and desktop web applications' } }),
    prisma.skill.create({ data: { name: 'Vue.js', category: 'Frontend', description: 'Progressive JavaScript framework' } }),
    prisma.skill.create({ data: { name: 'HTML', category: 'Frontend', description: 'Markup language for web pages' } }),
    prisma.skill.create({ data: { name: 'CSS', category: 'Frontend', description: 'Style sheet language for web pages' } }),
    
    // Backend
    prisma.skill.create({ data: { name: 'Node.js', category: 'Backend', description: 'JavaScript runtime environment' } }),
    prisma.skill.create({ data: { name: 'Express.js', category: 'Backend', description: 'Web application framework for Node.js' } }),
    prisma.skill.create({ data: { name: 'Django', category: 'Backend', description: 'Python web framework' } }),
    prisma.skill.create({ data: { name: 'Flask', category: 'Backend', description: 'Micro web framework for Python' } }),
    prisma.skill.create({ data: { name: 'Spring Boot', category: 'Backend', description: 'Java-based framework' } }),
    
    // Database
    prisma.skill.create({ data: { name: 'SQL', category: 'Database', description: 'Language for managing relational databases' } }),
    prisma.skill.create({ data: { name: 'MongoDB', category: 'Database', description: 'NoSQL database' } }),
    prisma.skill.create({ data: { name: 'PostgreSQL', category: 'Database', description: 'Open-source relational database' } }),
    prisma.skill.create({ data: { name: 'MySQL', category: 'Database', description: 'Open-source relational database' } }),
    
    // DevOps
    prisma.skill.create({ data: { name: 'Docker', category: 'DevOps', description: 'Platform for developing, shipping, and running applications' } }),
    prisma.skill.create({ data: { name: 'Kubernetes', category: 'DevOps', description: 'Container orchestration system' } }),
    prisma.skill.create({ data: { name: 'AWS', category: 'Cloud', description: 'Amazon Web Services cloud platform' } }),
    prisma.skill.create({ data: { name: 'Azure', category: 'Cloud', description: 'Microsoft cloud platform' } }),
    prisma.skill.create({ data: { name: 'GCP', category: 'Cloud', description: 'Google Cloud Platform' } }),
    
    // Data Science
    prisma.skill.create({ data: { name: 'Machine Learning', category: 'Data Science', description: 'Field of AI focused on learning from data' } }),
    prisma.skill.create({ data: { name: 'Data Analysis', category: 'Data Science', description: 'Process of inspecting and modeling data' } }),
    prisma.skill.create({ data: { name: 'Pandas', category: 'Data Science', description: 'Data manipulation library for Python' } }),
    prisma.skill.create({ data: { name: 'TensorFlow', category: 'Data Science', description: 'Open-source machine learning framework' } }),
    prisma.skill.create({ data: { name: 'PyTorch', category: 'Data Science', description: 'Open-source machine learning library' } }),
    
    // Project Management
    prisma.skill.create({ data: { name: 'Agile', category: 'Project Management', description: 'Iterative approach to project management' } }),
    prisma.skill.create({ data: { name: 'Scrum', category: 'Project Management', description: 'Framework for agile development' } }),
    prisma.skill.create({ data: { name: 'Kanban', category: 'Project Management', description: 'Visual system for managing work' } }),
    prisma.skill.create({ data: { name: 'JIRA', category: 'Project Management', description: 'Issue tracking product' } }),
  ]);

  // Create roles
  const roles = await Promise.all([
    prisma.role.create({
      data: {
        name: 'Full Stack Developer',
        description: 'Develops both client and server software',
      },
    }),
    prisma.role.create({
      data: {
        name: 'Frontend Developer',
        description: 'Specializes in developing user interfaces',
      },
    }),
    prisma.role.create({
      data: {
        name: 'Backend Developer',
        description: 'Focuses on server-side logic and databases',
      },
    }),
    prisma.role.create({
      data: {
        name: 'DevOps Engineer',
        description: 'Combines software development and IT operations',
      },
    }),
    prisma.role.create({
      data: {
        name: 'Data Scientist',
        description: 'Analyzes and interprets complex data',
      },
    }),
    prisma.role.create({
      data: {
        name: 'Project Manager',
        description: 'Leads and manages projects',
      },
    }),
    prisma.role.create({
      data: {
        name: '.NET Developer',
        description: 'Specializes in Microsoft .NET framework',
      },
    }),
  ]);

  // Map skills to roles
  const skillMap = skills.reduce((acc, skill) => {
    acc[skill.name] = skill.id;
    return acc;
  }, {} as Record<string, string>);

  const roleMap = roles.reduce((acc, role) => {
    acc[role.name] = role.id;
    return acc;
  }, {} as Record<string, string>);

  // Associate skills with roles
  const roleSkillsData = [
    // Full Stack Developer
    { roleId: roleMap['Full Stack Developer'], skillId: skillMap['JavaScript'], importance: 5 },
    { roleId: roleMap['Full Stack Developer'], skillId: skillMap['TypeScript'], importance: 4 },
    { roleId: roleMap['Full Stack Developer'], skillId: skillMap['React'], importance: 4 },
    { roleId: roleMap['Full Stack Developer'], skillId: skillMap['Node.js'], importance: 4 },
    { roleId: roleMap['Full Stack Developer'], skillId: skillMap['SQL'], importance: 3 },
    { roleId: roleMap['Full Stack Developer'], skillId: skillMap['HTML'], importance: 5 },
    { roleId: roleMap['Full Stack Developer'], skillId: skillMap['CSS'], importance: 5 },
    { roleId: roleMap['Full Stack Developer'], skillId: skillMap['Express.js'], importance: 3 },
    
    // Frontend Developer
    { roleId: roleMap['Frontend Developer'], skillId: skillMap['JavaScript'], importance: 5 },
    { roleId: roleMap['Frontend Developer'], skillId: skillMap['TypeScript'], importance: 4 },
    { roleId: roleMap['Frontend Developer'], skillId: skillMap['React'], importance: 5 },
    { roleId: roleMap['Frontend Developer'], skillId: skillMap['HTML'], importance: 5 },
    { roleId: roleMap['Frontend Developer'], skillId: skillMap['CSS'], importance: 5 },
    { roleId: roleMap['Frontend Developer'], skillId: skillMap['Angular'], importance: 3 },
    { roleId: roleMap['Frontend Developer'], skillId: skillMap['Vue.js'], importance: 3 },
    
    // Backend Developer
    { roleId: roleMap['Backend Developer'], skillId: skillMap['Node.js'], importance: 4 },
    { roleId: roleMap['Backend Developer'], skillId: skillMap['Express.js'], importance: 4 },
    { roleId: roleMap['Backend Developer'], skillId: skillMap['Python'], importance: 4 },
    { roleId: roleMap['Backend Developer'], skillId: skillMap['Java'], importance: 4 },
    { roleId: roleMap['Backend Developer'], skillId: skillMap['SQL'], importance: 5 },
    { roleId: roleMap['Backend Developer'], skillId: skillMap['MongoDB'], importance: 3 },
    { roleId: roleMap['Backend Developer'], skillId: skillMap['PostgreSQL'], importance: 4 },
    
    // DevOps Engineer
    { roleId: roleMap['DevOps Engineer'], skillId: skillMap['Docker'], importance: 5 },
    { roleId: roleMap['DevOps Engineer'], skillId: skillMap['Kubernetes'], importance: 4 },
    { roleId: roleMap['DevOps Engineer'], skillId: skillMap['AWS'], importance: 4 },
    { roleId: roleMap['DevOps Engineer'], skillId: skillMap['Azure'], importance: 3 },
    { roleId: roleMap['DevOps Engineer'], skillId: skillMap['GCP'], importance: 3 },
    { roleId: roleMap['DevOps Engineer'], skillId: skillMap['Python'], importance: 3 },
    
    // Data Scientist
    { roleId: roleMap['Data Scientist'], skillId: skillMap['Python'], importance: 5 },
    { roleId: roleMap['Data Scientist'], skillId: skillMap['Machine Learning'], importance: 5 },
    { roleId: roleMap['Data Scientist'], skillId: skillMap['Data Analysis'], importance: 5 },
    { roleId: roleMap['Data Scientist'], skillId: skillMap['Pandas'], importance: 4 },
    { roleId: roleMap['Data Scientist'], skillId: skillMap['TensorFlow'], importance: 3 },
    { roleId: roleMap['Data Scientist'], skillId: skillMap['PyTorch'], importance: 3 },
    { roleId: roleMap['Data Scientist'], skillId: skillMap['SQL'], importance: 4 },
    
    // Project Manager
    { roleId: roleMap['Project Manager'], skillId: skillMap['Agile'], importance: 5 },
    { roleId: roleMap['Project Manager'], skillId: skillMap['Scrum'], importance: 4 },
    { roleId: roleMap['Project Manager'], skillId: skillMap['Kanban'], importance: 4 },
    { roleId: roleMap['Project Manager'], skillId: skillMap['JIRA'], importance: 4 },
    
    // .NET Developer
    { roleId: roleMap['.NET Developer'], skillId: skillMap['C#'], importance: 5 },
    { roleId: roleMap['.NET Developer'], skillId: skillMap['.NET'], importance: 5 },
    { roleId: roleMap['.NET Developer'], skillId: skillMap['SQL'], importance: 4 },
    { roleId: roleMap['.NET Developer'], skillId: skillMap['JavaScript'], importance: 3 },
    { roleId: roleMap['.NET Developer'], skillId: skillMap['HTML'], importance: 3 },
    { roleId: roleMap['.NET Developer'], skillId: skillMap['CSS'], importance: 3 },
  ];

  await Promise.all(
    roleSkillsData.map((data) =>
      prisma.roleSkill.create({
        data,
      })
    )
  );

  // Associate skills with users
  await Promise.all([
    // John Doe (Full Stack Developer)
    prisma.userSkill.create({ data: { userId: user1.id, skillId: skillMap['JavaScript'], level: 5 } }),
    prisma.userSkill.create({ data: { userId: user1.id, skillId: skillMap['TypeScript'], level: 4 } }),
    prisma.userSkill.create({ data: { userId: user1.id, skillId: skillMap['React'], level: 4 } }),
    prisma.userSkill.create({ data: { userId: user1.id, skillId: skillMap['Node.js'], level: 4 } }),
    prisma.userSkill.create({ data: { userId: user1.id, skillId: skillMap['HTML'], level: 5 } }),
    prisma.userSkill.create({ data: { userId: user1.id, skillId: skillMap['CSS'], level: 4 } }),
    prisma.userSkill.create({ data: { userId: user1.id, skillId: skillMap['MongoDB'], level: 3 } }),
    
    // Jane Smith (Data Scientist)
    prisma.userSkill.create({ data: { userId: user2.id, skillId: skillMap['Python'], level: 5 } }),
    prisma.userSkill.create({ data: { userId: user2.id, skillId: skillMap['Machine Learning'], level: 4 } }),
    prisma.userSkill.create({ data: { userId: user2.id, skillId: skillMap['Data Analysis'], level: 5 } }),
    prisma.userSkill.create({ data: { userId: user2.id, skillId: skillMap['Pandas'], level: 5 } }),
    prisma.userSkill.create({ data: { userId: user2.id, skillId: skillMap['SQL'], level: 3 } }),
  ]);

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 