# Stage 1: Build the React application
FROM node:18-alpine as builder
WORKDIR /app

# Copy the package.json and the package-lock.json
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the React app (Vite output is in 'dist' folder)
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built application from the 'builder' stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default nginx config and copy our optimized config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Create cache directories
RUN mkdir -p /var/cache/nginx

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]