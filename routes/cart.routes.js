import express from 'express';
import { addItemToCart, getUserCart, clearCartOnLogout } from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/update', addItemToCart);
router.get('/:userId', getUserCart);
router.post('/clear', clearCartOnLogout);

export default router;
