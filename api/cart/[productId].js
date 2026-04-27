const { cart, enableCors, handlePreflight } = require('../data');

module.exports = (req, res) => {
  enableCors(res);

  if (handlePreflight(req, res)) return;

  const { productId } = req.query;

  // DELETE /api/cart/[productId]
  if (req.method === 'DELETE') {
    const initialLength = cart.length;
    const filteredCart = cart.filter(item => item.product.id !== parseInt(productId));

    if (filteredCart.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }

    cart.length = 0;
    cart.push(...filteredCart);

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart,
      total
    });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
};
