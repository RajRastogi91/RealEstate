import express from 'express';
import { addFavorite, removeFavorite } from '../Controllers/favorite.controller';
const router = express.Router();

router.post('/favorite', addFavorite);
router.delete('/favorite', removeFavorite);

export default router;