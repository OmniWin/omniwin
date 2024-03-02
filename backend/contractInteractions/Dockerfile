FROM node:21-alpine

WORKDIR /app

# Install PM2 globally within the image
RUN npm install -g pm2
RUN npm install -g ts-node

# Copy package.json and package-lock.json
# to the /app working directory
COPY backend/contractInteractions/package*.json ./

# Install dependencies in /app
RUN npm install

COPY backend/contractInteractions/. .

# Use PM2 to run your application based on the ecosystem.config.js configuration
CMD ["pm2-runtime", "start", "ecosystem.config.js"]