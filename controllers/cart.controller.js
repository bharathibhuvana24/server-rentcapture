import Cart from '../model/cart.model.js';

// Add item to cart
export const addItemToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    const existingItem = cart.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ success: false, message: 'Failed to add item to cart' });
  }
};

// Get user cart
export const getUserCart = async (req, res) => {
  const { userId } = req.query;
  try {
    const cart = await Cart.findOne({ userId });
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cart' });
  }
};

// Clear cart on logout
export const clearCartOnLogout = (req, res) => {
  req.session.destroy();
  res.json({ success: true });
};
