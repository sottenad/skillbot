@echo off
echo Installing dependencies...
call npm install

echo Setting up database...
call npx prisma migrate dev --name init

echo Seeding database with initial data...
call npm run seed

echo Setup complete! You can now run 'npm run dev' to start the application.
echo Default login credentials:
echo Admin: admin@example.com / admin123
echo User: john@example.com / user123
pause 