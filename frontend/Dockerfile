# frontend/Dockerfile

# Use an official Node.js image as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app for production
RUN npm run build

# Serve the built app using a lightweight web server
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the React app
CMD ["serve", "-s", "build"]