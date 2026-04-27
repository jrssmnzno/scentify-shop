const { cart, enableCors, handlePreflight } = require('../data');

module.exports = (req, res) => {
  enableCors(res);

  if (handlePreflight(req, res)) return;

  // GET /api/cart
  if (req.method === 'GET') {
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    return res.status(200).json({
      success: true,
      data: cart,
      count: cart.length,
      total
    });
  }

  // POST /api/cart
  if (req.method === 'POST') {
    const { product, quantity } = req.body;

    if (!product || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product and quantity are required'
      });
    }

    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    return res.status(200).json({
      success: true,
      message: `${product.name} added to cart`,
      data: cart,
      total
    });
  }

  // POST /api/cart/clear
  if (req.method === 'DELETE' && req.query.action === 'clear') {
    cart.length = 0;
    return res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
};
