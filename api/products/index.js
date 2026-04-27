const { products, enableCors, handlePreflight } = require('../data');

module.exports = (req, res) => {
  enableCors(res);

  if (handlePreflight(req, res)) return;

  // GET /api/products
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  }

  // POST /api/products
  if (req.method === 'POST') {
    const { name, category, price, tag, img, rating, description, scentProfile } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    const newProduct = {
      id: Math.floor(Math.random() * 100000),
      name,
      category: category || 'Fashion',
      price,
      tag: tag || 'NEW',
      img: img || 'assets/img/default.png',
      rating: rating || 5,
      description,
      wishlist: false,
      scentProfile: scentProfile || 'Warm'
    };

    products.push(newProduct);
    return res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: newProduct
    });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
};
