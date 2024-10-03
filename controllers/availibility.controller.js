export const checkAvailability = async (req, res) => {
    const { listingId, pickupDate, dropDate } = req.body;
    try {
      // Find listings that overlap with the requested dates
      const conflictingBookings = await Listing.find({
        _id: listingId,
        $or: [
          { pickupDate: { $lte: new Date(dropDate), $gte: new Date(pickupDate) } },
          { dropDate: { $lte: new Date(dropDate), $gte: new Date(pickupDate) } },
          { pickupDate: { $lte: new Date(pickupDate) }, dropDate: { $gte: new Date(dropDate) } },
          { pickupDate: { $gte: new Date(pickupDate) }, dropDate: { $lte: new Date(dropDate) } },
        ]
      });
  
      const available = conflictingBookings.length === 0;
      res.status(200).json({ available });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  