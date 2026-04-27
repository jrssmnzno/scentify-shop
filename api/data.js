// Shared data store for Vercel serverless functions
// NOTE: Data resets on each deployment. For production, use a database (MongoDB, PostgreSQL, etc.)

let products = [
  { id: 1, name: 'Bomb Scent', category: 'Fashion', price: 199, tag: 'NEW', img: 'assets/img/bomb.png', rating: 4, description: 'Bold and long-lasting fragrance for everyday confidence.', wishlist: false, notes: ['Citrus', 'Musk', 'Amber'], mood: 'Bold', scentProfile: 'Warm' },
  { id: 2, name: 'Alpha Scent', category: 'Fashion', price: 399, tag: 'HOT', img: 'assets/img/alpha.png', rating: 5, description: 'Strong masculine scent with a premium and modern aroma.', wishlist: false, notes: ['Woody', 'Spicy', 'Leather'], mood: 'Confident', scentProfile: 'Warm' },
  { id: 3, name: 'Bright Scent', category: 'Fashion', price: 99, tag: 'NEW', img: 'assets/img/bright.png', rating: 3, description: 'Light and fresh scent perfect for casual daily use.', wishlist: false, notes: ['Floral', 'Fruity', 'Green'], mood: 'Fresh', scentProfile: 'Fresh' },
  { id: 4, name: 'Chance Scent', category: 'Fashion', price: 199, tag: 'NEW', img: 'assets/img/chance.png', rating: 4, description: 'Sweet and elegant fragrance with a youthful vibe.', wishlist: false, notes: ['Floral', 'Fruity', 'Vanilla'], mood: 'Playful', scentProfile: 'Sweet' },
  { id: 5, name: 'Dolce Scent', category: 'Fashion', price: 499, tag: 'NEW', img: 'assets/img/dolce.png', rating: 5, description: 'Luxurious scent inspired by high-end designer perfumes.', wishlist: false, notes: ['Floral', 'Woody', 'Musk'], mood: 'Elegant', scentProfile: 'Floral' }
];

let cart = [];
let orders = [];

// Helper: Enable CORS
function enableCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Handle preflight requests
function handlePreflight(req, res) {
  if (req.method === 'OPTIONS') {
    enableCors(res);
    res.status(200).end();
    return true;
  }
  return false;
}

module.exports = {
  products,
  cart,
  orders,
  enableCors,
  handlePreflight
};
