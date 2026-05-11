# Stage 1: Build the application
FROM node:16-alpine

# Install Python and other necessary build tools
RUN apk add --no-cache python3 make g++

# Set the working directory
WORKDIR /app

# Copying package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -f

# Copy the rest of the application code
COPY . .

# Set environment variables
ENV PORT=3001

# Expose the port the app runs on
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]
