# Use the official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the app
COPY . .

# Build the React app
RUN yarn build

# Install a lightweight web server (e.g., serve)
RUN yarn global add serve

# Expose port 3000
EXPOSE 3000

# Serve the React app
CMD ["serve", "-s", "build", "-l", "3000"]