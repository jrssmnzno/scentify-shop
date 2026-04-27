# Scentify - Vercel Deployment Guide

## ✅ What Has Been Converted

Your Scentify project has been successfully converted to be **Vercel-compatible**. Here's what changed:

### 📁 New Structure
```
Scentify/
├── api/                          # ⭐ NEW: Vercel Serverless Functions
│   ├── data.js                   # Shared data store
│   ├── products/
│   │   ├── index.js              # GET/POST /api/products
│   │   └── [id].js               # PUT/DELETE /api/products/:id
│   ├── cart/
│   │   ├── index.js              # GET/POST /api/cart
│   │   └── [productId].js        # DELETE /api/cart/:productId
│   └── orders/
│       ├── index.js              # GET/POST /api/orders
│       └── [id].js               # PUT /api/orders/:id
├── src/                          # Angular frontend (unchanged)
├── www/                          # Built static files
├── vercel.json                   # ⭐ NEW: Vercel configuration
├── .vercelignore                 # ⭐ NEW: Files to exclude from deployment
└── package.json                  # ✏️ UPDATED: Build scripts
```

### 🔄 Key Changes

#### 1. **Backend Conversion**
- Old: Single Express server (`backend/server.js`) - Not compatible with Vercel
- New: Modular serverless functions in `api/` directory ✅

#### 2. **Environment Configuration**
- **Development** (`src/environments/environment.ts`): `apiUrl: 'http://localhost:3000'`
- **Production** (`src/environments/environment.prod.ts`): `apiUrl: '/api'` (relative URL for Vercel)

#### 3. **Build & Deploy Scripts**
```json
"build": "ng build --configuration production",
"deploy": "vercel",
"deploy:prod": "vercel --prod"
```

---

## 🚀 How to Deploy to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# First deployment (preview)
npm run deploy

# Production deployment
npm run deploy:prod
```

**OR** use GitHub integration:
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Select your GitHub repository
5. Click "Deploy" (Vercel auto-detects Angular)

---

## 📝 API Endpoints (Now on Vercel)

After deployment, your API will be available at:
```
https://your-project.vercel.app/api/
```

### Products
- `GET  /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT  /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart
- `GET    /api/cart` - Get cart items
- `POST   /api/cart` - Add to cart
- `DELETE /api/cart/:productId` - Remove from cart
- `DELETE /api/cart?action=clear` - Clear cart

### Orders
- `GET    /api/orders` - Get all orders
- `POST   /api/orders` - Create order
- `PUT    /api/orders/:id` - Update order status

---

## ⚠️ Important: Data Persistence

**Current Limitation:**
- Data stored in-memory resets on each Vercel deployment
- The `api/data.js` file holds sample data that gets reloaded

### 🔗 Solution: Add a Real Database

To keep data persistent between deployments, connect a database. Here are recommended options:

#### Option A: MongoDB Atlas (Recommended for this project)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get connection string
3. Install MongoDB package:
   ```bash
   npm install mongodb
   ```
4. Update `api/data.js` to use MongoDB instead of in-memory storage
5. Set `MONGODB_URI` in Vercel environment variables

#### Option B: PostgreSQL (via Vercel Postgres)
1. Go to Vercel Dashboard → Storage → Create Database → Postgres
2. Install client: `npm install @vercel/postgres`
3. Update API functions to use SQL queries

#### Option C: Supabase (Firebase alternative)
1. Create free account at [Supabase](https://supabase.com)
2. Get API key and project URL
3. Install: `npm install @supabase/supabase-js`
4. Use in API functions

**Example with MongoDB:**
```javascript
// api/data.js (modified)
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('scentify');

async function getProducts() {
  return await db.collection('products').find({}).toArray();
}
```

---

## 🔧 Local Development

### Option 1: Use Vercel Functions Locally
```bash
npm install -g vercel
vercel dev
```
This runs your app at `http://localhost:3000` with live API endpoints.

### Option 2: Use Old Backend Server
```bash
# Terminal 1: Run Angular frontend
npm start

# Terminal 2: Run Express backend
cd backend
npm install
node server.js
```

---

## 📦 What to Do With Old Files

After deploying to Vercel, you can **archive** or **remove**:
- ❌ `backend/` directory (replaced by `/api` functions)
- ❌ `android/` directory (if not building native app)
- ❌ `.vercelignore` already excludes these

Keep for reference:
- ✅ `backend/server.js` - Reference for how routes were structured
- ✅ Original files in Git history

---

## 🆘 Troubleshooting

### "Build failed: Cannot find module"
- Run: `npm install` before deploying
- Check Node version: `node --version` (should be 18+)

### "API returns 404"
- Make sure `vercel.json` is in root directory
- Check that `/api` route is properly configured

### "CORS errors in frontend"
- Ensure `enableCors(res)` is called in each API function
- Check that `Access-Control-Allow-Origin` header includes your domain

### "Data is reset after deployment"
- This is expected with in-memory storage
- **Solution:** Migrate to MongoDB/PostgreSQL (see above)

---

## 📚 Example Frontend HTTP Calls

Your Angular services already work! Just ensure environment config is correct:

```typescript
// services/product.service.ts
import { environment } from '../../environments/environment';

@Injectable()
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get(`${this.apiUrl}`);
  }
}
```

---

## ✨ Next Steps

1. **Test locally** with `vercel dev`
2. **Deploy preview** with `npm run deploy`
3. **Review preview URL**
4. **Deploy to production** with `npm run deploy:prod`
5. **Set up database** for data persistence
6. **Enable custom domain** in Vercel Dashboard

---

## 📖 Useful Links
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Functions Guide](https://vercel.com/docs/functions/serverless-functions)
- [Angular on Vercel](https://vercel.com/guides/deploying-angular)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

**Ready to deploy? Run:** `npm run deploy:prod` 🚀
