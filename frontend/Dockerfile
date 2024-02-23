# frontend/Dockerfile
# Use an official Node.js image with version 18.17.1
FROM node:18.17.1-alpine

# Install Python
#RUN apk add --no-cache python3

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY package-lock*.json ./

# Remove caches
RUN npm cache clean -f

# Install dependencies
RUN npm install -g npm@10.2.4
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
