import express from 'express';
import { addFavorite, removeFavorite } from '../Controllers/favorite.controller.js';
const router = express.Router();

router.post('/addFavorite', addFavorite);
router.delete('/removeFavorite', removeFavorite);

export default router;