#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Setup database
echo "Setting up database..."
npx prisma migrate dev --name init

# Seed database
echo "Seeding database with initial data..."
npm run seed

echo "Setup complete! You can now run 'npm run dev' to start the application."
echo "Default login credentials:"
echo "Admin: admin@example.com / admin123"
echo "User: john@example.com / user123" 