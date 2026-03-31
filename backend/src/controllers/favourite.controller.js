import Favourite from '../models/Favourite.js';
import Property from '../models/Property.js';


// GET /api/favourites
const getFavourites = async (req, res, next) => {
  try {
    const favs = await Favourite.find({ user: req.user._id })
      .populate('property')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: favs.length, data: favs.map((f) => f.property) });
  } catch (err) {
    next(err);
  }
};

// POST /api/favourites/:propertyId
const addFavourite = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });

    const exists = await Favourite.findOne({ user: req.user._id, property: req.params.propertyId });
    if (exists) return res.status(409).json({ success: false, message: 'Already in favourites.' });

    await Favourite.create({ user: req.user._id, property: req.params.propertyId });
    res.status(201).json({ success: true, message: `"${property.title}" added to favourites.` });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/favourites/:propertyId
const removeFavourite = async (req, res, next) => {
  try {
    // user: req.user._id ensures users can only delete their own favourites
    const fav = await Favourite.findOneAndDelete({ user: req.user._id, property: req.params.propertyId });
    if (!fav) return res.status(404).json({ success: false, message: 'Favourite not found.' });

    res.json({ success: true, message: 'Removed from favourites.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/favourites/check/:propertyId
const checkFavourite = async (req, res, next) => {
  try {
    const exists = await Favourite.exists({ user: req.user._id, property: req.params.propertyId });
    res.json({ success: true, isFavourited: !!exists });
  } catch (err) {
    next(err);
  }
};

export { getFavourites, addFavourite, removeFavourite, checkFavourite };

