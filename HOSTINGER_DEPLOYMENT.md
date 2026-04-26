# Hostinger Deployment (Scentify)

This project has:
- Frontend: Angular/Ionic app (build output: `www/`)
- Backend: Node/Express API (`backend/server.js`)

Use one of these deployment modes:
1. **Shared Hosting**: frontend only
2. **VPS/Cloud Hosting**: frontend + backend (recommended)

---

## 1) Pre-deployment checklist

Run from project root:

```bash
npm install
npm run build
```

Expected result:
- Production files generated in `www/`
- `www/.htaccess` exists (copied automatically by Angular build)

---

## 2) Shared Hosting (frontend only)

Use this only if you do not need the Node backend on Hostinger.

### Step-by-step

1. Open **hPanel -> Files -> File Manager**
2. Go to `public_html/`
3. Delete old site files in `public_html/` (except files you still need)
4. Upload **contents of `www/`** into `public_html/`  
   (upload the files inside `www`, not the `www` folder itself)
5. Confirm these files exist in `public_html/`:
   - `index.html`
   - `.htaccess`
   - `main-*.js`, `styles-*.css`, `assets/`
6. Open your domain and test refresh on a deep route (Angular SPA routing)

### Important

Your current production API URL is `'/api'` in `src/environments/environment.prod.ts`.  
On shared hosting, this will work only if `/api` is routed to a real backend service.

If backend is external (for example `https://api.yourdomain.com`), set:

```ts
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com'
};
```

Then rebuild and re-upload `www/`.

---

## 3) VPS/Cloud Hosting (frontend + backend)

This is the complete setup for this project.

## A. Deploy backend

1. SSH into your VPS
2. Create app directory and upload `backend/` folder
3. Install dependencies:

```bash
cd /var/www/scentify/backend
npm install
```

4. Start with PM2:

```bash
npm install -g pm2
pm2 start server.js --name scentify-api
pm2 save
pm2 startup
```

5. Verify backend:

```bash
curl http://127.0.0.1:3000/products
```

## B. Deploy frontend

1. Build locally:

```bash
npm run build
```

2. Upload `www/` contents to VPS web root (for example `/var/www/scentify/public_html`)
3. Ensure `.htaccess` is present in web root

## C. Route `/api` to backend

For production-grade VPS setup, do reverse proxy in web server (Nginx/Apache vhost), not only in `.htaccess`.

Example Nginx block:

```nginx
location /api/ {
  proxy_pass http://127.0.0.1:3000/;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

With this setup, keep `apiUrl: '/api'` in production environment.

---

## 4) SSL and domain

1. In hPanel, enable SSL (Let's Encrypt)
2. Force HTTPS (either in host settings or `.htaccess`)
3. Test:
   - `https://yourdomain.com`
   - `https://yourdomain.com/admin` (refresh should still work)
   - `https://yourdomain.com/api/products` (should return JSON if backend is live)

---

## 5) Smoke test after deploy

1. Load homepage
2. Open browser DevTools -> Network
3. Confirm static assets are 200
4. Confirm API requests are 200 (`/api/products`, `/api/cart`, `/api/orders`)
5. Test:
   - Add product (admin)
   - Add to cart
   - Place order

---

## 6) Common issues

1. `404` on route refresh:
   - `.htaccess` missing in `public_html/`
   - mod_rewrite not enabled

2. `500` due to rewrite/proxy:
   - Host does not allow proxy rules in `.htaccess`
   - Move reverse proxy config to server vhost (VPS)

3. API unreachable:
   - backend not running
   - wrong `apiUrl`
   - firewall blocking port 3000 (when proxying incorrectly)

4. New deploy not visible:
   - browser/CDN cache
   - purge cache and hard refresh

---

## 7) Recommended release flow

For each release:

1. `npm run build`
2. Upload new `www/` contents
3. If backend changed: upload `backend/`, run `npm install`, then `pm2 restart scentify-api`
4. Run smoke test list above
