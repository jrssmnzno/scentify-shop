# Vercel Quick Start

## 1-Minute Setup

### Prerequisites
```bash
npm install -g vercel
```

### Deploy in 3 Commands
```bash
npm install
npm run build
npm run deploy:prod
```

That's it! Your Scentify shop is live on Vercel. ✅

---

## Local Testing Before Deploy

```bash
# Install Vercel CLI development server
vercel dev

# Your app runs at http://localhost:3000
# Frontend: http://localhost:3000
# API: http://localhost:3000/api/products
```

---

## Set Custom Domain

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Domains
4. Add your domain and follow DNS setup

---

## Environment Variables (Optional)

If you add a database later, add to Vercel:

1. Dashboard → Project Settings → Environment Variables
2. Add: `MONGODB_URI=mongodb+srv://...`
3. Redeploy: `vercel --prod`

---

## Revert to Old Backend (if needed)

If you want to keep using `backend/server.js` locally:

```bash
cd backend
npm install
node server.js
```

Frontend still points to `http://localhost:3000` in `environment.ts`.

---

## API Endpoints

```
🌐 Frontend: https://your-project.vercel.app
📦 API: https://your-project.vercel.app/api

GET    /api/products              # List all products
POST   /api/products              # Add product
PUT    /api/products/:id          # Update product
DELETE /api/products/:id          # Delete product

GET    /api/cart                  # Get cart
POST   /api/cart                  # Add to cart
DELETE /api/cart/:productId       # Remove from cart
DELETE /api/cart?action=clear     # Clear cart

GET    /api/orders                # Get orders
POST   /api/orders                # Create order
PUT    /api/orders/:id            # Update order status
```

---

See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed documentation.
