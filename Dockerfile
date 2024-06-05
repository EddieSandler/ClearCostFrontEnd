# Use the official Node.js image.
FROM node:14

# Set the working directory inside the container.
WORKDIR /app

# Copy package.json and package-lock.json.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of your application code.
COPY . .

# Build the React app.
RUN npm run build

# Install serve to serve the build directory.
RUN npm install -g serve

# Expose the port serve runs on.
EXPOSE 8080

# Define the command to run your app.
CMD ["serve", "-s", "dist"]
