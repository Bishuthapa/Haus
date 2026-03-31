import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    type: {
      type: String,
      enum: ['apartment', 'house', 'villa', 'studio', 'commercial'],
      default: 'apartment',
    },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number }, // sq ft
    imageUrl: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Property', propertySchema);
