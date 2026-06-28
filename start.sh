#!/bin/bash
set -e

echo "Starting Docker containers..."
if docker compose version > /dev/null 2>&1; then
  docker compose up --build -d
elif which docker-compose > /dev/null 2>&1; then
  docker-compose up --build -d
else
  echo "Error: Docker Compose is not installed. Please install Docker Desktop or Docker Compose."
  exit 1
fi

echo "Waiting for frontend to be ready (5 seconds)..."
sleep 5

echo "Opening browser at http://localhost:5173"
if which xdg-open > /dev/null; then
  xdg-open http://localhost:5173
elif which open > /dev/null; then
  open http://localhost:5173
else
  echo "Could not detect the web browser. Please open http://localhost:5173 manually."
fi

echo "Attaching to logs (Press Ctrl+C to stop viewing logs without stopping the containers)..."
if docker compose version > /dev/null 2>&1; then
  docker compose logs -f
else
  docker-compose logs -f
fi
