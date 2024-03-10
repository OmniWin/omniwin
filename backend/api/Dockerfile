FROM node:21-alpine

WORKDIR /app

# Install MySQL client to allow the container to interact with MySQL and entrypoint script
RUN apk --no-cache add mysql-client

# Copy package.json and package-lock.json
# to the /app working directory
COPY backend/api/package*.json .

# Install dependencies in /app
RUN npm install

COPY backend/api/. .

# Copy the entrypoint script
COPY backend/api/docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Set the entrypoint script to run on container start
ENTRYPOINT ["sh", "docker-entrypoint.sh"]

# Run npm dev, as we would via the command line
# CMD ["npm", "run", "dev"]