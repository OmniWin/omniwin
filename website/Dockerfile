FROM node:alpine

WORKDIR /app

# Copy package.json and package-lock.json
# to the /app working directory
COPY website/package.json .
COPY website/. .

RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python

# Install pnpm
RUN npm install -g pnpm

# Install dependencies in /app
RUN npm install

# Ensure port 3000 is accessible to our system
EXPOSE 3000

# Run npm dev, as we would via the command line 
CMD ["npm", "run", "dev"]