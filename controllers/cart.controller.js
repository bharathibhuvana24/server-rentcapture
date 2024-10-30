import Cart from '../model/cart.model.js';


// Add item to cart
export const addItemToCart = async (req, res) => {
  const { productId, quantity, imageUrl, name, pickupDate, dropDate, totalPrice } = req.body;
  const userId = req.params.id;
  console.log('Received Request to Add Item:', { userId, productId, quantity, imageUrl, name, pickupDate, dropDate, totalPrice }); // Log incoming request data
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
    console.log('Clear Cart Request for User ID:', userId); // Log user ID for debugging
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      console.log('Cart not found for User ID:', userId);
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    cart.items = [];
    await cart.save();
    console.log('Cart cleared for User ID:', userId);
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ success: false, message: 'Failed to destroy session' });
        }
        res.json({ success: true, message: 'Cart cleared successfully' });
      });
    } else {
      res.json({ success: true, message: 'Cart cleared successfully' });
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
};

