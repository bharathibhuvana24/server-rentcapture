import Listing from '../models/listing.model.js';

export const bookDates = async (req, res) => {
  const { listingId, userId, startDate, endDate, quantity } = req.body;
  try {
    const listing = await Listing.findById(listingId);

    // Check stock
    const totalBooked = listing.bookedDates.reduce((total, booking) => {
      if (booking.end >= new Date(startDate) && booking.start <= new Date(endDate)) {
        return total + booking.quantity;
      }
      return total;
    }, 0);

    if (totalBooked + quantity > listing.stock) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }

    // Book product
    listing.bookedDates.push({ userId, start: new Date(startDate), end: new Date(endDate), quantity });
    await listing.save();

    res.json({ success: true, listing });
  } catch (error) {
    console.error('Error booking product:', error);
    res.status(500).json({ success: false, message: 'Failed to book product' });
  }
};

export const bookProduct = bookDates;  // If bookProduct and bookDates are the same
