# SkillBot - Skill Management System

SkillBot is a comprehensive skill management application designed for tech consulting companies. It allows users to track, manage, and discover skills, with AI-powered suggestions for skill development.

## Features

- **User Authentication**: Secure login and registration system
- **Profile Management**: Users can manage their profile information including location, business unit, and role
- **Skill Management**: Add, update, and remove skills from your profile with proficiency levels
- **AI Skill Suggestions**: Get personalized skill recommendations based on your current skills and role
- **Role Templates**: Explore skill templates for common tech consulting roles
- **Admin Dashboard**: Administrators can view skill analytics and user statistics

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Prisma with SQLite (can be configured for other databases)
- **Authentication**: NextAuth.js
- **AI Integration**: Custom skill suggestion algorithm

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/skillbot.git
cd skillbot
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Copy the example .env file
cp .env.example .env.local
# Edit the .env.local file with your configuration
```

4. Set up the database
```bash
npx prisma migrate dev
```

5. Seed the database with initial data
```bash
npm run seed
```

6. Start the development server
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Default Users

After seeding the database, you can log in with the following credentials:

- **Admin User**:
  - Email: admin@example.com
  - Password: admin123

- **Regular User**:
  - Email: john@example.com
  - Password: user123

## Deployment

The application can be deployed to any platform that supports Next.js applications, such as Vercel, Netlify, or a custom server.

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
