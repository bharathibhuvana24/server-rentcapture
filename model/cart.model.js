import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  name: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  dropDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
});

export default mongoose.model('Cart', cartSchema);
