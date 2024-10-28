import express from 'express';
import { addItemToCart, getUserCart, clearCartOnLogout } from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/add', addItemToCart);
router.get('/', getUserCart);
router.post('/logout', clearCartOnLogout);

export default router;
