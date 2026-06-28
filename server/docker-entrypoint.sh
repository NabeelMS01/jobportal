#!/bin/sh
set -e

echo "Running Prisma generate..."
npx prisma generate

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Running Prisma seeding..."
npx prisma db seed

echo "Starting server..."
exec npm run dev
