FROM node:alpine

WORKDIR /app

# Installing dependencies for native builds
# Only include these if you're sure you need them for your packages
RUN apk add --update --no-cache python3 make g++ && ln -sf python3 /usr/bin/python

# Install pnpm
RUN npm install -g pnpm

# Copying package files first to leverage Docker cache
COPY website/package.json website/pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY website/. .

# Ensure port 3000 is accessible to our system
EXPOSE 3000

# Command to run the development server
CMD ["pnpm", "run", "dev"]