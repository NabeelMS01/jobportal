FROM node:22-alpine

WORKDIR /usr/src/app

# Install system dependencies (openssl is often needed by Prisma)
RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm install

COPY . .

# Generate prisma client during build just in case, but we will also do it in entrypoint
RUN npx prisma generate

EXPOSE 5001

RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
