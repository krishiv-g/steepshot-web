# Multi-stage build for Steepshot Web
# Stage 1: Build the React application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production server
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --legacy-peer-deps --omit=dev

# Copy built assets from build stage
COPY --from=build /app/build ./build

# Copy server configuration
COPY configs ./configs
COPY template.js ./template.js
COPY src/app.js ./src/app.js
COPY src/routes.js ./src/routes.js
COPY src/store ./src/store
COPY src/reducers ./src/reducers
COPY src/actions ./src/actions
COPY src/services ./src/services
COPY src/utils ./src/utils
COPY src/common ./src/common
COPY src/components ./src/components
COPY src/serverPages ./src/serverPages

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the server
CMD ["npm", "run", "server"]

# Stage 3: Development server
FROM node:18-alpine AS development

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install --legacy-peer-deps

# Copy all source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start development server
CMD ["npm", "start"]
