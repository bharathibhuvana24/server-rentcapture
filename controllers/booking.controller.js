import Listing from '../model/listing.model.js';

export const bookDates = async (req, res) => {
  const { listingId, startDate, endDate } = req.body;
  try {
    const listing = await Listing.findById(listingId);
    listing.bookedDates.push({ start: new Date(startDate), end: new Date(endDate) });
    await listing.save();
    res.json({ success: true, listing });
  } catch (error) {
    console.error('Error booking dates:', error);
    res.status(500).json({ success: false, message: 'Failed to book dates' });
  }
};
