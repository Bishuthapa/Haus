import Property from '../models/Property.js';

const SEED = [
  {
    title: 'Modern Downtown Apartment',
    description: 'Stunning city-centre apartment with panoramic views and premium finishes.',
    price: 450000,
    location: { address: '12 Skyline Ave', city: 'Kathmandu', country: 'Nepal' },
    type: 'apartment', bedrooms: 2, bathrooms: 2, area: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
  },
  {
    title: 'Charming Heritage Villa',
    description: 'Beautifully restored villa with lush garden and spacious living areas.',
    price: 890000,
    location: { address: '8 Boudha Ring Road', city: 'Kathmandu', country: 'Nepal' },
    type: 'villa', bedrooms: 4, bathrooms: 3, area: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
  },
  {
    title: 'Cozy Studio in Thamel',
    description: 'Bright fully-furnished studio, walking distance to restaurants and nightlife.',
    price: 145000,
    location: { address: '3 Thamel Marg', city: 'Kathmandu', country: 'Nepal' },
    type: 'studio', bedrooms: 0, bathrooms: 1, area: 420,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
  },
  {
    title: 'Lakeside Family House',
    description: 'Spacious family home with lake views, private garden, and modern kitchen.',
    price: 620000,
    location: { address: '22 Fewa Lake Rd', city: 'Pokhara', country: 'Nepal' },
    type: 'house', bedrooms: 3, bathrooms: 2, area: 1850,
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600',
  },
  {
    title: 'Luxury Penthouse Suite',
    description: 'Exclusive penthouse with private rooftop terrace and jacuzzi.',
    price: 1250000,
    location: { address: '1 Durbar Marg Tower', city: 'Kathmandu', country: 'Nepal' },
    type: 'apartment', bedrooms: 3, bathrooms: 3, area: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
  },
];

// GET /api/properties
const getProperties = async (req, res, next) => {
  try {
    let properties = await Property.find({ isAvailable: true }).sort({ createdAt: -1 });
    if (properties.length === 0) properties = await Property.insertMany(SEED);
    res.json({ success: true, count: properties.length, data: properties });
  } catch (err) {
    next(err);
  }
};

// GET /api/properties/:id
const getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });
    res.json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
};

export { getProperties, getProperty };

