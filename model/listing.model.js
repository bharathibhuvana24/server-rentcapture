import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  imageUrls: {
    type: [String],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 62
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['new', 'like-new', 'used', 'fair'],
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['rent']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  offer: {
    type: Boolean,
    default: false
  },
  features: {
    type: String,
    trim: true
  },
  available: {
    type: Boolean,
    default: true
  },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupDate: {
    type: Date,
    required: true
  },
  dropDate: {
    type: Date,
    required: true
  }
});

const Listing = mongoose.model('Listing', listingSchema);
export default Listing ;
