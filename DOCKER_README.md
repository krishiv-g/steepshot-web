# Steepshot Web - Docker Setup

This document explains how to build and run Steepshot Web using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 10GB disk space

## Quick Start

### Development Mode (with hot reload)

```bash
# Build and start development server
docker-compose up steepshot-dev

# Or run in detached mode
docker-compose up -d steepshot-dev

# View logs
docker-compose logs -f steepshot-dev

# Stop
docker-compose down
```

The development server will be available at: **http://localhost:3000**

### Production Mode

```bash
# Build and start production server
docker-compose --profile production up steepshot-prod

# Or run in detached mode
docker-compose --profile production up -d steepshot-prod

# View logs
docker-compose --profile production logs -f steepshot-prod

# Stop
docker-compose --profile production down
```

The production server will be available at: **http://localhost:3001**

## NPM Scripts

The following npm scripts are available for Docker operations:

```bash
# Build Docker image
npm run docker:build

# Run development server with docker-compose
npm run docker:run

# Stop all containers
npm run docker:stop
```

## Manual Docker Commands

### Build Only

```bash
# Build development image
docker build --target development -t steepshot-web:dev .

# Build production image
docker build --target production -t steepshot-web:prod .
```

### Run Containers Manually

```bash
# Run development container
docker run -p 3000:3000 \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/public:/app/public \
  -e NODE_ENV=development \
  steepshot-web:dev

# Run production container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  steepshot-web:prod
```

## Environment Variables

The following environment variables can be configured:

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | development | Set to 'production' for production builds |
| CHOKIDAR_USEPOLLING | true | Enable file watching in Docker |
| WATCHPACK_POLLING | true | Enable webpack polling |

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, modify `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Change host port
```

### File Changes Not Detected (Development)

Ensure volumes are properly mounted in `docker-compose.yml`:

```yaml
volumes:
  - ./src:/app/src
  - ./public:/app/public
  - /app/node_modules  # Important: exclude node_modules
```

### Build Failures

Clear Docker cache and rebuild:

```bash
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up
```

### Out of Memory

Increase Docker memory limit:

```bash
# Increase to 4GB
docker run -m 4g ...
```

Or modify `docker-compose.yml`:

```yaml
services:
  steepshot-dev:
    mem_limit: 4g
```

## Development Workflow

1. **Start development server:**
   ```bash
   docker-compose up steepshot-dev
   ```

2. **Make code changes** in `src/` directory
   - Changes will automatically trigger hot reload
   - View changes at http://localhost:3000

3. **View logs:**
   ```bash
   docker-compose logs -f steepshot-dev
   ```

4. **Access container shell:**
   ```bash
   docker exec -it steepshot-web-dev sh
   ```

5. **Install new dependencies:**
   ```bash
   # Add package to package.json, then:
   docker-compose down
   docker-compose build
   docker-compose up
   ```

## Production Deployment

1. **Build production image:**
   ```bash
   docker build --target production -t steepshot-web:latest .
   ```

2. **Test production build locally:**
   ```bash
   docker run -p 3000:3000 steepshot-web:latest
   ```

3. **Deploy to registry:**
   ```bash
   docker tag steepshot-web:latest your-registry/steepshot-web:latest
   docker push your-registry/steepshot-web:latest
   ```

## Health Checks

The production container includes automatic health checks:

```bash
# Check container health
docker ps

# Manual health check
docker exec steepshot-web-prod node -e "require('http').get('http://localhost:3000')"
```

## Volumes and Data Persistence

Development mode mounts source code as volumes for hot reload. Production mode copies files into the image.

### Development Volumes:
- `./src` → `/app/src` (React source code)
- `./public` → `/app/public` (Static assets)
- `/app/node_modules` (excluded from mount)

## Multi-Stage Build

The Dockerfile uses multi-stage builds:

1. **Build Stage** - Compiles React app
2. **Production Stage** - Runs production server with built assets
3. **Development Stage** - Runs development server with hot reload

## Performance Optimization

### Reduce Build Time

Use BuildKit for faster builds:

```bash
DOCKER_BUILDKIT=1 docker build .
```

### Layer Caching

The Dockerfile is optimized for layer caching:
- Dependencies installed first (changes less frequently)
- Source code copied last (changes frequently)

## Security

### Production Security

- Runs as non-root user (node)
- Only production dependencies included
- No source maps in production
- Health checks enabled

### Development Security

- Development dependencies included for debugging
- Source maps enabled
- Hot reload enabled

## Updating

To update to the latest version:

```bash
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## Support

For issues related to Docker setup, check:

1. Docker logs: `docker-compose logs`
2. Container status: `docker ps -a`
3. System resources: `docker stats`
4. Disk usage: `docker system df`

---

**Last Updated:** 2025-11-16
**Docker Version:** 24.0+
**Docker Compose Version:** 2.0+
