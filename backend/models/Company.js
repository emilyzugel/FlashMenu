import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: '/images/default-product.jpg'
  },
  category: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const companySchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    default: '/images/default-logo.jpg'
  },
  category: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  minOrderValue: {
    type: Number,
    default: 0
  },
  openingHours: {
    Monday: { open: String, close: String },
    Tuesday: { open: String, close: String },
    Wednesday: { open: String, close: String },
    Thursday: { open: String, close: String },
    Friday: { open: String, close: String },
    Saturday: { open: String, close: String },
    Sunday: { open: String, close: String }
  },
  products: [productSchema],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index para busca mais rápida
companySchema.index({ slug: 1, active: 1 });
companySchema.index({ category: 1, active: 1 });

export default mongoose.model('Company', companySchema);
