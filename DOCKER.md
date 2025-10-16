# Docker Deployment Guide

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed

### Run Everything with One Command

```bash
docker-compose up --build
```

This will:
- Start MongoDB container on port 27017
- Build and start backend on port 5000
- Build and start frontend on port 3000

Access the app at: http://localhost:3000

### Individual Services

#### MongoDB Only
```bash
docker-compose up mongodb
```

#### Backend Only
```bash
docker-compose up backend
```

#### Frontend Only
```bash
docker-compose up frontend
```

### Stopping Services

```bash
docker-compose down
```

To remove volumes (database data):
```bash
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Rebuild After Changes

```bash
docker-compose up --build
```

### Production Build

For production, use environment variables:

```bash
# Create .env file
echo "MONGO_URI=mongodb://mongodb:27017/creditsea" > backend/.env

# Build and run
docker-compose -f docker-compose.yml up -d
```

### Access MongoDB

```bash
docker exec -it creditsea-mongo mongosh creditsea
```

Then run MongoDB commands:
```javascript
db.reports.find().pretty()
db.reports.count()
```

### Troubleshooting

#### Port Already in Use
Change ports in `docker-compose.yml`:
```yaml
ports:
  - "5001:5000"  # backend
  - "3001:80"    # frontend
```

#### MongoDB Connection Issues
Check if MongoDB is running:
```bash
docker-compose ps
```

View backend logs:
```bash
docker-compose logs backend
```

#### Frontend Can't Reach Backend
Ensure services are on the same Docker network. The nginx.conf proxies `/api` to `backend:5000`.

### Docker Hub Deployment

Build and push to Docker Hub:

```bash
# Tag images
docker tag creditsea_backend:latest yourusername/creditsea-backend:latest
docker tag creditsea_frontend:latest yourusername/creditsea-frontend:latest

# Push
docker push yourusername/creditsea-backend:latest
docker push yourusername/creditsea-frontend:latest
```

### Kubernetes Deployment (Advanced)

Create k8s manifests:
```bash
kubectl create deployment creditsea-backend --image=yourusername/creditsea-backend:latest
kubectl expose deployment creditsea-backend --port=5000
kubectl create deployment creditsea-frontend --image=yourusername/creditsea-frontend:latest
kubectl expose deployment creditsea-frontend --port=80 --type=LoadBalancer
```

## Environment Variables

### Backend
- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

### Frontend
- Built at compile time, set in Dockerfile if needed

## Performance Optimization

### Production Dockerfile Optimizations

Backend:
- Multi-stage builds
- Node alpine image (smaller)
- Production dependencies only

Frontend:
- Multi-stage build
- Nginx for serving static files
- Gzip compression enabled

### Scaling

Scale services:
```bash
docker-compose up --scale backend=3
```

Use a load balancer (nginx/HAProxy) in front of multiple backend instances.

## Security

1. Don't expose MongoDB port in production
2. Use secrets for sensitive data
3. Run containers as non-root user
4. Scan images for vulnerabilities:
   ```bash
   docker scan creditsea_backend
   ```

## CI/CD with Docker

Add to `.github/workflows/docker.yml`:

```yaml
name: Docker Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build images
        run: docker-compose build
      - name: Run tests
        run: docker-compose run backend npm test
```
