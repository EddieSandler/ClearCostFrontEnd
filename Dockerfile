# Stage 1: Build the React app
FROM node:18 AS builder

# Set the working directory inside the container.
WORKDIR /app

# Copy package.json and package-lock.json.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Ensure that vite has execution permissions
RUN chmod +x node_modules/.bin/vite

# Add node_modules/.bin to the PATH
ENV PATH=/app/node_modules/.bin:$PATH

# Copy the rest of your application code.
COPY . .

# Build the React app.
RUN npm run build

# Stage 2: Serve the app with a lightweight server
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port nginx runs on
EXPOSE 80

# Define the command to run nginx
CMD ["nginx", "-g", "daemon off;"]
