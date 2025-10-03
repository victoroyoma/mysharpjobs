#!/bin/bash

# MySharpJob Production Deployment Script
set -e

echo "🚀 Starting MySharpJob Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="mysharpjob"
DOMAIN="mysharpjob.com"
BACKEND_PORT=5000
FRONTEND_PORT=3000

echo -e "${YELLOW}📋 Pre-deployment Checklist${NC}"

# Check if required tools are installed
command -v docker >/dev/null 2>&1 || { echo -e "${RED}❌ Docker is required but not installed.${NC}" >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo -e "${RED}❌ Docker Compose is required but not installed.${NC}" >&2; exit 1; }
command -v nginx >/dev/null 2>&1 || { echo -e "${YELLOW}⚠️ Nginx is recommended for production.${NC}"; }

echo -e "${GREEN}✅ All required tools are available${NC}"

# Environment setup
echo -e "${YELLOW}🔧 Setting up environment...${NC}"

# Create production environment file if it doesn't exist
if [ ! -f ".env.production" ]; then
    echo "Creating production environment file..."
    cat > .env.production << EOF
NODE_ENV=production
PORT=$BACKEND_PORT
FRONTEND_URL=https://$DOMAIN
BACKEND_URL=https://api.$DOMAIN

# Database
MONGODB_URI=mongodb://mongo:27017/mysharpjob_production
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email (Configure with your provider)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment Gateways
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=your-paystack-public-key
FLUTTERWAVE_SECRET_KEY=your-flutterwave-secret-key
FLUTTERWAVE_PUBLIC_KEY=your-flutterwave-public-key

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Monitoring
SENTRY_DSN=your-sentry-dsn

# Security
CORS_ORIGIN=https://$DOMAIN
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
EOF

    echo -e "${YELLOW}⚠️ Please update .env.production with your actual credentials${NC}"
    read -p "Press enter to continue once you've updated the environment file..."
fi

# Create Docker Compose for production
echo -e "${YELLOW}🐳 Creating Docker configuration...${NC}"

cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  # Frontend
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    ports:
      - "$FRONTEND_PORT:80"
    depends_on:
      - backend
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: unless-stopped
    env_file:
      - .env.production
    ports:
      - "$BACKEND_PORT:5000"
    depends_on:
      - mongo
      - redis
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads

  # MongoDB Database
  mongo:
    image: mongo:6.0
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: \${MONGO_ROOT_PASSWORD:-strongpassword}
      MONGO_INITDB_DATABASE: mysharpjob_production
    volumes:
      - mongo_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    ports:
      - "27017:27017"

  # Redis for caching and sessions
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass \${REDIS_PASSWORD:-redispassword}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  # Nginx Load Balancer
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - frontend
      - backend

volumes:
  mongo_data:
  redis_data:
EOF

# Create Frontend Dockerfile
cat > Dockerfile.frontend << EOF
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Create Backend Dockerfile
cat > backend/Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["node", "dist/server.js"]
EOF

# Create Nginx configuration
cat > nginx.prod.conf << EOF
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:5000;
    }

    upstream frontend {
        server frontend:80;
    }

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=1r/s;

    server {
        listen 80;
        server_name $DOMAIN www.$DOMAIN;
        
        # Redirect to HTTPS
        return 301 https://\$server_name\$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name $DOMAIN www.$DOMAIN;

        # SSL Configuration
        ssl_certificate /etc/ssl/certs/fullchain.pem;
        ssl_certificate_key /etc/ssl/certs/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Security Headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

        # API Routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Login rate limiting
        location /api/auth/login {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Socket.IO
        location /socket.io/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Static files caching
        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF

# Create MongoDB initialization script
cat > mongo-init.js << EOF
db.createUser({
  user: 'mysharpjob',
  pwd: 'mysharpjob_password',
  roles: [
    {
      role: 'readWrite',
      db: 'mysharpjob_production'
    }
  ]
});

db.createCollection('users');
db.createCollection('jobs');
db.createCollection('payments');
db.createCollection('messages');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ location: 1 });
db.users.createIndex({ skills: 1 });
db.jobs.createIndex({ clientId: 1 });
db.jobs.createIndex({ artisanId: 1 });
db.jobs.createIndex({ status: 1 });
db.jobs.createIndex({ location: 1 });
db.payments.createIndex({ jobId: 1 });
db.payments.createIndex({ status: 1 });
EOF

# Create health check endpoint
echo -e "${YELLOW}🏥 Creating health check endpoint...${NC}"

cat > backend/src/routes/health.ts << EOF
import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV
  };

  res.status(200).json(healthcheck);
});

export default router;
EOF

# Create deployment scripts
echo -e "${YELLOW}📝 Creating deployment scripts...${NC}"

cat > deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Deploying MySharpJob to production..."

# Build and start services
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Run health checks
echo "🏥 Running health checks..."
curl -f http://localhost:5000/health || { echo "❌ Backend health check failed"; exit 1; }
curl -f http://localhost:3000 || { echo "❌ Frontend health check failed"; exit 1; }

echo "✅ Deployment completed successfully!"
echo "🌐 Application is running at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   API Docs: http://localhost:5000/api-docs"
EOF

chmod +x deploy.sh

cat > backup.sh << 'EOF'
#!/bin/bash
set -e

BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

echo "💾 Creating backup..."

# Backup MongoDB
docker exec mysharpjob_mongo_1 mongodump --db mysharpjob_production --out /tmp/backup
docker cp mysharpjob_mongo_1:/tmp/backup $BACKUP_DIR/mongodb

# Backup uploaded files
cp -r ./uploads $BACKUP_DIR/

# Backup environment files
cp .env.production $BACKUP_DIR/

echo "✅ Backup created at $BACKUP_DIR"
EOF

chmod +x backup.sh

# Create monitoring setup
echo -e "${YELLOW}📊 Setting up monitoring...${NC}"

cat > monitoring/docker-compose.monitoring.yml << EOF
version: '3.8'

services:
  # Prometheus for metrics
  prometheus:
    image: prom/prometheus:latest
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  # Grafana for dashboards
  grafana:
    image: grafana/grafana:latest
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  prometheus_data:
  grafana_data:
EOF

# Final instructions
echo -e "${GREEN}✅ Production setup completed!${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Update .env.production with your actual credentials"
echo "2. Obtain SSL certificates and place them in ./ssl/ directory"
echo "3. Update DNS records to point to your server"
echo "4. Run: ./deploy.sh"
echo ""
echo -e "${YELLOW}🔧 Useful Commands:${NC}"
echo "• Deploy: ./deploy.sh"
echo "• Backup: ./backup.sh"
echo "• Logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "• Scale: docker-compose -f docker-compose.prod.yml up -d --scale backend=3"
echo ""
echo -e "${GREEN}🎉 Your MySharpJob application is ready for production!${NC}"
