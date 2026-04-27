const { products, enableCors, handlePreflight } = require('../data');

module.exports = (req, res) => {
  enableCors(res);

  if (handlePreflight(req, res)) return;

  const { id } = req.query;

  // PUT /api/products/[id]
  if (req.method === 'PUT') {
    const { name, price, description, tag, img, scentProfile } = req.body;
    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (tag) product.tag = tag;
    if (img) product.img = img;
    if (scentProfile) product.scentProfile = scentProfile;

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  }

  // DELETE /api/products/[id]
  if (req.method === 'DELETE') {
    const index = products.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const deletedProduct = products.splice(index, 1);
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct[0]
    });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
};
