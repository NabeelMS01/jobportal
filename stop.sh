#!/bin/bash
echo "Stopping Docker containers..."
if docker compose version > /dev/null 2>&1; then
  docker compose down
elif which docker-compose > /dev/null 2>&1; then
  docker-compose down
else
  echo "Error: Docker Compose is not installed."
  exit 1
fi
