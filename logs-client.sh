#!/bin/bash
if docker compose version > /dev/null 2>&1; then
  docker compose logs -f client
elif which docker-compose > /dev/null 2>&1; then
  docker-compose logs -f client
else
  echo "Error: Docker Compose is not installed."
  exit 1
fi
