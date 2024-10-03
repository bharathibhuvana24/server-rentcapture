import Listing from '../model/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    const newListing = new Listing({
      ...req.body,
      userRef: req.user.id, // Add user reference
    });
    const savedListing = await newListing.save();
    res.status(201).json({ success: true, listing: savedListing });
  } catch (error) {
    next(error);
  }
};


export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef.toString()) { // Ensure IDs match as strings
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};


export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef.toString()) { // Ensure IDs match as strings
      return next(errorHandler(401, 'You can only update your own listings!'));
    }
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, listing: updatedListing }); // Include success key and updated listing
  } catch (error) {
    next(error);
  }
};



export const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    console.log('Fetched listing:', listing); // Log fetched listing
    res.status(200).json({ success: true, listing });
  } catch (error) {
    console.error('Get listing error:', error); // Log error
    res.status(500).json({ success: false, message: 'Failed to fetch listing', error });
  }
};



export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let available = req.query.available;

    if (available === undefined || available === 'false') {
      available = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['rent'] }; // Only 'rent' for camera rentals
    }

    const searchTerm = req.query.searchTerm || '';
    const brand = req.query.brand || '';
    const model = req.query.model || '';
;

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      brand: { $regex: brand, $options: 'i' },
      model: { $regex: model, $options: 'i' },
      
      offer,
      available,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json({ success: true, listings });
  } catch (error) {
    next(error);
  }
};
