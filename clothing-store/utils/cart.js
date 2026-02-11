exports.getCartWithTotals = async (sessionCart, Product) => {
  const cart = sessionCart || {};
  const ids = Object.keys(cart);
  if (!ids.length) {
    return { items: [], subtotal: 0, shippingFee: 0, total: 0 };
  }

  const products = await Product.find({ _id: { $in: ids } }).lean();
  const productMap = new Map(products.map((p) => [String(p._id), p]));

  const items = ids
    .map((id) => {
      const product = productMap.get(id);
      if (!product) return null;
      const quantity = Number(cart[id].quantity || 0);
      const lineTotal = product.price * quantity;
      return {
        product,
        quantity,
        lineTotal
      };
    })
    .filter(Boolean);

  const subtotal = items.reduce((acc, item) => acc + item.lineTotal, 0);
  const shippingFee = subtotal > 0 && subtotal < 1999 ? 99 : 0;
  const total = subtotal + shippingFee;

  return { items, subtotal, shippingFee, total };
};
