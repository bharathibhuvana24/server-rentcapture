import express from 'express';
import { addItemToCart, getUserCart, updateCart, clearCartOnLogout } from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/add', addItemToCart);
router.get('/', getUserCart);
router.post('/update', updateCart);
router.post('/clear', clearCartOnLogout);

export default router;
