FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
# to the /app working directory
COPY backend/api/package*.json .
COPY backend/api/. .

# Install dependencies in /app
RUN npm install

# Run npm dev, as we would via the command line 
CMD ["npm", "run", "start"]