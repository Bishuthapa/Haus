import express from 'express';
import { getFavourites, addFavourite, removeFavourite, checkFavourite } from '../controllers/favourite.controller.js';
import protect  from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // all routes below require auth

router.get('/', getFavourites);
router.get('/check/:propertyId', checkFavourite);
router.post('/:propertyId', addFavourite);
router.delete('/:propertyId', removeFavourite);

export default router;
