FROM node:21-alpine

WORKDIR /app

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
ENTRYPOINT ["docker-entrypoint.sh"]

# Run npm dev, as we would via the command line
CMD ["npm", "run", "dev"]