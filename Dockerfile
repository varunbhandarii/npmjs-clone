# Step 1: Use the official Node.js image to create the build environment.
FROM node:16 as build

# Set the working directory inside the container.
WORKDIR /app

# Copy the package.json and install dependencies.
COPY package.json ./
RUN npm install

# Copy the entire React app to the container.
COPY . .

# Build the React app.
RUN npm run build

# Step 2: Use the official Nginx image to serve the React app.
FROM nginx:alpine

# Copy the React build output to Nginx's default directory.
COPY --from=build /app/build /usr/share/nginx/html

# Expose the default port for Nginx.
EXPOSE 80

# Start Nginx.
CMD ["nginx", "-g", "daemon off;"]
