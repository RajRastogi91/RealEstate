import express from 'express';
import { addFavorite, removeFavorite, getFavoriteProperties } from '../Controllers/favorite.controller.js';
const router = express.Router();

router.post('/addFavorite', addFavorite);
router.delete('/removeFavorite', removeFavorite);
router.get('/getFavoriteProperties/:id', getFavoriteProperties)

export default router;  