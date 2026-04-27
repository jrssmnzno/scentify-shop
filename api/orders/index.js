const { orders, enableCors, handlePreflight } = require('../data');

module.exports = (req, res) => {
  enableCors(res);

  if (handlePreflight(req, res)) return;

  // GET /api/orders
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: orders,
      count: orders.length
    });
  }

  // POST /api/orders
  if (req.method === 'POST') {
    const { customerName, address, contact, items, deliveryService, total, status } = req.body;

    if (!customerName || !items || !total) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customerName, items, total'
      });
    }

    const newOrder = {
      id: 'ORD-' + Math.floor(Math.random() * 10000),
      customerName,
      address,
      contact,
      items,
      deliveryService,
      total,
      status: status || 'Pending',
      date: new Date().toISOString()
    };

    orders.unshift(newOrder);
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder
    });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
};
