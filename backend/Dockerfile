# backend/Dockerfile
# Use an official Node.js image with version 18.17.1
FROM node:18.17.1-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY package-lock*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Make port available
EXPOSE 3001

# Define environment variable
ENV NODE_ENV=production

# Run server.js when the container launches
CMD ["node", "server.js"]
