# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ .
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Build Backend
FROM node:22-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ .

# Stage 3: Final Single Image
FROM node:22-alpine

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor

# Copy backend
WORKDIR /app/backend
COPY --from=backend-build /app/backend .

# Copy frontend to nginx
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copy config files
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisord.conf

# SQLite data directory
RUN mkdir -p /app/data

VOLUME ["/app/data"]

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]