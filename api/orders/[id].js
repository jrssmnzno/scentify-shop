const { orders, enableCors, handlePreflight } = require('../data');

module.exports = (req, res) => {
  enableCors(res);

  if (handlePreflight(req, res)) return;

  const { id } = req.query;

  // PUT /api/orders/[id]
  if (req.method === 'PUT') {
    const { status } = req.body;
    const order = orders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (status) order.status = status;

    return res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
};
