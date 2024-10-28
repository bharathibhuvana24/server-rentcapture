import express from 'express';
import { addItemToCart, getUserCart, updateCart, clearCartOnLogout } from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/add/:id', addItemToCart);
router.get('/:id', getUserCart);
router.post('/update/:id', updateCart);
router.post('/clear/:id', clearCartOnLogout);

export default router;
