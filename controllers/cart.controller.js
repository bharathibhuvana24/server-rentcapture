import Cart from '../model/cart.model.js';
import Listing from '../model/listing.model.js'


// Add item to cart

export const addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.params.id;

  try {
    // Find the listing to check stock
    const listing = await Listing.findById(productId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Calculate the total booked quantity for this product in the cart
    const totalBooked = cart.items.reduce((total, item) => {
      if (item.productId.toString() === productId) {
        return total + item.quantity;
      }
      return total;
    }, 0);

    // Check if adding the requested quantity exceeds available stock
    if (totalBooked + quantity > listing.stock) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }

    // Add item to cart or update existing item
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ 
        productId, 
        quantity,
        imageUrl: listing.imageUrls[0], // Ensure the imageUrl is added
        name: listing.name, // Ensure the name is added
        pickupDate: req.body.pickupDate, // Include pickupDate from request
        dropDate: req.body.dropDate, // Include dropDate from request
        totalPrice: listing.price * quantity, // Calculate totalPrice
      });
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

