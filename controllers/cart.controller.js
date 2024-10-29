import Cart from '../model/cart.model.js';

// Add item to cart


export const addItemToCart = async (req, res) => {
  const { productId, quantity, imageUrl, name, pickupDate, dropDate, totalPrice } = req.body;
  const userId = req.params.id;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    const existingItem = cart.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, imageUrl, name, pickupDate, dropDate, totalPrice });
    }
    await cart.save();
    console.log('Updated Cart:', cart); // Log updated cart
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ success: false, message: 'Failed to add item to cart' });
  }
};

// Get user cart
export const getUserCart = async (req, res) => {
  const userId = req.params.id;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = { items: [] }; // Ensure cart is never null
    }
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cart' });
  }
};

// Update cart
export const updateCart = async (req, res) => {
  const { items } = req.body;
  const userId = req.params.id;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items });
    } else {
      cart.items = items;
    }
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ success: false, message: 'Failed to update cart' });
  }
};

// Clear cart on logout
export const clearCartOnLogout = async (req, res) => {
  const userId = req.params.id;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    req.session.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
};
