# Scentify Configuration Guide

## API URL Configuration

The Scentify backend can run on any port and environment. The API URL is configured automatically based on the environment.

### Development

**Frontend** uses `http://localhost:3000` by default.

**Start Backend:**
```bash
cd backend
npm install
node server.js
# Server runs on port 3000
```

Or on a custom port:
```bash
PORT=5000 node server.js
# Server runs on port 5000
```

Then update `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000'  // Change port here
};
```

---

### Production (Online Hosting)

When deployed on Hostinger or any online hosting:

1. **Build frontend for production:**
   ```bash
   ng build --configuration production
   ```
   This uses `src/environments/environment.prod.ts` with `apiUrl: '/api'` (relative URL)

2. **Configure Nginx/Server Proxy:**
   The frontend makes requests to `/api/*` which the server proxies to the backend.

   **Example Nginx config:**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     
     # Frontend
     location / {
       root /home/public_html;
       try_files $uri $uri/ /index.html;
     }
     
     # API proxy
     location /api/ {
       proxy_pass http://localhost:3000/;
     }
   }
   ```

3. **Start backend on production server:**
   ```bash
   cd backend
   npm install
   PORT=3000 node server.js
   # Or use PM2:
   pm2 start server.js --name scentify-api
   pm2 startup
   pm2 save
   ```

---

### Environment Variables

**Backend (.env or CLI):**
```bash
PORT=3000              # Server port (default: 3000)
API_URL=https://...    # Optional: public URL for documentation
```

**Frontend (automatic):**
- Development: `http://localhost:3000`
- Production: `/api` (relative URL on same domain)

---

### Docker Deployment

**Dockerfile for backend:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY backend/ .
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]
```

**Run container on custom port:**
```bash
docker run -p 8000:3000 -e PORT=3000 scentify-api
# Container internal port: 3000
# Host port: 8000
```

Update frontend for Docker:
```typescript
// environment.prod.ts
apiUrl: 'http://yourdomain.com:8000'
```

---

### Troubleshooting

**"Error: Make sure backend server is running on port 3000"**
- ✅ Backend not started? Run `node server.js` in `backend/` folder
- ✅ Different port? Update `environment.ts` and `environment.prod.ts`
- ✅ CORS issues? Backend CORS is enabled by default
- ✅ Production? Make sure proxy is configured correctly

**Port already in use?**
```bash
# Find process using port 3000
lsof -i :3000

# Use different port
PORT=5000 node server.js
```

---

### Quick Reference

| Scenario | Backend | Frontend Config |
|----------|---------|-----------------|
| Local dev (default) | `PORT=3000 node server.js` | `environment.ts` → `http://localhost:3000` |
| Local dev (custom port) | `PORT=5000 node server.js` | `environment.ts` → `http://localhost:5000` |
| Hostinger production | `node server.js` (port 3000 via reverse proxy) | `environment.prod.ts` → `/api` |
| Docker local | `docker run -p 8000:3000 scentify` | `http://localhost:8000` |
| Docker production | Internal 3000, external via proxy | `/api` (relative) |
