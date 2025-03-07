# Deployment Guide for SkillBot

This guide provides instructions for deploying the SkillBot application to various hosting platforms.

## Prerequisites

- Node.js 18+ and npm
- A PostgreSQL database (for production)
- Git repository with your SkillBot code

## Database Setup

For production, you'll need a hosted PostgreSQL database. Here are some options:

1. **Supabase**: [https://supabase.com/](https://supabase.com/)
2. **Railway**: [https://railway.app/](https://railway.app/)
3. **Neon**: [https://neon.tech/](https://neon.tech/)
4. **PlanetScale**: [https://planetscale.com/](https://planetscale.com/)

After setting up your database, update your `.env` file with the connection strings:

```
# Connect to your database via connection pooling (if available)
DATABASE_URL="postgresql://username:password@hostname:port/database?schema=public"

# Direct connection to the database (for migrations)
DIRECT_URL="postgresql://username:password@hostname:port/database?schema=public"
```

## Deployment Options

### 1. Vercel (Recommended for Next.js)

1. **Create a Vercel account**: [https://vercel.com/signup](https://vercel.com/signup)

2. **Install the Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy the application**:
   ```bash
   vercel
   ```

5. **Configure environment variables**:
   - Go to your project on the Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add the following variables:
     - `DATABASE_URL`
     - `DIRECT_URL` (if needed)
     - `NEXTAUTH_SECRET` (generate a secure random string)
     - `NEXTAUTH_URL` (set to your Vercel deployment URL)
     - `OPENAI_API_KEY` (if using OpenAI features)

6. **Seed the database**:
   ```bash
   vercel env pull .env.production.local
   npm run seed:js
   ```

### 2. Railway

1. **Create a Railway account**: [https://railway.app/](https://railway.app/)

2. **Install the Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

3. **Login to Railway**:
   ```bash
   railway login
   ```

4. **Create a new project**:
   ```bash
   railway init
   ```

5. **Add a PostgreSQL database**:
   - From the Railway dashboard, add a PostgreSQL plugin
   - Copy the connection string

6. **Deploy the application**:
   ```bash
   railway up
   ```

7. **Configure environment variables**:
   - Add the same environment variables as listed in the Vercel section

### 3. Netlify

1. **Create a Netlify account**: [https://app.netlify.com/signup](https://app.netlify.com/signup)

2. **Install the Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

3. **Login to Netlify**:
   ```bash
   netlify login
   ```

4. **Initialize a new site**:
   ```bash
   netlify init
   ```

5. **Deploy the application**:
   ```bash
   netlify deploy --prod
   ```

6. **Configure environment variables**:
   - Go to your site on the Netlify dashboard
   - Navigate to Site settings > Environment variables
   - Add the same environment variables as listed in the Vercel section

## Post-Deployment Steps

1. **Seed the database**:
   ```bash
   node seed-db.js
   ```

2. **Verify the deployment**:
   - Visit your deployed application URL
   - Try logging in with the default credentials:
     - Admin: admin@example.com / admin123
     - User: john@example.com / user123

3. **Update the default passwords** for security reasons.

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Check your connection strings in the environment variables
2. Ensure your database server is running and accessible
3. Check if your hosting provider requires additional configuration for database connections

### NextAuth Issues

If you encounter authentication issues:

1. Ensure `NEXTAUTH_SECRET` is set correctly
2. Ensure `NEXTAUTH_URL` matches your deployment URL
3. Check the server logs for more detailed error messages

## Production Considerations

1. **Security**:
   - Change default passwords
   - Use a strong `NEXTAUTH_SECRET`
   - Consider adding rate limiting for API routes

2. **Performance**:
   - Consider using a connection pooler for the database
   - Enable caching where appropriate

3. **Monitoring**:
   - Set up error tracking (e.g., Sentry)
   - Set up performance monitoring

## Support

If you encounter any issues with deployment, please open an issue on the GitHub repository. 